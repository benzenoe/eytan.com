#!/usr/bin/env python3
"""
Final merge: Take structurally-correct file and intelligently merge Portuguese content
"""
import re

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

# Read both files
new_html = read_file('ai-acceleration-power-race-2026.html.new')  # Correct structure, English content
old_pt = read_file('ai-acceleration-power-race-2026.html.backup-before-rebuild')  # Portuguese content, broken structure

print("Starting intelligent content merge...")

# Strategy: Replace large blocks of English content with Portuguese equivalents
# We'll use regex to find and replace specific sections

# 1. Executive Summary section (between <h2>Resumo Executivo and <h2>Fonte Âncora)
executive_summary_pt = """<h2>Resumo Executivo <sup><a href="https://shumer.dev/something-big-is-happening" target="_blank">[1]</a></sup> <sup><a href="https://cdn.openai.com/pdf/23eca107-a9b1-4d2c-b156-7deb4fbc697c/GPT-5-3-Codex-System-Card-02.pdf" target="_blank">[2]</a></sup> <sup><a href="https://www.whitehouse.gov/wp-content/uploads/2025/07/Americas-AI-Action-Plan.pdf" target="_blank">[3]</a></sup> <sup><a href="https://www.reuters.com/business/energy/pjm-plan-could-accelerate-data-center-power-deals-analysts-say-2026-02-13" target="_blank">[4]</a></sup> <sup><a href="https://ai-act-service-desk.ec.europa.eu/en/faq" target="_blank">[5]</a></sup></h2><p>Matt Shumer, em seu ensaio de fevereiro de 2026 intitulado "Algo Grande Está Acontecendo", argumenta que houve uma notável "mudança de urgência" porque laboratórios de ponta estão agora enviando modelos agentes que podem realizar trabalhos de longa duração com ferramentas e, crucialmente, estão sendo usados dentro dos próprios ciclos de P&D de seus criadores, criando iteração mais rápida em direção à capacidade semelhante à AGI (ou além) do que a maioria das instituições pode absorver. Uma verificação de realidade de curto prazo (fevereiro de 2026) apoia a premissa de "aceleração" - especialmente em codificação, fluxos de trabalho agentes e trabalho de conhecimento profissional - enquanto ainda mostra limitações claras em confiabilidade, raciocínio preciso em alta complexidade e operação autônoma segura sem barreiras de proteção. O motor mais "imparável" não é apenas a pressão comercial, mas a explícita moldura de segurança nacional da competição EUA-China: grandes governos descrevem a liderança em IA como domínio estratégico, o que cria fortes incentivos para a defecção (dinâmicas de corrida) e enfraquece a plausibilidade de pausas significativas. A restrição subestimada a curto prazo — e acelerador — é a potência física e a infraestrutura: capacidade da rede, filas de interconexão, transformadores/subestações, licenciamento de transmissão, refrigeração/água, localização de terrenos e estruturas de aquisição de energia (por exemplo, "traga sua própria geração") que determinam cada vez mais quem pode expandir a IA e onde. Legalmente, "a IA se tornando ilegal" é improvável em termos gerais até 2035; em vez disso, o sistema se torna ilegal <i>por usos específicos, contextos de implementação, falhas de segurança/conformidade e controles transfronteiriços</i> — com "linhas claras" de curto prazo já ativas na UE (práticas proibidas desde fevereiro de 2025; obrigações escalonadas para modelos de propósito geral até agosto de 2026/2027) e regimes de controle de exportação em expansão e regimes estaduais nos EUA, todos complicados pela corrida armamentista.</p>"""

# Find Executive Summary in new file and replace
exec_pattern = r'<h2>Resumo Executivo.*?</h2><p>Matt Shumer\'s.*?race\.</p>'
new_html = re.sub(exec_pattern, executive_summary_pt, new_html, flags=re.DOTALL)

# 2. Anchor Source section
anchor_source_pt = """<h2>Fonte Âncora <sup><a href="https://shumer.dev/something-big-is-happening" target="_blank">[1]</a></sup> </h2><p>Matt Shumer publicou "Algo Grande Está Acontecendo" por volta de 9 de fevereiro de 2026 e o apresentou como uma inflexão única em uma geração - comparando explicitamente o momento à percepção de que "algo enorme" está em andamento e que a maioria das pessoas ainda age como se a mudança estivesse anos distante. Sua alegação principal é que os lançamentos recentes de fronteira (ele destaca os lançamentos de modelos de 5 de fevereiro) tornaram pessoalmente inegável que a IA está avançando para uma era em que pode executar trabalhos significativos com supervisão humana mínima, incluindo tarefas que se assemelham a "julgamento/gosto" em vez de simples autocompletar. <sup><a href="https://shumer.dev/something-big-is-happening" target="_blank">[1]</a></sup> </p><p>O "soco no estômago" mais viral de Shumer é a mudança no fluxo de trabalho vivido: <b>"Eu não sou mais necessário para o trabalho técnico real. Eu descrevo o resultado que quero e ele aparece."   </b>Ele argumenta que isso não é um truque de desenvolvedor de nicho, mas uma prévia do amplo deslocamento de colarinho branco uma vez que as organizações reconfiguram os fluxos de trabalho em torno de sistemas agentes. <sup><a href="https://www.businessinsider.com/gary-marcus-response-something-big-is-happening-ai-essay-shumer-2026-2" target="_blank">[6]</a></sup></p><p>Em relação à viralidade e ao alcance mais amplo, grandes veículos de comunicação relataram que o ensaio se espalhou rapidamente nas redes sociais e foi recirculado pela mídia empresarial; um relatório descreveu que atingiu dezenas de milhões de visualizações (por exemplo, "mais de 80 milhões de visualizações" em X, dependendo da raspagem/tempo medido), indicando que funcionou como um documento público de "despertar" em vez de uma postagem puramente técnica. <sup><a href="https://shumer.dev/something-big-is-happening" target="_blank">[1]</a></sup></p><p>Shumer ancora a mudança de urgência para os lançamentos de 5 de fevereiro: o modelo de codificação agente da OpenAI (GPT‑5.3‑Codex) e o novo carro-chefe da Anthropic (Claude Opus 4.6), apresentando-os como evidência de que as "capacidades chegaram" e que as consequências econômicas e geopolíticas estão agora em um relógio de curto prazo (2026–início dos anos 2030), e não em um futuro distante. <sup><a href="https://openai.com/index/introducing-gpt-5-3-codex" target="_blank">[7]</a></sup></p><p>Ele também aponta para um ciclo de feedback reforçador: laboratórios de fronteira estão cada vez mais usando modelos de fronteira para acelerar a criação, avaliação, implantação e trabalho de segurança em torno dos <i>próximos</i> modelos—uma dinâmica interna de "composição" que (se continuar) comprime os prazos.</p>"""

anchor_pattern = r'<h2>Fonte Âncora.*?</p><p>He also points.*?timelines\.</p>'
new_html = re.sub(anchor_pattern, anchor_source_pt, new_html, flags=re.DOTALL)

# 3. Image alt text
new_html = new_html.replace(
    'alt="Graphical representation of AI acceleration and societal risks through 2035."',
    'alt="Gráfico interativo sobre aceleração da IA e riscos sociais até 2035."'
)

# 4. Technology Reality Check section heading translation
tech_h3_1 = """<h3>O que "capacidade de fevereiro de 2026" realmente parece na prática <sup><a href="https://cdn.openai.com/pdf/23eca107-a9b1-4d2c-b156-7deb4fbc697c/GPT-5-3-Codex-System-Card-02.pdf" target="_blank">[2]</a></sup> <sup><a href="https://openai.com/index/introducing-gpt-5-3-codex" target="_blank">[7]</a></sup></h3>"""

new_html = re.sub(
    r'<h3>What "Feb 2026 capability" actually looks like in practice.*?</sup></h3>',
    tech_h3_1,
    new_html,
    flags=re.DOTALL
)

# 5. First h4 in tech section
tech_h4_1 = """<h4>A codificação agente e fluxos de trabalho orientados por ferramentas são o salto mais claro. O cartão do sistema GPT‑5.3‑Codex da OpenAI descreve-o como o modelo de codificação agente mais capaz que eles lançaram, projetado para tarefas de longa duração envolvendo pesquisa, uso de ferramentas e execução complexa, e observa que pode ser direcionado "como um colega" sem perder o contexto.    A OpenAI também destaca um ponto interno crucial: este é o primeiro cartão de sistema que descreve um modelo de fronteira como "instrumental" na criação de si mesmo (via versões anteriores usadas em fluxos de trabalho de desenvolvimento), que é uma versão concreta e estreita de "melhoria recursiva" (direcionada pelo humano, mediada por ferramentas, mas ainda assim cumulativa). <sup><a href="https://cdn.openai.com/pdf/23eca107-a9b1-4d2c-b156-7deb4fbc697c/GPT-5-3-Codex-System-Card-02.pdf" target="_blank">[2]</a></sup> </h4>"""

new_html = re.sub(
    r'<h4>Agentic coding and tool-driven workflows.*?</sup> </h4>',
    tech_h4_1,
    new_html,
    flags=re.DOTALL
)

print("✓ Key Portuguese content sections merged")
print("✓ Maintaining correct URL structure from English template")
print("✓ File ready for final review")

# Write output
write_file('ai-acceleration-power-race-2026.html.final', new_html)

print("\n" + "="*60)
print("SUCCESS! Final file created:")
print("  ai-acceleration-power-race-2026.html.final")
print("="*60)
print("\nTo apply: mv ai-acceleration-power-race-2026.html.final ai-acceleration-power-race-2026.html")
