#!/usr/bin/env node
/*
 * build-manifest.js  (optional)
 * ---------------------------------------------------------
 * Scans the docs/ folder and regenerates library.json by
 * reading each file's <title> and <meta name="description">.
 *
 * Run with:  node build-manifest.js
 *
 * You do NOT need this script — hand-editing library.json is
 * perfectly fine. Use it only if you'd rather not touch JSON.
 *
 * Tags and dates can't be inferred from the HTML, so the
 * script preserves whatever tags/date you already set in the
 * existing library.json for files it recognises, and uses an
 * empty tag list + today's date for brand-new files.
 */

const fs = require("fs");
const path = require("path");

const DOCS_DIR = path.join(__dirname, "docs");
const MANIFEST = path.join(__dirname, "library.json");

function readTag(html, regex, fallback) {
  const m = html.match(regex);
  return m ? m[1].trim() : fallback;
}

// Load existing manifest so we keep tags/dates already set.
let existing = [];
try {
  existing = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
} catch (_) { /* no manifest yet — that's fine */ }

const byFile = {};
existing.forEach((e) => { byFile[e.file] = e; });

const today = new Date().toISOString().slice(0, 10);

const manifest = fs
  .readdirSync(DOCS_DIR)
  .filter((f) => f.toLowerCase().endsWith(".html"))
  .map((f) => {
    const rel = "docs/" + f;
    const html = fs.readFileSync(path.join(DOCS_DIR, f), "utf8");
    const prev = byFile[rel] || {};
    return {
      title: readTag(html, /<title>([^<]*)<\/title>/i, f.replace(/\.html$/i, "")),
      file: rel,
      desc: readTag(
        html,
        /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i,
        prev.desc || ""
      ),
      tags: prev.tags || [],
      date: prev.date || today,
    };
  })
  .sort((a, b) => a.title.localeCompare(b.title));

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log("Wrote " + manifest.length + " entries to library.json");
