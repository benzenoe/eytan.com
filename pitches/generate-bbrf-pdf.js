#!/usr/bin/env node
// BBRF-PT memorandum PDF generator — renders the dedicated pdf-source files.
// Usage: node generate-bbrf-pdf.js
// Requires puppeteer (uses the install in ~/bogen-ai if not local).
const path = require('path');
const fs = require('fs');

let puppeteer;
try { puppeteer = require('puppeteer'); }
catch { puppeteer = require(path.join(require('os').homedir(), 'bogen-ai/node_modules/puppeteer')); }

const JOBS = [
  { src: 'bbrf-pt-pdf-source.html',    out: 'BBRF-PT-Investor-Memorandum.pdf' },
  { src: 'bbrf-pt-fr-pdf-source.html', out: 'BBRF-PT-Memorandum-Investisseur.pdf' },
];

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  for (const { src, out } of JOBS) {
    const page = await browser.newPage();
    // A4 at 96dpi = 794 × 1123
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    await page.goto('file://' + path.resolve(__dirname, src), { waitUntil: 'networkidle0', timeout: 60000 });
    await new Promise(r => setTimeout(r, 2500));   // fonts + charts
    const outputPath = path.resolve(__dirname, out);
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: false,                       // headers/footers are in the HTML
      margin: { top: 0, bottom: 0, left: 0, right: 0 }, // CSS owns all margins
      preferCSSPageSize: false,
    });
    await page.close();
    console.log(`✓ ${out}  (${(fs.statSync(outputPath).size / 1024).toFixed(0)} KB)`);
  }
  await browser.close();
})();
