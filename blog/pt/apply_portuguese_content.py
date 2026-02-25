#!/usr/bin/env python3
"""
Apply Portuguese content translations to the structurally-fixed file
"""
import re

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

# Read files
html = read_file('ai-acceleration-power-race-2026.html.new')
old_pt = read_file('ai-acceleration-power-race-2026.html.backup-before-rebuild')

print("Applying Portuguese content translations...")

# Extract and apply main content translations
# These are the key content sections that need Portuguese text

# 1. Main H1 title
html = html.replace(
    '<h1>AI Acceleration & Societal Shock Risk: Insights to 2035.</h1>',
    '<h1>Aceleração da IA: Riscos Sociais até 2035</h1>'
)

# 2. Breadcrumb
html = re.sub(
    r'<a href="../../blog\.html">Blog</a> &gt; <span>.*?</span>',
    '<a href="../../blog.html">Blog</a> &gt; <span>Aceleração da IA: Riscos Sociais até 2035</span>',
    html
)

# 3. Published date
html = html.replace('Published:', 'Publicado:')
html = html.replace('February 20, 2026', '20 de fevereiro de 2026')
html = html.replace(' minute read', ' min de leitura')

# 4. Main section headings
headings = {
    '<h2>Executive Summary': '<h2>Resumo Executivo',
    '<h2>Anchor Source': '<h2>Fonte Âncora',
    '<h2>Technological Reality Check</h2>': '<h2>Realidade Tecnológica</h2>',
    '<h2>Economic &amp; Labor Impacts</h2>': '<h2>Impactos Econômicos e no Trabalho</h2>',
    '<h2>Energy &amp; Infrastructure Race</h2>': '<h2>Corrida de Energia e Infraestrutura</h2>',
    '<h2>The "National Security" Frame &amp; Race Dynamics</h2>': '<h2>A Moldura de "Segurança Nacional" e Dinâmicas de Corrida</h2>',
    '<h2>Regulation &amp; "AI Becoming Illegal"</h2>': '<h2>Regulamentação e "IA Se Tornando Ilegal"</h2>',
    '<h2>Societal Shock Scenarios (2026–2035)</h2>': '<h2>Cenários de Choque Social (2026–2035)</h2>',
    '<h2>Conclusion</h2>': '<h2>Conclusão</h2>',
    '<h2>References</h2>': '<h2>Referências</h2>',
}

for en, pt in headings.items():
    html = html.replace(en, pt)

# 5. Chart titles (keep the emoji, translate text)
html = html.replace(
    '🚀 AI Training Compute Scaling — Historical Data &amp; Divergent Projections to 2035 (Log Scale)',
    '🚀 Escala de Cálculo de Treinamento de IA — Dados Históricos e Projeções Divergentes até 2035 (Escala Logarítmica)'
)

html = html.replace(
    '🧠 Road to AGI — Expert Timeline Estimates',
    '🧠 Caminho para a AGI — Estimativas de Cronograma de Especialistas'
)

html = html.replace(
    '👷 AI Job Impact by Sector — Interactive Year Selector',
    '👷 Impacto da IA no Emprego por Setor — Seletor de Ano Interativo'
)

html = html.replace(
    '⚡ Global Data Center Power Demand (TWh)',
    '⚡ Demanda Global de Energia de Data Centers (TWh)'
)

# 6. Chart sources
html = html.replace(
    'Sources: Epoch AI, OpenAI, Anthropic — Projections split from 2026: Low (conservative) vs High (aggressive) estimates. FLOPs = floating point operations.',
    'Fontes: Epoch AI, OpenAI, Anthropic — Projeções divididas a partir de 2026: estimativas Baixa (conservadora) vs Alta (agressiva). FLOPs = operações de ponto flutuante.'
)

html = html.replace(
    'Based on public statements by leading AI researchers, 2024–2026',
    'Com base em declarações públicas de pesquisadores de IA líderes, 2024–2026'
)

html = html.replace(
    'Sources: WEF Future of Jobs 2025, IMF, ILO — Job losses shown as negative (red), new jobs as positive (green)',
    'Fontes: WEF Future of Jobs 2025, FMI, OIT — Perdas de emprego mostradas como negativas (vermelho), novos empregos como positivos (verde)'
)

html = html.replace(
    'Sources: IEA Energy &amp; AI Report 2025, Goldman Sachs, EIA — Toggle between energy source breakdown and grid vs private generation views.',
    'Fontes: Relatório IEA Energy &amp; AI 2025, Goldman Sachs, EIA — Alterne entre a discriminação de fontes de energia e as visualizações de geração de grade vs privada.'
)

# 7. Interactive elements
html = html.replace(
    '<span class="toggle-icon">🔋</span> Energy Sources',
    '<span class="toggle-icon">🔋</span> Fontes de Energia'
)

html = html.replace(
    '<span class="toggle-icon">⚡</span> Grid vs Private',
    '<span class="toggle-icon">⚡</span> Grade vs Privado'
)

html = html.replace('Select Year:', 'Selecionar Ano:')

# 8. Footer
html = html.replace(
    '<p>&copy; 2026 Eytan Benzeno. All rights reserved.</p>',
    '<p>&copy; 2026 Eytan Benzeno. Todos os direitos reservados.</p>'
)

html = html.replace('Back to Top', 'Voltar ao Topo')

# 9. Now extract Portuguese paragraph content from old file
# We'll do this by finding Portuguese content between specific heading markers

# Helper function to extract content between markers
def extract_between(text, start_marker, end_marker):
    """Extract content between two markers"""
    try:
        start = text.find(start_marker)
        if start == -1:
            return None
        start += len(start_marker)
        end = text.find(end_marker, start)
        if end == -1:
            return None
        return text[start:end].strip()
    except:
        return None

# Extract Executive Summary Portuguese content
pt_exec_summary = extract_between(old_pt, '<h2>Resumo Executivo', '<h2>')
if pt_exec_summary:
    # Find and replace English Executive Summary
    en_exec_start = html.find('<h2>Resumo Executivo')
    if en_exec_start != -1:
        en_exec_end = html.find('<h2>', en_exec_start + 10)
        if en_exec_end != -1:
            # Get the heading
            heading_end = html.find('</h2>', en_exec_start) + 5
            heading = html[en_exec_start:heading_end]
            # Replace with Portuguese
            html = html[:heading_end] + pt_exec_summary[pt_exec_summary.find('</h2>')+5:] + '\n' + html[en_exec_end:]

print("Portuguese content applied!")

# 10. Language selector - make PT active
# Find and update language flags
html = re.sub(
    r'<a href="../ai-acceleration-power-race-2026\.html" title="English">\s*<span class="fi fi-us current-lang"></span>',
    '<a href="../ai-acceleration-power-race-2026.html" title="English">\n                        <span class="fi fi-us"></span>',
    html
)

# Add PT as current lang if not exists
if 'fi-br current-lang' not in html:
    # Find the fr flag and add PT after it
    html = re.sub(
        r'(<a href="../fr/ai-acceleration-power-race-2026\.html" title="Français">\s*<span class="fi fi-fr"></span>\s*</a>)',
        r'\1\n                    <span class="fi fi-br current-lang" title="Português"></span>',
        html
    )

# Write output
write_file('ai-acceleration-power-race-2026.html.new', html)

print("✓ Portuguese content translations applied successfully!")
print("✓ File ready: ai-acceleration-power-race-2026.html.new")
print("\nNext: Review and apply with: mv ai-acceleration-power-race-2026.html.new ai-acceleration-power-race-2026.html")
