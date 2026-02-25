#!/bin/bash
#
# Complete rebuild of Portuguese blog post from English template
# Fixes all critical issues while preserving Portuguese translations
#

set -e  # Exit on any error

ENGLISH="../ai-acceleration-power-race-2026.html"
PT_OLD="ai-acceleration-power-race-2026.html.backup-before-rebuild"
PT_NEW="ai-acceleration-power-race-2026.html.new"

echo "=== Portuguese Blog Rebuild Script ==="
echo "Source: $ENGLISH"
echo "Old PT: $PT_OLD"
echo "Output: $PT_NEW"
echo

# Start with English file as template
cp "$ENGLISH" "$PT_NEW"

echo "Step 1: Fix HTML lang attribute..."
sed -i '' 's/<html lang="en">/<html lang="pt">/' "$PT_NEW"

echo "Step 2: Fix iframe src path..."
sed -i '' 's|<iframe src="ai-diagram\.html"|<iframe src="../ai-diagram.html"|g' "$PT_NEW"

echo "Step 3: Update page title..."
sed -i '' 's|<title>AI Acceleration & Societal Shock Risk: Insights to 2035\. - Eytan Benzeno</title>|<title>Aceleração da IA: Riscos Sociais até 2035 - Eytan Benzeno</title>|' "$PT_NEW"

echo "Step 4: Update meta title..."
sed -i '' 's|<meta name="title" content="AI Acceleration & Societal Shock Risk: Insights to 2035\. - Eytan Benzeno">|<meta name="title" content="Aceleração da IA: Riscos Sociais até 2035 - Eytan Benzeno">|' "$PT_NEW"

echo "Step 5: Update meta description..."
sed -i '' 's|<meta name="description" content="Explore the impact of AI acceleration and the power race on society by 2035\. Read our comprehensive report now!">|<meta name="description" content="Descubra como a aceleração da IA pode impactar a sociedade até 2035. Leia nosso relatório e fique por dentro! 👁️‍🗨️">|' "$PT_NEW"

echo "Step 6: Update meta keywords..."
sed -i '' 's|<meta name="keywords" content="AI acceleration, societal shock, power race, AGI, US-China AI competition, national security, infrastructure, energy procurement, coding workflows, agentic models">|<meta name="keywords" content="aceleração da IA, corrida pelo poder, risco societal, impacto da IA, futuro da tecnologia, análise de cenários, sociedade em 2035, relatório de pesquisa">|' "$PT_NEW"

echo "Step 7: Update canonical URL..."
sed -i '' 's|<link rel="canonical" href="https://eytan\.com/blog/ai-acceleration-power-race-2026\.html">|<link rel="canonical" href="https://eytan.com/blog/pt/ai-acceleration-power-race-2026.html">|' "$PT_NEW"

echo "Step 8: Add Portuguese hreflang..."
sed -i '' 's|<link rel="alternate" hreflang="fr" href="https://eytan\.com/blog/fr/ai-acceleration-power-race-2026\.html">|<link rel="alternate" hreflang="fr" href="https://eytan.com/blog/fr/ai-acceleration-power-race-2026.html">\
    <link rel="alternate" hreflang="pt" href="https://eytan.com/blog/pt/ai-acceleration-power-race-2026.html">|' "$PT_NEW"

echo "Step 9: Update Open Graph URL..."
sed -i '' 's|<meta property="og:url" content="https://eytan\.com/blog/ai-acceleration-power-race-2026\.html">|<meta property="og:url" content="https://eytan.com/blog/pt/ai-acceleration-power-race-2026.html">|' "$PT_NEW"

echo "Step 10: Update Open Graph title..."
sed -i '' 's|<meta property="og:title" content="AI Acceleration & Societal Shock Risk: Insights to 2035\.">|<meta property="og:title" content="Aceleração da IA: Riscos Sociais até 2035">|' "$PT_NEW"

echo "Step 11: Update Open Graph description..."
sed -i '' 's|<meta property="og:description" content="Explore the impact of AI acceleration and the power race on society by 2035\. Read our comprehensive report now!">|<meta property="og:description" content="Descubra como a aceleração da IA pode impactar a sociedade até 2035. Leia nosso relatório e fique por dentro! 👁️‍🗨️">|' "$PT_NEW"

echo "Step 12: Update Twitter URL..."
sed -i '' 's|<meta property="twitter:url" content="https://eytan\.com/blog/ai-acceleration-power-race-2026\.html">|<meta property="twitter:url" content="https://eytan.com/blog/pt/ai-acceleration-power-race-2026.html">|' "$PT_NEW"

echo "Step 13: Update Twitter title..."
sed -i '' 's|<meta property="twitter:title" content="AI Acceleration & Societal Shock Risk: Insights to 2035\.">|<meta property="twitter:title" content="Aceleração da IA: Riscos Sociais até 2035">|' "$PT_NEW"

echo "Step 14: Update Twitter description..."
sed -i '' 's|<meta property="twitter:description" content="Explore the impact of AI acceleration and the power race on society by 2035\. Read our comprehensive report now!">|<meta property="twitter:description" content="Descubra como a aceleração da IA pode impactar a sociedade até 2035. Leia nosso relatório e fique por dentro! 👁️‍🗨️">|' "$PT_NEW"

echo "Step 15: Update JSON-LD structured data..."
sed -i '' 's|"headline": "AI Acceleration & Societal Shock Risk: Insights to 2035\.",|"headline": "Aceleração da IA: Riscos Sociais até 2035",|' "$PT_NEW"
sed -i '' 's|"description": "Explore the impact of AI acceleration and the power race on society by 2035\. Read our comprehensive report now!",|"description": "Descubra como a aceleração da IA pode impactar a sociedade até 2035. Leia nosso relatório e fique por dentro! 👁️‍🗨️",|' "$PT_NEW"
sed -i '' 's|"@id": "https://eytan\.com/blog/ai-acceleration-power-race-2026\.html"|"@id": "https://eytan.com/blog/pt/ai-acceleration-power-race-2026.html"|' "$PT_NEW"

echo "Step 16: Update all resource paths (../ to ../../)..."
sed -i '' 's|href="../images/eb-logo1\.png"|href="../../images/eb-logo1.png"|g' "$PT_NEW"
sed -i '' 's|href="../css/styles\.css"|href="../../css/styles.css"|g' "$PT_NEW"
sed -i '' 's|href="../index\.html"|href="../../index.html"|g' "$PT_NEW"
sed -i '' 's|src="../images/profile\.jpg"|src="../../images/profile.jpg"|g' "$PT_NEW"
sed -i '' 's|src="../images/eb-logo1\.png"|src="../../images/eb-logo1.png"|g' "$PT_NEW"
sed -i '' 's|href="../blog\.html"|href="../../blog.html"|g' "$PT_NEW"
sed -i '' 's|href="../projects\.html"|href="../../projects.html"|g' "$PT_NEW"

echo "Step 17: Add footnote CSS..."
# Check if footnote CSS already exists
if ! grep -q "Footnote annotation sizing" "$PT_NEW"; then
    # Insert before </head>
    sed -i '' '/<\/head>/i\
    <style>\
        /* Footnote annotation sizing — sup elements stay small regardless of parent heading size */\
        .blog-post-body sup { font-size: 0.65rem; line-height: 1; vertical-align: super; }\
        .blog-post-body sup a { color: #667eea; text-decoration: none; font-weight: 700; margin: 0 1px; }\
        .blog-post-body sup a:hover { color: #764ba2; text-decoration: underline; }\
    </style>
' "$PT_NEW"
fi

echo "Step 18: Translate navigation menu..."
sed -i '' 's|<li><a href="../../index\.html">Home</a></li>|<li><a href="../../index.html">Início</a></li>|' "$PT_NEW"
sed -i '' 's|<li><a href="../../projects\.html">Projects</a></li>|<li><a href="../../projects.html">Projetos</a></li>|' "$PT_NEW"
sed -i '' 's|<li><a href="../../index\.html#about">About</a></li>|<li><a href="../../index.html#about">Sobre</a></li>|' "$PT_NEW"
sed -i '' 's|<li><a href="../../index\.html#contact">Contact</a></li>|<li><a href="../../index.html#contact">Contato</a></li>|' "$PT_NEW"

echo
echo "=== Basic structure fixes complete! ==="
echo "File created: $PT_NEW"
echo
echo "Now apply this with: mv $PT_NEW ai-acceleration-power-race-2026.html"
