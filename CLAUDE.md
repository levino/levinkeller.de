# Claude Code Configuration

This file contains configuration and guidelines for working with this repository
using Claude Code.

## Repository Overview

This is an Astro-based website for levinkeller.de with TypeScript, React
components, and Tailwind CSS styling.

## Development Setup

### Prerequisites

- Node.js (check package.json for version requirements)
- npm or equivalent package manager

### Installation

```bash
npm install
```

### Development Commands

```bash
npm run dev     # Start development server
npm run build   # Build for production (includes type checking)
npm run preview # Preview production build
npm test        # Run tests with Vitest
```

## Code Quality & Formatting

This repository uses Biome for formatting and linting:

### Formatting & Linting

- **Biome** handles both formatting and linting
- Config file: `biome.json`
- Settings:
  - Indent: 2 spaces
  - Single quotes
  - No semicolons (as needed)
  - Trailing commas: ES5 style

### Pre-commit Hooks

- **Lefthook** manages git hooks for automated checks

## Before Committing

```bash
# Format and lint code
npm run format
npm run lint:fix

# Or check without fixing
npm run lint

# Run type checking
npm run build
```

## Tech Stack

- **Framework**: Astro 5.x
- **UI**: React 18 with TypeScript
- **Styling**: Tailwind CSS with DaisyUI components
- **Build**: Astro with Vercel deployment
- **Testing**: Vitest
- **Content**: MDX for content authoring

## Key Dependencies

- Astro ecosystem (@astrojs/*)
- React and React DOM
- Tailwind CSS with DaisyUI
- TypeScript
- Various UI libraries (Radix UI, Heroicons, Tabler Icons)

## Guidelines for Claude Code

1. **Format code** with `npm run format` before committing
2. **Run type checks** with `npm run build` to ensure TypeScript compliance
3. **Follow existing code patterns** in the repository
4. **Test changes** when possible using `npm test`
5. **Respect the Astro framework patterns** for components and pages

## File Structure Notes

- Source code is in `src/`
- Astro components use `.astro` extension
- React components use `.tsx` extension
- Configuration files are in the root directory

Even if you comment or generally write in German, you need to use English for
magic github words like (closes, fix, fixes, etc.). "Schließt" will not close
issues.
