# AGENTS.md — Project Context & Operating Rules

Authoritative context for AI agents working in this repo. Read this before
touching any file. Design framework reference: `design.md`.

## Project Overview

- **Site**: lanyuejie-blog (research / AI knowledge blog)
- **Stack**: VitePress 1.6.4 (SSG docs site) + Express 5 (admin backend in `server/`, port 3001)
- **Base path**: `/lanyuejie-blog/` (GitHub Pages subpath)
- **Live URL**: https://johboby.github.io/lanyuejie-blog/
- **Deploy**: GitHub Actions `.github/workflows/deploy.yml` — push `main` → build → deploy-pages → IndexNow

## Repository Layout

| Path | Purpose |
| --- | --- |
| `docs/.vitepress/config.js` | Site config: SEO / JSON-LD / RSS / llms.txt, markdown image-lazy hook, search-index slimming, vite proxy `/api → 3001` |
| `docs/.vitepress/posts.data.js` | `createContentLoader('posts/*.md', { excerpt: true, render: false })` — SSG article index |
| `docs/.vitepress/theme/style.css` | Design tokens + global component styles |
| `docs/.vitepress/theme/Layout.vue` | Wraps `DefaultTheme.Layout`, injects `PostBreadcrumb` / `ReadingEnhance` / `PostFeatures` |
| `docs/.vitepress/theme/components/` | `PostFeatures.vue` (related / pager / share / CTA), `ReadingEnhance.vue` (progress / font / table scroll), `PostBreadcrumb.vue` |
| `docs/index.md` | Editorial-magazine home (featured + product/tech grids + dynamic metrics) |
| `docs/posts/*.md` | Article sources (~87 posts) |
| `server/index.js` + `server/routes/*` | Admin API: `/api/posts` (CRUD + paging), `/api/categories`, `/api/search`, `/api/upload`, `/api/stats` |
| `server/utils/posts.js` | Article read/write core (gray-matter + fs-extra) |
| `server/lint.js` | Frontmatter auto-fix + watch |
| `patches/vitepress+1.6.4.patch` | patch-package fix for Windows drive-letter bug |
| `.github/workflows/deploy.yml` | Pages deploy pipeline |

## Design System Conventions (v3)

- All color / spacing / radius / shadow / motion must use **CSS variables** (design tokens) defined at the top of `style.css`.
- Dark mode overrides tokens via `.dark`; honor `prefers-reduced-motion`.
- No emoji as icons (use SVG / brand glyphs).
- APCA contrast: body ≥ Lc 75, large text ≥ Lc 45, UI elements ≥ Lc 30.

## Critical Gotchas

### Windows drive-letter build failure (VitePress 1.6.4)

`vitepress build` on Windows fails with `Cannot read properties of undefined
(reading 'imports')` inside `resolvePageImports`. Root cause:
`fs.realpathSync` returns an upper-case drive letter (`D:/...`) while
`config.srcDir` resolves lower-case (`d:/...`), so
`chunk.facadeModuleId === srcPath` never matches.

- **Fix**: `patch-package` patch at `patches/vitepress+1.6.4.patch`, applied by
  `"postinstall": "patch-package"` in `package.json`. After `npm install`,
  confirm `npm run postinstall` ran (`vitepress@1.6.4 ✔`). CI (Linux) is
  unaffected.

### Search-index slimming (`_render`)

`themeConfig.search.options._render(src, env, md)` truncates the body indexed
by local search. Without it the `@localSearchIndex*.js` is ~4.3 MB (kills LCP);
truncated to 1800 chars it is ~266 KB. Do not remove this hook.

### VitePress base / `withBase`

- `createContentLoader` yields `post.url` **without** base (e.g.
  `/posts/xxx.html`). In Vue templates and home-page links you **must** use
  `withBase(post.url)` → `/lanyuejie-blog/posts/xxx.html`; a bare `post.url`
  404s under the subpath. `withBase` only applies to paths starting with `/`.
- In markdown, image refs use root-absolute paths **without** base
  (`![](/images/xxx.svg)`); VitePress adds the base automatically. Use
  `withBase()` only inside Vue templates.
- Verification: build then grep `dist/assets/chunks/posts.data.*.js` —
  entries like `/posts/...` prove the loader is base-free.

### favicon absolute path

In `head`, write the full base-qualified URL
`['link',{rel:'icon',type:'image/svg+xml',href:'/lanyuejie-blog/favicon.svg'}]`.
VitePress does not rewrite it; the browser hits `dist/favicon.svg` directly.
Using `/favicon.svg` or `./favicon.svg` breaks on sub-path pages (404).

### CSS editor trap

When replacing large blocks in `style.css`, repeated fragments can leave
duplicate selector blocks that break parsing. After editing, grep the
selector to confirm uniqueness, then rebuild.

### extractText must skip scripts/styles

The `og:description` extraction in `config.js` / `posts.data.js` must skip
`<script>` / `<style>` and HTML tags, otherwise Vue SFC source leaks into
meta.

### Fonts

Do not use Google Fonts. On mainland-China access to GitHub Pages,
`fonts.googleapis.com` is unreliable and CJK falls back to a large
sim-Hei face. Headings use weight-900 sans; numbers can use Georgia serif
for an editorial feel.

### VitePress preview cache

`vitepress preview` keeps a file-list cache; after a rebuild, new hashed
CSS/JS 404 until the preview process is restarted.

### PowerShell / build notes

- `Get-Content` needs explicit `-Encoding UTF8` or the agent security policy
  blocks it; prefer the built-in read tool.
- Background `npm run build` monitoring in PowerShell tends to time out and
  misreport; just check `dist/` artifacts directly.
- `vitepress` stderr progress gets wrapped as `NativeCommandError` under
  PowerShell — that is noise, not a real error (exit 0 + `build complete`
  confirms success).
- `package.json` has `"type":"module"`; ad-hoc node scripts must be `.mjs`
  or use `import` syntax.
- After backend changes, if an old process holds the port, the API still
  serves stale logic → `Get-Process node | Stop-Process -Force` before
  debugging.

## Deployment

- Remote is SSH (`git@github.com:johboby/lanyuejie-blog.git`). Local network
  has no outbound https to GitHub but ssh (22) works.
- `git config core.sshCommand "ssh -o StrictHostKeyChecking=accept-new"`
  is set, so a plain `git push` works.
- PowerShell swallows git output as CLIXML; verify with
  `git --no-pager push origin main > push.log 2>&1; echo $LASTEXITCODE`.
- `.gitignore` ignores `.codebuddy/` and `111/` (workspace data, do not
  commit).

## Home-page editorial direction (final)

- Magazine-cover centered Hero (no right-side visual panel — rejected twice,
  do not reintroduce).
- Georgia serif metric strip.
- Featured card: brand-coverage media (no `mix-blend-mode:multiply`, which
  crushes to a color block in dark mode).
- Article-card thumbnails use `hueOf(title)` for a stable per-title hue
  (brand green–gold range); featured uses `CATEGORY_GROUPS` keyword
  clustering (7 groups) with hue + glyph + short label.

## Online 404 triage order

Before changing code, `web_fetch` the live URL to confirm the real status.
User-reported "404" is often a hard browser cache; the live page is usually
fine.

## mailto console noise

`Launched external handler for 'mailto:...'` in the console on click is
normal, not an error.
