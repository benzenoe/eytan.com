#!/usr/bin/env python3
"""
Rebuild Portuguese blog post with proper structure from English template
"""

# Read the English source file
with open('../ai-acceleration-power-race-2026.html', 'r', encoding='utf-8') as f:
    english_html = f.read()

# Read the current Portuguese file to extract translations
with open('ai-acceleration-power-race-2026.html', 'r', encoding='utf-8') as f:
    portuguese_html = f.read()

# Start building the new Portuguese file from English structure
new_pt_html = english_html

# Fix 1: Change lang="en" to lang="pt" on line 2
new_pt_html = new_pt_html.replace('<html lang="en">', '<html lang="pt">', 1)

# Fix 2: Add cache bust comment and remove English chart protection comment
# Keep the simple Portuguese version without the detailed English comments
cache_comment = '    <!-- Cache bust: 2026-02-23-v3 -->\n'
chart_protection_start = '<!--\n═══════════════════════════════════════════════════════════════════════════════'
chart_protection_end = '═══════════════════════════════════════════════════════════════════════════════\n-->\n'

if chart_protection_start in new_pt_html:
    start_idx = new_pt_html.find(chart_protection_start)
    end_idx = new_pt_html.find(chart_protection_end) + len(chart_protection_end)
    new_pt_html = new_pt_html[:start_idx] + new_pt_html[end_idx:]

# Fix 3: Update all meta tags to Portuguese
# Title
new_pt_html = new_pt_html.replace(
    '<title>AI Acceleration & Societal Shock Risk: Insights to 2035. - Eytan Benzeno</title>',
    '<title>Aceleração da IA: Riscos Sociais até 2035 - Eytan Benzeno</title>'
)

# Meta title
new_pt_html = new_pt_html.replace(
    '<meta name="title" content="AI Acceleration & Societal Shock Risk: Insights to 2035. - Eytan Benzeno">',
    '<meta name="title" content="Aceleração da IA: Riscos Sociais até 2035 - Eytan Benzeno">'
)

# Meta description
new_pt_html = new_pt_html.replace(
    '<meta name="description" content="Explore the impact of AI acceleration and the power race on society by 2035. Read our comprehensive report now!">',
    '<meta name="description" content="Descubra como a aceleração da IA pode impactar a sociedade até 2035. Leia nosso relatório e fique por dentro! 👁️‍🗨️">'
)

# Meta keywords
new_pt_html = new_pt_html.replace(
    '<meta name="keywords" content="AI acceleration, societal shock, power race, AGI, US-China AI competition, national security, infrastructure, energy procurement, coding workflows, agentic models">',
    '<meta name="keywords" content="aceleração da IA, corrida pelo poder, risco societal, impacto da IA, futuro da tecnologia, análise de cenários, sociedade em 2035, relatório de pesquisa">'
)

# Fix 4: Update canonical and hreflang URLs
new_pt_html = new_pt_html.replace(
    '<link rel="canonical" href="https://eytan.com/blog/ai-acceleration-power-race-2026.html">',
    '<link rel="canonical" href="https://eytan.com/blog/pt/ai-acceleration-power-race-2026.html">'
)

# Add pt hreflang (insert after fr hreflang)
fr_hreflang = '<link rel="alternate" hreflang="fr" href="https://eytan.com/blog/fr/ai-acceleration-power-race-2026.html">'
if '<link rel="alternate" hreflang="pt"' not in new_pt_html:
    new_pt_html = new_pt_html.replace(
        fr_hreflang,
        fr_hreflang + '\n    <link rel="alternate" hreflang="pt" href="https://eytan.com/blog/pt/ai-acceleration-power-race-2026.html">'
    )

# Fix 5: Update Open Graph tags
new_pt_html = new_pt_html.replace(
    '<meta property="og:url" content="https://eytan.com/blog/ai-acceleration-power-race-2026.html">',
    '<meta property="og:url" content="https://eytan.com/blog/pt/ai-acceleration-power-race-2026.html">'
)
new_pt_html = new_pt_html.replace(
    '<meta property="og:title" content="AI Acceleration & Societal Shock Risk: Insights to 2035.">',
    '<meta property="og:title" content="Aceleração da IA: Riscos Sociais até 2035">'
)
new_pt_html = new_pt_html.replace(
    '<meta property="og:description" content="Explore the impact of AI acceleration and the power race on society by 2035. Read our comprehensive report now!">',
    '<meta property="og:description" content="Descubra como a aceleração da IA pode impactar a sociedade até 2035. Leia nosso relatório e fique por dentro! 👁️‍🗨️">'
)

# Fix 6: Update Twitter meta tags
new_pt_html = new_pt_html.replace(
    '<meta property="twitter:url" content="https://eytan.com/blog/ai-acceleration-power-race-2026.html">',
    '<meta property="twitter:url" content="https://eytan.com/blog/pt/ai-acceleration-power-race-2026.html">'
)
new_pt_html = new_pt_html.replace(
    '<meta property="twitter:title" content="AI Acceleration & Societal Shock Risk: Insights to 2035.">',
    '<meta property="twitter:title" content="Aceleração da IA: Riscos Sociais até 2035">'
)
new_pt_html = new_pt_html.replace(
    '<meta property="twitter:description" content="Explore the impact of AI acceleration and the power race on society by 2035. Read our comprehensive report now!">',
    '<meta property="twitter:description" content="Descubra como a aceleração da IA pode impactar a sociedade até 2035. Leia nosso relatório e fique por dentro! 👁️‍🗨️">'
)

# Fix 7: Update paths for resources (from ../ to ../../ since we're in pt/ subdirectory)
new_pt_html = new_pt_html.replace('href="../images/eb-logo1.png"', 'href="../../images/eb-logo1.png"')
new_pt_html = new_pt_html.replace('href="../css/styles.css"', 'href="../../css/styles.css"')

# Fix 8: Update JSON-LD structured data
new_pt_html = new_pt_html.replace(
    '"headline": "AI Acceleration & Societal Shock Risk: Insights to 2035.",',
    '"headline": "Aceleração da IA: Riscos Sociais até 2035",'
)
new_pt_html = new_pt_html.replace(
    '"description": "Explore the impact of AI acceleration and the power race on society by 2035. Read our comprehensive report now!",',
    '"description": "Descubra como a aceleração da IA pode impactar a sociedade até 2035. Leia nosso relatório e fique por dentro! 👁️‍🗨️",'
)
new_pt_html = new_pt_html.replace(
    '"@id": "https://eytan.com/blog/ai-acceleration-power-race-2026.html"',
    '"@id": "https://eytan.com/blog/pt/ai-acceleration-power-race-2026.html"'
)

# Fix 9: Add footnote CSS styles (already in current PT file)
footnote_css = '''    <style>
        /* Footnote annotation sizing — sup elements stay small regardless of parent heading size */
        .blog-post-body sup { font-size: 0.65rem; line-height: 1; vertical-align: super; }
        .blog-post-body sup a { color: #667eea; text-decoration: none; font-weight: 700; margin: 0 1px; }
        .blog-post-body sup a:hover { color: #764ba2; text-decoration: underline; }
    </style>'''

if '<style>' not in new_pt_html or 'Footnote annotation sizing' not in new_pt_html:
    # Insert before </head>
    new_pt_html = new_pt_html.replace('</head>', footnote_css + '\n</head>')

# Fix 10: Critical - Fix iframe src from "ai-diagram.html" to "../ai-diagram.html"
new_pt_html = new_pt_html.replace(
    '<iframe src="ai-diagram.html"',
    '<iframe src="../ai-diagram.html"'
)

# Fix 11: Update all navigation links for Portuguese subdirectory structure
# Logo and profile links
new_pt_html = new_pt_html.replace(
    '<a href="../index.html">',
    '<a href="../../index.html">'
)
new_pt_html = new_pt_html.replace(
    '<img src="../images/profile.jpg"',
    '<img src="../../images/profile.jpg"'
)
new_pt_html = new_pt_html.replace(
    '<img src="../images/eb-logo1.png"',
    '<img src="../../images/eb-logo1.png"'
)

# Nav links
new_pt_html = new_pt_html.replace('<li><a href="../index.html">Home</a></li>', '<li><a href="../../index.html">Início</a></li>')
new_pt_html = new_pt_html.replace('<li><a href="../blog.html" class="active">Blog</a></li>', '<li><a href="../../blog.html" class="active">Blog</a></li>')
new_pt_html = new_pt_html.replace('<li><a href="../projects.html">Projects</a></li>', '<li><a href="../../projects.html">Projetos</a></li>')
new_pt_html = new_pt_html.replace('<li><a href="../index.html#about">About</a></li>', '<li><a href="../../index.html#about">Sobre</a></li>')
new_pt_html = new_pt_html.replace('<li><a href="../index.html#contact">Contact</a></li>', '<li><a href="../../index.html#contact">Contato</a></li>')

# Language selector - update to show PT as current
en_flag = '<a href="../ai-acceleration-power-race-2026.html" title="English">'
fr_flag = '<a href="../fr/ai-acceleration-power-race-2026.html" title="Français">'
pt_flag_inactive = '<a href="../pt/ai-acceleration-power-race-2026.html" title="Português">'

# Make PT active (no link), others as links
new_pt_html = new_pt_html.replace(
    en_flag + '\n                        <span class="fi fi-us current-lang"></span>',
    en_flag + '\n                        <span class="fi fi-us"></span>'
)
new_pt_html = new_pt_html.replace(
    fr_flag + '\n                        <span class="fi fi-fr"></span>',
    fr_flag + '\n                        <span class="fi fi-fr"></span>'
)

# Add PT flag as current (if not exists)
if 'fi-br current-lang' not in new_pt_html:
    # Find the language-selector div and add PT flag
    lang_selector_close = '</div>\n                </div>\n            </div>\n        </div>\n    </nav>'
    pt_flag_html = '''                    <span class="fi fi-br current-lang" title="Português"></span>'''
    new_pt_html = new_pt_html.replace(
        '</span>\n                    </a>' + '\n                ' + lang_selector_close,
        '</span>\n                    </a>\n' + pt_flag_html + '\n                ' + lang_selector_close
    )

print("Step 1: Basic structure and meta tags updated ✓")

# Now let's write the file and read it back to continue with content translation
with open('ai-acceleration-power-race-2026.html.new', 'w', encoding='utf-8') as f:
    f.write(new_pt_html)

print("Basic Portuguese structure created successfully!")
print("File saved as: ai-acceleration-power-race-2026.html.new")
