
# Plano de Implementação - Website MoveAI

## 🎯 Visão Geral
Website institucional moderno e focado em conversão para a MoveAI, empresa SaaS de automação com IA. Começaremos com as páginas essenciais e expandiremos progressivamente.

---

## 📦 Fase 1: Fundação (MVP)

### Design System & Identidade Visual
- Configurar cores da marca (gradiente roxo #8B5CF6 → azul #60A5FA)
- Tipografia moderna e limpa
- Componentes reutilizáveis com o estilo MoveAI
- Animações sutis e microinterações

### Componentes Globais
- **Header/Navbar**: Logo MoveAI + menu + botões "Login" e "Fale com Vendas" (sticky)
- **Footer**: 4 colunas com links, redes sociais e newsletter
- **Botões CTA**: Estilo gradiente para ações primárias

### Página Home
- **Hero Section**: Headline impactante + CTAs + visual abstrato com gradientes
- **Por que MoveAI?**: 3 cards (Personalização, Sem Substituição, Controle)
- **Resultados Reais**: Grid de métricas e benefícios
- **Quem já confia**: Logo wall de clientes (placeholder)
- **CTA Final**: Chamada para agendar demonstração

### Página Soluções
- **Hero**: Título + subtítulo sobre personalização
- **Soluções Pré-Configuradas**: 4 cards clicáveis (Atendimento, Leads, Análise, CRM+IA)
- **Soluções Customizadas**: Card especial destacado
- **Como Funciona**: Timeline visual do processo
- **CTA**: Iniciar automação

---

## 📦 Fase 2: Páginas Complementares

### Página Sobre
- História da empresa (fundada em 2026)
- Missão, Visão e Valores
- Diferencial competitivo

### Página Pricing
- 3 tiers: Starter, Growth (destaque), Enterprise
- Valores placeholder (ajustáveis)
- FAQ com accordion
- CTA para consultoria

---

## 📦 Fase 3: Funcionalidades com Backend

### Integração Supabase
- Banco de dados para leads e contatos
- Sistema de autenticação (preparar para área de cliente futura)

### Formulários Funcionais
- "Fale com Vendas": Nome, Email, Empresa, Telefone, Mensagem
- "Agendar Demo": Nome, Email, Horário preferido
- Newsletter no footer
- Validação + feedback visual + salvamento no banco

### Blog Dinâmico
- Tabela de posts no Supabase
- Listagem com grid de cards
- Categorias e filtros
- Página de artigo individual
- Artigos de exemplo para demonstração

---

## 📦 Fase 4: Refinamentos

### FAQ Interativo
- Accordion com categorias
- Perguntas frequentes sobre produto e pricing

### Performance & SEO
- Lazy loading de imagens
- Meta tags e estrutura semântica
- Otimização mobile-first

### Preparação para Integrações Futuras
- Espaço para chatbot
- Estrutura para analytics (Google/Meta)
- Webhook para CRM (leads)

---

## 🎨 Experiência Visual

| Elemento | Especificação |
|----------|---------------|
| Cores | Gradiente #8B5CF6 → #60A5FA, preto para textos |
| Logo | Usar imagem fornecida (move preto + ai gradiente) |
| Whitespace | Generoso, design respirável |
| Animações | Fade-in suave, hover elegante |
| Mobile | Responsivo first, hamburger menu |

---

## 📋 Entregáveis do MVP

1. ✅ Home page completa com todas as seções
2. ✅ Página de Soluções com cards interativos  
3. ✅ Header e Footer funcionais
4. ✅ Formulário "Fale com Vendas" integrado ao Supabase
5. ✅ Design responsivo (mobile, tablet, desktop)
6. ✅ Animações e microinterações

**Idioma**: Português do Brasil  
**Tom**: Profissional, confiante e humanizado
