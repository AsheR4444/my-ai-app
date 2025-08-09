# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AI agent application built with Next.js, using AI SDK and LangChain for AI capabilities. The project follows Next.js App Router pattern with TypeScript.

## Key Technologies & Dependencies

- **Next.js 15.4.6** with App Router and Turbopack
- **AI SDK (5.0.8)** for AI integrations
- **LangChain (0.3.30)** with OpenAI integration (@langchain/openai, @langchain/community, @langchain/core)
- **TypeScript** with strict configuration
- **Tailwind CSS v4** for styling
- **Zod (4.0.17)** for schema validation

## Development Commands

- `pnpm dev` or `npm run dev` - Start development server with Turbopack
- `pnpm build` or `npm run build` - Build for production
- `pnpm start` or `npm start` - Start production server
- `pnpm lint` or `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/           # Next.js App Router
│   ├── layout.tsx # Root layout with Geist fonts
│   ├── page.tsx   # Homepage
│   └── globals.css # Global styles with Tailwind + CSS variables
```

## Configuration Details

- **TypeScript**: Uses path mapping (`@/*` → `./src/*`)
- **ESLint**: Configured with Next.js core-web-vitals and TypeScript rules
- **Styling**: Tailwind CSS v4 with inline theme configuration and CSS custom properties for theming
- **Fonts**: Geist and Geist Mono from Google Fonts

## Environment Setup

The project uses `dotenv` for environment variables. AI/LangChain integrations will likely require API keys (OpenAI, etc.) in environment configuration.

## AI Agent Development Plan

### Этап 1: Базовая настройка (В ПРОЦЕССЕ)
- [x] 1.1 Настроить OpenRouter интеграцию (anthropic/claude-sonnet-4)
- [ ] 1.3 Настроить обработку PDF файлов  
- [ ] 1.4 Выбрать и настроить векторную БД
- [ ] 1.5 Реализовать RAG (Retrieval-Augmented Generation)

### Этап 2: Система загрузки и обработки документов
- [ ] PDF парсер с разбивкой на чанки
- [ ] API для загрузки PDF файлов
- [ ] Эмбеддинги и индексация в векторной БД

### Этап 3: RAG и поиск
- [ ] Семантический поиск по документам
- [ ] Интеграция поиска с LLM
- [ ] Контекстные ответы на основе документов

### Этап 4: Права доступа
- [ ] Система пользователей
- [ ] Разграничение доступа к документам