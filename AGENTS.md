# Project agent memory

This file is the project's committed home for project-intrinsic agent knowledge: build, test, release, architecture, and sharp-edge notes that should travel with the code.

- Add durable project-specific notes here as they are discovered through real work.
- Package manager is pnpm (see `README.md#Deployment`); `pnpm install` before `pnpm run validate` (typecheck, lint, test, build).
- `content/site.ts` mixes live and dead content: `education`, `timeline`, `projects` are imported and rendered by `app/page.tsx`; `personal`, `professionalExperience`, `technicalSkills` are unused exports mirroring resume data (kept in sync manually, not rendered anywhere). Check actual imports in `app/page.tsx` before assuming an export is user-visible.
- `content/resume.tex` is a standalone LaTeX resume source, not wired into any build step or served asset — update it manually alongside `content/site.ts` when resume content changes.
- The "See resume" CTA (`hero.cta.secondary.href` in `content/site.ts`) is an external Google Drive link, not a locally served PDF. The repo-root `Surya_Atmuri_resume (*).pdf` file is tracked in git but not referenced by any route or component.
- Deployment is Netlify, auto-deploying from `main` on merge (see `README.md#Deployment`); no GitHub Actions workflows exist in this repo.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
