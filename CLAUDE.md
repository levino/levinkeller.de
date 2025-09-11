# Claude Code Configuration

This file contains configuration and guidelines for working with this repository using Claude Code.

## Repository Overview

This is an Astro-based website for levinkeller.de with TypeScript, React components, and Tailwind CSS styling.

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

This repository uses automated code formatting and linting:

### Formatting

- **Prettier** is configured with:
  - Trailing commas: ES5 style
  - No semicolons
  - Single quotes
  - Config file: `.prettierrc.yaml`

### Linting

- **ESLint** is configured for TypeScript and Astro
- Config file: `eslint.config.js`
- Ignores: `.astro`, `src/env.d.ts`, `dist/**`, `.vercel/**`

### Pre-commit Hooks

- **lint-staged** is configured to run formatting/linting before commits
- Managed by **Husky** for git hooks

## Before Committing

Always ensure code is properly formatted:

```bash
# Format code
npx prettier --write .

# Check linting
npx eslint .

# Run type checking
npm run build
```

The repository has automated pre-commit hooks that will handle formatting automatically.

## Tech Stack

- **Framework**: Astro 5.x
- **UI**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **Build**: Astro with Vercel deployment
- **Testing**: Vitest
- **Content**: MDX for content authoring

## Key Dependencies

- Astro ecosystem (@astrojs/\*)
- React and React DOM
- Tailwind CSS and related plugins
- TypeScript and ESLint
- Various UI libraries (Radix UI, Heroicons, etc.)

## Guidelines for Claude Code

1. **Always format code** before committing using the configured Prettier settings
2. **Run type checks** with `npm run build` to ensure TypeScript compliance
3. **Follow existing code patterns** in the repository
4. **Use the configured linting rules** - don't override ESLint configuration
5. **Test changes** when possible using `npm test`
6. **Respect the Astro framework patterns** for components and pages

## File Structure Notes

- Source code is typically in `src/`
- Astro components use `.astro` extension
- React components use `.tsx` extension
- Configuration files are in the root directory

Even if you comment or generally write in German, you need to use English for magic github words like (closes, fix, fixes, etc.). "Schließt" will not close issues.
