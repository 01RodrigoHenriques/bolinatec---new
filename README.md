# Bolina Tec

Consultoria tecnológica e desenvolvimento de soluções digitais aplicadas a agricultura, território e inovação técnica.

[![Astro](https://img.shields.io/badge/Astro-FF5D01?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](https://github.com/bolinatec/bolinaUI)

## Sobre

A Bolina Tec presta consultoria tecnológica e desenvolve soluções digitais para problemas reais em agricultura, território e sistemas digitais. Do diagnóstico ao piloto, resolvemos problemas técnicos complexos com uma abordagem prática e baseada em dados.

## Stack Tecnológica

- **Framework**: Astro 6 (Static Site Generation)
- **UI**: React 19 + Tailwind CSS 4
- **Linguagem**: TypeScript 5
- **3D**: Three.js + React Three Fiber
- **CMS**: Decap CMS (GitHub backend)
- **Content**: Astro Content Collections
- **SEO**: @astrojs/sitemap
- **Deploy**: Cloudflare Pages

## Funcionalidades

- **Soluções por Área**: Produtos organizados por categorias (Agricultura, Território, Inovação)
- **Sistema de Notícias**: Blog com Markdown e Decap CMS
- **Animações 3D**: Hero section com Three.js e sistema de partículas
- **Design Premium**: Interface minimalista com tema dark/light adaptativo
- **SEO Otimizado**: Sitemap automático, robots.txt e meta tags semânticas
- **Performance**: Build estático para máxima velocidade
- **Páginas Legais**: Política de Privacidade e Termos e Condições

## Desenvolvimento

```bash
# Instalar dependências
pnpm install

# Servidor de desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Preview do build
pnpm preview
```

## Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis (Astro + React)
│   ├── gl/           # Componentes Three.js (partículas, shaders)
│   └── *.astro       # Componentes UI (Tag, RevealText, BentoCard, etc.)
├── content/          # Content Collections (notícias, projetos, equipa)
├── layouts/          # Layout principal
├── pages/            # Rotas e páginas
├── styles/           # Estilos globais (Tailwind CSS 4)
└── config.ts         # Configuração de collections
```

## CMS

O Decap CMS está disponível em `/admin/` e permite gerir:
- **Notícias**: Artigos com título, data, categoria e conteúdo Markdown
- **Projetos**: Projetos com área, descrição e imagem
- **Equipa**: Membros da equipa com foto e bio

## Licença

© 2026 Bolina Tec. Todos os direitos reservados.
