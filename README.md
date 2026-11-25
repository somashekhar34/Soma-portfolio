# Somasekhar Addakula's Portfolio

Personal portfolio site for Somasekhar Goud Addakula, Data Engineer. Built with React, TypeScript, Vite, Tailwind CSS, and Framer Motion.

**Live site:** https://somaaddakula.com

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Framer Motion (scroll animations)

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deployment

Pushes to `main` automatically build and deploy to GitHub Pages via `.github/workflows/deploy.yml`.

To enable it the first time: in the repo's **Settings → Pages**, set **Source** to **GitHub Actions**.

## Content

All resume content (experience, skills, projects, education) lives in `src/data/resume.ts`; edit that file to update the site without touching components.
