#!/usr/bin/env node
"use strict";

/*
 * Local admin panel for the blog.
 *
 * Runs on your machine only (binds to 127.0.0.1) and edits the repo directly:
 * posts land in _drafts/ or _posts/ as ordinary markdown files, images in
 * images/, and publishing is a git commit + push. Nothing is hosted, so there
 * is no auth layer and no third-party service holding your content.
 *
 *   node admin/server.js          # http://127.0.0.1:4000
 *   node admin/server.js --port 5000
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");
const fm = require("./lib/frontmatter");

const ROOT = path.resolve(__dirname, "..");
const POSTS_DIR = path.join(ROOT, "_posts");
const DRAFTS_DIR = path.join(ROOT, "_drafts");
const IMAGES_DIR = path.join(ROOT, "images");
const PUBLIC_DIR = path.join(__dirname, "public");

const MAX_BODY_BYTES = 32 * 1024 * 1024; // generous enough for a base64 image

const argv = process.argv.slice(2);
const portArg = argv.indexOf("--port");
const PORT = portArg !== -1 ? parseInt(argv[portArg + 1], 10) : 4000;

/* ------------------------------------------------------------------ utils */

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/*
 * Every filename that arrives from the browser goes through this. It rejects
 * path separators and traversal outright rather than trying to sanitise them,
 * so a crafted name cannot escape the intended directory.
 */
function safeName(name) {
  const base = String(name || "");
  if (!base || base.includes("/") || base.includes("\\") || base.includes("\0")) return null;
  if (base === "." || base === "..") return null;
  if (!/^[A-Za-z0-9._-]+$/.test(base)) return null;
  return base;
}

function resolveIn(dir, name) {
  const safe = safeName(name);
  if (!safe) return null;
  const full = path.resolve(dir, safe);
  // Belt and braces: confirm the resolved path really is inside `dir`.
  if (full !== path.join(dir, safe) || !full.startsWith(dir + path.sep)) return null;
  return full;
}

function todayISO() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function json(res, code, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error("Request body too large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => {
      if (!chunks.length) return resolve({});
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch (e) {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function git(args) {
  return new Promise((resolve, reject) => {
    execFile("git", ["-C", ROOT].concat(args), { maxBuffer: 8 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) return reject(new Error((stderr || err.message).trim()));
      resolve(stdout.toString());
    });
  });
}

/* ------------------------------------------------------------------ posts */

function listDir(dir, isDraft) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(md|markdown)$/i.test(f))
    .map((file) => {
      const full = path.join(dir, file);
      let parsed = { data: {}, body: "" };
      try {
        parsed = fm.parse(fs.readFileSync(full, "utf8"));
      } catch (e) {
        /* unreadable file still gets listed, just without metadata */
      }
      const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})-/);
      return {
        file,
        draft: isDraft,
        title: parsed.data.title || file.replace(/\.(md|markdown)$/i, ""),
        date: parsed.data.date || (dateMatch ? dateMatch[1] : ""),
        categories: [].concat(parsed.data.categories || []),
        tags: [].concat(parsed.data.tags || []),
        excerpt: parsed.data.excerpt || "",
        words: parsed.body.split(/\s+/).filter(Boolean).length,
        mtime: fs.statSync(full).mtimeMs,
      };
    })
    .sort((a, b) => String(b.date).localeCompare(String(a.date)) || b.mtime - a.mtime);
}

function allPosts() {
  return listDir(DRAFTS_DIR, true).concat(listDir(POSTS_DIR, false));
}

function locate(file, draft) {
  return resolveIn(draft ? DRAFTS_DIR : POSTS_DIR, file);
}

/* --------------------------------------------------------------- handlers */

const routes = {
  "GET /api/posts": async (req, res) => json(res, 200, { posts: allPosts() }),

  "GET /api/meta": async (req, res) => {
    const tags = new Set();
    const categories = new Set();
    allPosts().forEach((p) => {
      p.tags.forEach((t) => tags.add(t));
      p.categories.forEach((c) => categories.add(c));
    });
    let images = [];
    if (fs.existsSync(IMAGES_DIR)) {
      images = fs
        .readdirSync(IMAGES_DIR)
        .filter((f) => /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(f))
        .sort();
    }
    return json(res, 200, {
      tags: [...tags].sort(),
      categories: [...categories].sort(),
      images,
      today: todayISO(),
    });
  },

  "GET /api/post": async (req, res, url) => {
    const file = url.searchParams.get("file");
    const draft = url.searchParams.get("draft") === "1";
    const full = locate(file, draft);
    if (!full || !fs.existsSync(full)) return json(res, 404, { error: "Post topilmadi" });
    const parsed = fm.parse(fs.readFileSync(full, "utf8"));
    return json(res, 200, { file, draft, data: parsed.data, extra: parsed.extra, body: parsed.body });
  },

  "POST /api/post": async (req, res) => {
    const payload = await readBody(req);
    const title = String(payload.title || "").trim();
    if (!title) return json(res, 400, { error: "Sarlavha bo'sh bo'lishi mumkin emas" });

    const draft = !!payload.draft;
    const date = /^\d{4}-\d{2}-\d{2}$/.test(payload.date || "") ? payload.date : todayISO();
    // An explicit slug is sanitised but otherwise left alone, so editing an
    // existing post never renames its file (and never changes its permalink).
    // Only a slug derived from the title gets the full transliteration.
    const slug =
      (payload.slug ? fm.sanitizeSlug(payload.slug) : "") || fm.slugify(title);

    // Drafts have no date prefix; posts must have one for Jekyll to pick them up.
    const targetName = draft ? `${slug}.md` : `${date}-${slug}.md`;
    const targetDir = draft ? DRAFTS_DIR : POSTS_DIR;
    ensureDir(targetDir);

    const target = resolveIn(targetDir, targetName);
    if (!target) return json(res, 400, { error: "Yaroqsiz fayl nomi" });

    const data = Object.assign({}, payload.extraData || {}, {
      title,
      date,
      categories: (payload.categories || []).filter(Boolean),
      tags: (payload.tags || []).filter(Boolean),
      excerpt: String(payload.excerpt || "").trim(),
    });
    if (payload.mathjax) data.mathjax = true;
    if (payload.teaser) data.header = { teaser: payload.teaser };

    const contents = fm.serialize(data, payload.extra || [], payload.body || "");

    // Renaming or moving between drafts and posts: remove the old file.
    const original = payload.originalFile;
    if (original) {
      const prev = locate(original, !!payload.originalDraft);
      if (prev && prev !== target && fs.existsSync(prev)) fs.unlinkSync(prev);
    } else if (fs.existsSync(target) && !payload.overwrite) {
      return json(res, 409, { error: `${targetName} allaqachon mavjud`, file: targetName });
    }

    fs.writeFileSync(target, contents, "utf8");
    return json(res, 200, { ok: true, file: targetName, draft, path: path.relative(ROOT, target) });
  },

  "POST /api/delete": async (req, res) => {
    const payload = await readBody(req);
    const full = locate(payload.file, !!payload.draft);
    if (!full || !fs.existsSync(full)) return json(res, 404, { error: "Post topilmadi" });
    fs.unlinkSync(full);
    return json(res, 200, { ok: true });
  },

  "POST /api/upload": async (req, res) => {
    const payload = await readBody(req);
    const raw = String(payload.filename || "");
    const ext = (path.extname(raw) || ".png").toLowerCase();
    if (![".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".avif"].includes(ext)) {
      return json(res, 400, { error: `Rasm formati qo'llab-quvvatlanmaydi: ${ext}` });
    }

    const base = fm.slugify(path.basename(raw, path.extname(raw))) || "image";
    ensureDir(IMAGES_DIR);

    // Never clobber an existing image — suffix until the name is free.
    let name = `${base}${ext}`;
    let n = 1;
    while (fs.existsSync(path.join(IMAGES_DIR, name))) name = `${base}-${n++}${ext}`;

    const target = resolveIn(IMAGES_DIR, name);
    if (!target) return json(res, 400, { error: "Yaroqsiz fayl nomi" });

    const b64 = String(payload.data || "").replace(/^data:[^;]+;base64,/, "");
    fs.writeFileSync(target, Buffer.from(b64, "base64"));
    return json(res, 200, { ok: true, url: `/images/${name}`, name });
  },

  "GET /api/git/status": async (req, res) => {
    try {
      const [status, branch] = await Promise.all([
        git(["status", "--porcelain"]),
        git(["rev-parse", "--abbrev-ref", "HEAD"]),
      ]);
      const files = status
        .split("\n")
        .filter(Boolean)
        .map((l) => ({ status: l.slice(0, 2).trim(), file: l.slice(3) }));
      return json(res, 200, { branch: branch.trim(), files });
    } catch (e) {
      return json(res, 500, { error: e.message });
    }
  },

  "POST /api/git/publish": async (req, res) => {
    const payload = await readBody(req);
    const message = String(payload.message || "").trim() || "New post";
    try {
      await git(["add", "--", "_posts", "_drafts", "images"]);
      const staged = await git(["diff", "--cached", "--name-only"]);
      if (!staged.trim()) return json(res, 200, { ok: true, nothing: true });

      await git(["commit", "-m", message]);
      const out = payload.push === false ? "" : await git(["push"]);
      return json(res, 200, { ok: true, pushed: payload.push !== false, output: out });
    } catch (e) {
      return json(res, 500, { error: e.message });
    }
  },
};

/* ----------------------------------------------------------- static files */

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
};

function serveStatic(res, baseDir, relPath, fallback) {
  const full = path.resolve(baseDir, "." + relPath);
  if (!full.startsWith(baseDir)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }
  let file = full;
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    if (!fallback) {
      res.writeHead(404);
      return res.end("Not found");
    }
    file = fallback;
  }
  const type = MIME[path.extname(file).toLowerCase()] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-store" });
  fs.createReadStream(file).pipe(res);
}

/* ------------------------------------------------------------------ serve */

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "127.0.0.1"}`);
  const key = `${req.method} ${url.pathname}`;

  if (routes[key]) {
    try {
      return await routes[key](req, res, url);
    } catch (e) {
      return json(res, 500, { error: e.message || String(e) });
    }
  }

  if (url.pathname.startsWith("/api/")) return json(res, 404, { error: "Unknown endpoint" });

  // Let the editor preview images straight out of the repo.
  if (url.pathname.startsWith("/images/")) {
    return serveStatic(res, IMAGES_DIR, url.pathname.replace("/images", ""), null);
  }

  return serveStatic(res, PUBLIC_DIR, url.pathname === "/" ? "/index.html" : url.pathname,
    path.join(PUBLIC_DIR, "index.html"));
});

server.listen(PORT, "127.0.0.1", () => {
  ensureDir(DRAFTS_DIR);
  console.log(`\n  Blog admin panel\n  → http://127.0.0.1:${PORT}\n`);
  console.log(`  Repo:   ${ROOT}`);
  console.log(`  Posts:  ${path.relative(ROOT, POSTS_DIR)}/`);
  console.log(`  Drafts: ${path.relative(ROOT, DRAFTS_DIR)}/`);
  console.log(`  Images: ${path.relative(ROOT, IMAGES_DIR)}/\n`);
  console.log("  Ctrl+C to stop.\n");
});

server.on("error", (e) => {
  if (e.code === "EADDRINUSE") {
    console.error(`\n  Port ${PORT} band. Boshqa portda ishga tushiring:\n`);
    console.error(`    node admin/server.js --port ${PORT + 1}\n`);
    process.exit(1);
  }
  throw e;
});
