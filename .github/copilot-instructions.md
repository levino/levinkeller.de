# Levin Keller's Personal Website

**ALWAYS follow these instructions first and only fallback to search or bash commands when you encounter unexpected information that doesn't match the info here.**

This is a personal website built with Astro.js, featuring a multi-language blog, documentation, garden planning tools, and financial calculators. The site supports German (primary) and English content.

## Working Effectively

### Bootstrap, build, and test the repository:

- Ensure Node.js 20+ is installed: `node --version` (should show v20.x.x or higher)
- Install dependencies: `npm ci` -- takes 15 seconds. NEVER CANCEL. Set timeout to 60+ seconds.
- Run tests: `npm run test` -- takes 1 second. Validates TypeScript components and financial calculator logic.
- Lint code: `npx eslint .` -- takes 2 seconds. NEVER CANCEL. Set timeout to 30+ seconds.
- Check formatting: `npx prettier -c .` -- takes 4 seconds.
- Build the site: `npm run build` -- takes 21 seconds. NEVER CANCEL. Set timeout to 60+ seconds.

### Run the application:

- ALWAYS run the bootstrapping steps first (npm ci).
- Development server: `npm run dev` -- starts Astro dev server on http://localhost:4321/
- Preview built site: `npm run preview` -- serves built static files on http://localhost:4321/
- Alternative start command: `npm run start` (same as npm run dev)

## Validation

### Manual Testing Requirements:

- ALWAYS test changes by running the development server and navigating to affected pages
- Test both German (/de/) and English (/en/) versions when making content changes
- Key validation scenarios after making changes:
  1. **Homepage navigation**: Visit http://localhost:4321/de/ and http://localhost:4321/en/
  2. **Blog functionality**: Navigate to /de/blog/ and verify blog posts load
  3. **Documentation**: Test /de/docs/ navigation and content rendering
  4. **Garden tools**: Verify /de/garden/ tools work (if modified)
  5. **Financial calculator**: Test /de/tools/ Tilgungsrechner functionality (if modified)

### CI Pipeline Validation:

- ALWAYS run `npx eslint .` before committing -- CI will fail if linting errors exist
- ALWAYS run `npx prettier -c .` before committing -- CI will fail if formatting is incorrect
- ALWAYS run `npm run test` before committing -- CI will fail if tests don't pass
- The CI pipeline (.github/workflows/checks.yml) runs: lint, format check, and tests

## Technology Stack & Key Information

### Core Technologies:

- **Astro.js v5.x**: Static site generator with component islands
- **TypeScript**: For type safety across the codebase
- **React**: For interactive components (Tilgungsrechner, garden tools)
- **Tailwind CSS**: For styling with daisyUI components
- **Vitest**: For unit testing
- **ESLint + Prettier**: Code quality and formatting

### Project Structure:

- `src/pages/`: Route definitions (Astro, MDX, Markdown files)
- `src/components/`: Reusable React/Astro components
- `src/tools/`: Utility functions (calculator logic, etc.)
- `content/`: Content collections (blog posts, docs, plant data)
- `astro.config.js`: Main configuration with integrations
- `package.json`: Dependencies and npm scripts

### Content & Internationalization:

- **Primary language**: German (de)
- **Secondary language**: English (en)
- Content structure: `/de/` and `/en/` URL prefixes
- Content types: Blog posts, documentation, garden planning, financial tools

## Common Development Tasks

### Adding New Content:

- Blog posts: Add to `content/blog/de/` or `content/blog/en/`
- Documentation: Add to `content/docs/de/` or `content/docs/en/`
- Pages: Add to `src/pages/de/` or `src/pages/en/`

### Modifying Components:

- React components: Located in `src/components/`
- Always check TypeScript types and run tests after changes
- Key components: Tilgungsrechner.tsx (financial calculator), garden tools

### Working with Plant/Garden Data:

- Plant data: `content/plants/`, `content/vegetables/`
- Garden beds: `content/beds/`
- YAML configuration files for plant stock and vegetable data

## Timing Expectations & Timeouts

### Build & Test Timings:

- **npm ci**: 15 seconds (with warnings about deprecated packages - this is normal)
- **npm run build**: 21 seconds (includes astro check + astro build)
- **npm run test**: 1 second (2 test files, 8 tests total)
- **npx eslint .**: 2 seconds (may show TypeScript version warning - ignore)
- **npx prettier -c .**: 4 seconds
- **npm run dev**: 2-3 seconds to start, runs indefinitely

### Recommended Timeouts:

- Installation commands: 120+ seconds
- Build commands: 60+ seconds
- Test commands: 30+ seconds
- Lint/format commands: 30+ seconds

## Troubleshooting & Gotchas

### Known Issues:

- **npm ci warnings**: Deprecated package warnings are expected and safe to ignore
- **TypeScript ESLint warning**: Version 5.7.3 vs supported <5.4.0 - runs fine, ignore warning
- **Browserslist warning**: "browsers data is 7 months old" - cosmetic warning, safe to ignore

### Development Tips:

- Use `npm run dev` for hot reloading during development
- The site builds many pages (320+ pages) due to multi-language content and garden data
- Build output shows detailed page generation - this is normal
- Astro dev server binds to 0.0.0.0 for container compatibility

### File System:

- Build output: `dist/` directory (gitignored)
- Node modules: `node_modules/` (gitignored)
- Temporary files: Use `/tmp/` for any temporary files during development

## Example Commands Output

### Repository root listing:

```
.devcontainer/  .github/  .gitignore  .husky/  .prettierrc.yaml
LICENSE  astro.config.js  content/  eslint.config.js  package-lock.json
package.json  patches/  postcss.config.js  public/  src/
tailwind.config.mjs  tsconfig.json  turbo.json  vercel.json
```

### Source directory structure:

```
src/
├── assets/
├── collections/
├── components/
├── content.config.ts
├── env.d.ts
├── pages/
└── tools/
```

### Package.json scripts:

```json
{
  "dev": "astro dev --host 0.0.0.0",
  "test": "vitest",
  "start": "astro dev --host 0.0.0.0",
  "build": "astro check && astro build",
  "preview": "astro preview --host 0.0.0.0",
  "astro": "astro"
}
```
