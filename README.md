# Salary Sacrifice Playground 💸⚡

A completely hypothetical, not advice Salary Sacrifice calculator - a philosophical experiement in the value prop of keeping more of what you earn — legally — by steering taxable salary into things you actually keep: pensions, EVs, bikes, childcare and entitlements. Apologies to the Chancellor.

- Schemes: Pensions • Electric Vehicles (EV) • Cycle to Work • Child Benefit • Free Childcare • Universal Credit
- Tech: React 18 + TypeScript + Vite
- UI: Tailwind CSS + daisyUI + Lucide + Recharts + Framer Motion + Confetti
- Data: `src/lib/taxData.json` (update this to roll your own tax year)

> Entertainment only. Not advice. Double‑check with HR/Payroll. Keep it legal. 😇

---

## Quickstart 🚀

Prereqs: Node.js 18+

```bash
npm install
npm run dev
```

Open http://localhost:5173

---

## What this app does (and why) 🧪

- Shows before/after for salary sacrifice with a focus on “Total Net Value” (cash + pension + benefits + entitlements)
- Includes personal allowance cliffs, HICBC, UC interactions, free childcare (ANI ≤ £100k), and student loan logic
- Highlights wins like dodging HICBC, securing free childcare, becoming UC‑eligible, or reducing student loan to £0

> You’re not evading tax; you’re opting into policy. The Treasury designed this maze, you’re just speed‑running it.

---

## Update the official numbers 📊

Edit `src/lib/taxData.json`. The app consumes:
- Child Benefit as weekly values (we convert to annual)
- UC as monthly values (we convert to annual)

Rebuild after changes:

```bash
npm run build
```

---

## Build 🏗️

```bash
npm run build
```

Outputs static assets to `dist/`.

---

## Deploy to GitHub Pages 🌐

Two good options. Use ONE of these:

### Option A: GitHub Actions (recommended)

1) Add workflow at `.github/workflows/gh-pages.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: |
          echo "BASE_PATH=/${{ github.event.repository.name }}/" >> $GITHUB_ENV
          npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

2) Push to `main`. GitHub Pages will publish automatically. Your site should be live at:

```
https://<user>.github.io/<repo>/
```

Notes:
- Vite base path is read from `BASE_PATH` env (see `vite.config.ts`).
- For a custom domain, add a `CNAME` file to `public/` or configure in Pages settings.

### Option B: CLI deploy (via gh-pages)

1) Set `BASE_PATH` to match your repo name (`/<repo>/`):

```bash
export BASE_PATH="/<repo>/"
```

2) Build and publish:

```bash
npm run deploy
```

This runs `vite build` then publishes `dist/` to the `gh-pages` branch via `gh-pages`.

---

## Minimal repo checklist ✅

Commit these:
- `index.html`
- `package.json`, `tsconfig.json`, `vite.config.ts`
- `tailwind.config.js`, `postcss.config.js`
- `src/` (all app code)
- `public/` (if you add icons, CNAME, etc.)
- `README.md`, `LICENSE`

Exclude (gitignore):
- `node_modules/`
- `dist/`
- `.DS_Store`
- `tsconfig.tsbuildinfo`

Optional cleanup if using Actions (not CLI):
- You can remove the `gh-pages` dev dependency and the `deploy`/`predeploy` scripts from `package.json`.

---

## Usage tips 🧠

- Target pension total: choose “Target Total Pension” to back‑solve employee % (one‑click copy in UI).
- Employer NI pass‑through defaults to 100%. If they aren’t giving it to you, lobby for it.
- The Before/After chart includes cash, pension, EV, cycle, Child Benefit, UC, and free childcare for an honest “what you keep” picture.

---

## Contributing + Support ❤️

- PRs welcome. Keep it friendly, keep it accurate.
- If this saved you cash or taught you a trick, you can tap “Support This” in the app.

---

## License 📜

See `LICENSE`. Personal, non‑commercial use allowed. Contact for commercial use.
