"use strict";

/*
 * A deliberately small YAML front-matter reader/writer.
 *
 * It is NOT a general YAML parser — it handles exactly the shapes this blog
 * uses (scalars, flow lists, block lists, and one level of nesting for
 * `header:`), which keeps the admin panel dependency-free. Anything it does
 * not recognise is preserved verbatim in `extra` and written back out, so
 * editing a post can never silently drop front matter it did not understand.
 */

const DELIM = /^---\s*$/;

function stripQuotes(value) {
  const v = value.trim();
  if (v.length >= 2 && ((v[0] === '"' && v.endsWith('"')) || (v[0] === "'" && v.endsWith("'")))) {
    return v.slice(1, -1);
  }
  return v;
}

function parseFlowList(value) {
  return value
    .slice(1, -1)
    .split(",")
    .map((s) => stripQuotes(s))
    .filter((s) => s.length > 0);
}

function parse(raw) {
  const text = String(raw).replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const lines = text.split("\n");

  if (!DELIM.test(lines[0] || "")) {
    // No front matter at all — treat the whole file as body.
    return { data: {}, extra: [], body: text };
  }

  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (DELIM.test(lines[i])) {
      end = i;
      break;
    }
  }
  if (end === -1) return { data: {}, extra: [], body: text };

  const fmLines = lines.slice(1, end);
  const body = lines.slice(end + 1).join("\n").replace(/^\n+/, "");

  const data = {};
  const extra = [];

  for (let i = 0; i < fmLines.length; i++) {
    const line = fmLines[i];
    if (!line.trim() || /^\s*#/.test(line)) continue;

    const m = line.match(/^([A-Za-z_][\w.-]*):\s*(.*)$/);
    if (!m) {
      extra.push(line);
      continue;
    }

    const key = m[1];
    const rest = m[2].trim();

    if (rest === "") {
      // Could be a block list, a nested map, or an intentionally empty value.
      const items = [];
      const nested = {};
      let j = i + 1;
      for (; j < fmLines.length; j++) {
        const li = fmLines[j].match(/^\s+-\s+(.*)$/);
        if (li) {
          items.push(stripQuotes(li[1]));
          continue;
        }
        const nm = fmLines[j].match(/^\s+([A-Za-z_][\w.-]*):\s*(.*)$/);
        if (nm) {
          nested[nm[1]] = stripQuotes(nm[2]);
          continue;
        }
        break;
      }
      if (items.length) data[key] = items;
      else if (Object.keys(nested).length) data[key] = nested;
      else data[key] = "";
      i = j - 1;
    } else if (rest.startsWith("[") && rest.endsWith("]")) {
      data[key] = parseFlowList(rest);
    } else if (rest === "true" || rest === "false") {
      data[key] = rest === "true";
    } else {
      data[key] = stripQuotes(rest);
    }
  }

  return { data, extra, body };
}

// Quote only when the value could otherwise be misread as YAML.
function scalar(value) {
  const s = String(value);
  if (s === "") return '""';
  if (/^(true|false|null|yes|no|on|off)$/i.test(s)) return `"${s}"`;
  if (/^[-\d]/.test(s) && !/^\d{4}-\d{2}-\d{2}$/.test(s)) return `"${s.replace(/"/g, '\\"')}"`;
  if (/[:#\[\]{}&*!|>'"%@`?,]/.test(s)) return `"${s.replace(/"/g, '\\"')}"`;
  return s;
}

// Keys are emitted in a stable order so diffs stay readable in git.
const KEY_ORDER = [
  "title",
  "date",
  "last_modified_at",
  "categories",
  "tags",
  "excerpt",
  "header",
  "mathjax",
  "toc",
  "layout",
  "permalink",
  "author_profile",
  "read_time",
  "share",
  "related",
  "published",
];

function serialize(data, extra, body) {
  const out = ["---"];
  const seen = new Set();

  const emit = (key) => {
    if (seen.has(key) || !(key in data)) return;
    seen.add(key);
    const value = data[key];

    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      if (!value.length) return;
      // Block style for categories, flow style for tags — matches the
      // conventions already used across this blog's existing posts.
      if (key === "categories") {
        out.push(`${key}:`);
        value.forEach((v) => out.push(`  - ${scalar(v)}`));
      } else {
        out.push(`${key}: [${value.join(", ")}]`);
      }
      return;
    }

    if (typeof value === "object") {
      const keys = Object.keys(value).filter((k) => value[k] !== "" && value[k] != null);
      if (!keys.length) return;
      out.push(`${key}:`);
      keys.forEach((k) => out.push(`  ${k}: ${scalar(value[k])}`));
      return;
    }

    if (typeof value === "boolean") {
      out.push(`${key}: ${value}`);
      return;
    }

    if (String(value).trim() === "") return;
    out.push(`${key}: ${scalar(value)}`);
  };

  KEY_ORDER.forEach(emit);
  Object.keys(data).forEach(emit); // anything not in KEY_ORDER

  (extra || []).forEach((line) => out.push(line));

  out.push("---");
  out.push("");
  out.push(String(body).replace(/^\n+/, ""));
  let text = out.join("\n");
  if (!text.endsWith("\n")) text += "\n";
  return text;
}

/* Slug generation. Uzbek Latin uses o', g', ʻ and ʼ, which would otherwise
   turn into stray hyphens or vanish inconsistently. */
function slugify(input) {
  const map = {
    "ʻ": "", "ʼ": "", "'": "", "'": "", "'": "", "`": "",
    "ā": "a", "ç": "c", "ğ": "g", "ı": "i", "ñ": "n", "ö": "o",
    "ş": "s", "ü": "u", "ә": "a", "ў": "o", "қ": "q", "ғ": "g", "ҳ": "h",
  };

  return String(input)
    .toLowerCase()
    .replace(/[ʻʼ''`']/g, "")
    .replace(/[āçğıñöşüәўқғҳ]/g, (c) => (c in map ? map[c] : c))
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "post";
}

/*
 * For a slug the author supplied explicitly (typically the existing filename
 * of a post being edited). Unlike slugify() this preserves underscores, so
 * re-saving `2026-01-01-computer_vision.md` does not rename it to
 * `...-computer-vision.md` — a rename would change the post's permalink and
 * break every existing link to it.
 */
function sanitizeSlug(input) {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/[ʻʼ''''`]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "")
    .replace(/^[-._]+|[-._]+$/g, "")
    .slice(0, 80);
}

module.exports = { parse, serialize, slugify, sanitizeSlug };
