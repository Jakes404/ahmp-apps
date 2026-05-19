# Document Library

A static, searchable library for a collection of HTML files. No backend, no
database, no build step required — just files hosted free on GitHub Pages.

## What's in here

```
document-library/
├── index.html          The library front page (search / filter / sort)
├── library.json        The manifest — lists every document
├── build-manifest.js   Optional: auto-generates library.json (needs Node.js)
└── docs/               Your HTML documents live here
    ├── getting-started.html
    ├── reference-sheet.html
    └── sample-report.html
```

## Viewing it locally

`index.html` loads `library.json` with `fetch()`, which browsers block when you
open the file directly (`file://`). Run a tiny local server instead:

```
cd document-library
python3 -m http.server 8000
```

Then open <http://localhost:8000>. (Any static server works — `npx serve`, etc.)

## Publishing it on GitHub Pages

1. Create a new repository on GitHub (public — Pages is free for public repos).
2. Put the **contents** of this `document-library` folder in the repo root —
   that is, `index.html` should sit at the top level of the repo, not inside a
   subfolder. Commit and push.
3. In the repo: **Settings → Pages**.
4. Under "Build and deployment", set **Source** to *Deploy from a branch*,
   pick your `main` branch and the `/ (root)` folder, and save.
5. Wait a minute. Your library goes live at
   `https://<your-username>.github.io/<repo-name>/`.

Because everything is static, the site is fast, always available, and needs no
maintenance between updates.

> **Tip:** add an empty file named `.nojekyll` to the repo root. GitHub Pages
> runs Jekyll by default; `.nojekyll` turns that off so every file (including
> anything in folders that start with an underscore) is served exactly as-is.

## Adding a new document

1. Put your new `.html` file in the `docs/` folder.
2. Add one entry to `library.json`:

   ```json
   {
     "title": "My New Document",
     "file": "docs/my-new-document.html",
     "desc": "A short sentence describing it.",
     "tags": ["Guide"],
     "date": "2026-05-19"
   }
   ```

3. Commit and push. GitHub Pages redeploys automatically within a minute.

`title`, `file`, and `desc` are required; `tags` (an array) and `date`
(`YYYY-MM-DD`) are optional but power the category filtering and sorting.

### Optional: skip the JSON editing

If you'd rather not touch `library.json` by hand, run the build script after
adding files (requires Node.js):

```
node build-manifest.js
```

It scans `docs/`, reads each file's `<title>` and
`<meta name="description">`, and rewrites the manifest — preserving any tags
and dates you'd already set. To make the script's job easier, give each
document a `<title>` and a description meta tag (the three sample files show
the pattern).

## Customising the look

All styling is in the `<style>` block at the top of `index.html`, following the
AHMP design system. The colour palette and fonts are defined as CSS variables
under `:root` — change `--blue`, `--gray-*`, or the font tokens there to
re-skin the whole page in a few lines.
