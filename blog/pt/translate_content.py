#!/usr/bin/env python3
"""
Phase 2: Translate content sections from current Portuguese file
"""
import re

# Read the intermediate file from phase 1
with open('ai-acceleration-power-race-2026.html.new', 'r', encoding='utf-8') as f:
    html = f.read()

# Read current Portuguese file for translations
with open('ai-acceleration-power-race-2026.html', 'r', encoding='utf-8') as f:
    old_pt = f.read()

# Main content translations dictionary
translations = {
    # Page title and breadcrumb
    '<h1>AI Acceleration & Societal Shock Risk: Insights to 2035.</h1>':
        '<h1>Aceleração da IA: Riscos Sociais até 2035</h1>',

    '<a href="../blog.html">Blog</a> &gt; <span>AI Acceleration & Societal Shock Risk: Insights to 2035.</span>':
        '<a href="../../blog.html">Blog</a> &gt; <span>Aceleração da IA: Riscos Sociais até 2035</span>',

    # Date and reading time
    'Published:': 'Publicado:',
    'February 20, 2026': '20 de fevereiro de 2026',
    'minute read': 'min de leitura',

    # Main headings
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

    # Chart titles
    '🚀 AI Training Compute Scaling — Historical Data &amp; Divergent Projections to 2035 (Log Scale)':
        '🚀 Escala de Cálculo de Treinamento de IA — Dados Históricos e Projeções Divergentes até 2035 (Escala Logarítmica)',

    '🧠 Road to AGI — Expert Timeline Estimates':
        '🧠 Caminho para a AGI — Estimativas de Cronograma de Especialistas',

    '👷 AI Job Impact by Sector — Interactive Year Selector':
        '👷 Impacto da IA no Emprego por Setor — Seletor de Ano Interativo',

    '⚡ Global Data Center Power Demand (TWh)':
        '⚡ Demanda Global de Energia de Data Centers (TWh)',

    # Chart sources
    'Sources: Epoch AI, OpenAI, Anthropic — Projections split from 2026: Low (conservative) vs High (aggressive) estimates. FLOPs = floating point operations.':
        'Fontes: Epoch AI, OpenAI, Anthropic — Projeções divididas a partir de 2026: estimativas Baixa (conservadora) vs Alta (agressiva). FLOPs = operações de ponto flutuante.',

    'Based on public statements by leading AI researchers, 2024–2026':
        'Com base em declarações públicas de pesquisadores de IA líderes, 2024–2026',

    'Sources: WEF Future of Jobs 2025, IMF, ILO — Job losses shown as negative (red), new jobs as positive (green)':
        'Fontes: WEF Future of Jobs 2025, FMI, OIT — Perdas de emprego mostradas como negativas (vermelho), novos empregos como positivos (verde)',

    'Sources: IEA Energy &amp; AI Report 2025, Goldman Sachs, EIA — Toggle between energy source breakdown and grid vs private generation views.':
        'Fontes: Relatório IEA Energy &amp; AI 2025, Goldman Sachs, EIA — Alterne entre a discriminação de fontes de energia e as visualizações de geração de grid vs privada.',

    # Toggle buttons
    '<span class="toggle-icon">🔋</span> Energy Sources':
        '<span class="toggle-icon">🔋</span> Fontes de Energia',

    '<span class="toggle-icon">⚡</span> Grid vs Private':
        '<span class="toggle-icon">⚡</span> Grade vs Privado',

    # Year slider
    'Select Year:': 'Selecionar Ano:',

    # Footer
    '<p>&copy; 2026 Eytan Benzeno. All rights reserved.</p>':
        '<p>&copy; 2026 Eytan Benzeno. Todos os direitos reservados.</p>',

    # Back to top
    'Back to Top': 'Voltar ao Topo',
}

# Apply all translations
for english, portuguese in translations.items():
    html = html.replace(english, portuguese)

# Special handling for subheadings that might have variations
html = re.sub(
    r'<h3>What "Feb 2026 capability" actually looks like in practice',
    '<h3>O que "capacidade de fevereiro de 2026" realmente parece na prática',
    html
)

html = re.sub(
    r'<h3>"Judgment/taste" and autonomous decision-making: what\'s real vs\. what\'s hype',
    '<h3>Tomada de decisão autônoma: o que é real versus o que é hype',
    html
)

html = re.sub(
    r'<h3>Robotics and physical agency: the 2026–2030 "bridge" that determines real-world disruption speed',
    '<h3>Robótica e agência física: a "ponte" de 2026-2030 que determina a velocidade de disrupção no mundo real',
    html
)

html = re.sub(
    r'<h3>Expert timeline ranges \(2026–2035\) versus Shumer\'s "few years" urgency</h3>',
    '<h3>Intervalos de tempo de especialistas (2026-2035) versus urgência de "poucos anos" de Shumer</h3>',
    html
)

html = re.sub(
    r'<h3>What the best 2024–Feb 2026 data says about exposure and disruption',
    '<h3>O que os melhores dados de 2024 a fevereiro de 2026 dizem sobre exposição e disrupção',
    html
)

html = re.sub(
    r'<h3>Why Shumer\'s "white-collar disruption by end-2026/early 2030s" is plausible—and why the timing is still uncertain</h3>',
    '<h3>Por que a "disrupção do colarinho branco até o final de 2026/início dos anos 2030" de Shumer é plausível — e por que o tempo ainda é incerto</h3>',
    html
)

html = re.sub(
    r'<h3>Corporate profitability in a high-unemployment scenario: the demand-side trap</h3>',
    '<h3>Lucratividade corporativa em um cenário de alto desemprego: a armadilha do lado da demanda</h3>',
    html
)

html = re.sub(
    r'<h3>Inequality and "who pays": why energy costs are a direct working-class channel</h3>',
    '<h3>Desigualdade e "quem paga": por que os custos de energia são um canal direto para a classe trabalhadora</h3>',
    html
)

html = re.sub(
    r'<h3>The load spike: what authoritative forecasts say by 2030 and 2035',
    '<h3>O pico de carga: o que as previsões autoritativas dizem para 2030 e 2035',
    html
)

html = re.sub(
    r'<h3>Grid constraints are not abstract: operators are redesigning access rules around data centers</h3>',
    '<h3>As restrições de grade não são abstratas: operadores estão redesenhando regras de acesso em torno de data centers</h3>',
    html
)

html = re.sub(
    r'<h3>The bottleneck stack: transformers, substations, transmission, cooling/water, land</h3>',
    '<h3>A pilha de gargalos: transformadores, subestações, transmissão, resfriamento/água, terra</h3>',
    html
)

html = re.sub(
    r'<h3>Causal diagram: how the "race for power" drives both acceleration and backlash</h3>',
    '<h3>Diagrama causal: como a "corrida pelo poder" impulsiona tanto a aceleração quanto a reação</h3>',
    html
)

print("Step 2: Content translations applied ✓")

# Write the updated file
with open('ai-acceleration-power-race-2026.html.new', 'w', encoding='utf-8') as f:
    f.write(html)

print("Content translation phase complete!")
print("Next: Extract and apply paragraph-level content from old Portuguese file")
