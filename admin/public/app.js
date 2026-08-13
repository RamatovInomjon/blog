"use strict";

/* Admin panel front-end. Talks to admin/server.js over a small JSON API. */

const $ = (sel) => document.querySelector(sel);

const el = {
  postList: $("#postList"),
  filter: $("#filterInput"),
  title: $("#titleInput"),
  slug: $("#slugInput"),
  date: $("#dateInput"),
  excerpt: $("#excerptInput"),
  teaser: $("#teaserInput"),
  mathjax: $("#mathjaxInput"),
  body: $("#bodyInput"),
  preview: $("#preview"),
  panes: $("#panes"),
  counter: $("#counter"),
  toast: $("#toast"),
  meta: document.querySelector(".meta"),
  branchChip: $("#branchChip"),
  changesChip: $("#changesChip"),
  imageInput: $("#imageInput"),
  publishModal: $("#publishModal"),
  publishFiles: $("#publishFiles"),
  commitMessage: $("#commitMessage"),
  pushCheck: $("#pushCheck"),
};

/* Editor state. `current` is null for an unsaved new post. */
let state = {
  current: null,       // { file, draft }
  categories: [],
  tags: [],
  extra: [],           // unrecognised front-matter lines, preserved verbatim
  extraData: {},       // front-matter keys the form doesn't expose
  posts: [],
  filter: "all",
  dirty: false,
  slugTouched: false,
};

/* ─────────────────────────── helpers ─────────────────────────── */

async function api(path, options) {
  const res = await fetch(path, Object.assign({ headers: { "Content-Type": "application/json" } }, options));
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

let toastTimer;
function toast(message, kind) {
  clearTimeout(toastTimer);
  el.toast.textContent = message;
  el.toast.className = "toast" + (kind ? ` toast--${kind}` : "");
  el.toast.hidden = false;
  toastTimer = setTimeout(() => { el.toast.hidden = true; }, kind === "error" ? 5000 : 2600);
}

// Mirrors slugify() in admin/lib/frontmatter.js so the preview URL matches
// the filename the server will actually write.
function slugify(input) {
  return String(input)
    .toLowerCase()
    .replace(/[ʻʼ‘’'`]/g, "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function markDirty() {
  state.dirty = true;
}

/* ─────────────────────────── token inputs ─────────────────────────── */

function makeTokenField(container, key) {
  const node = $(container);

  function render() {
    node.innerHTML = "";
    state[key].forEach((value, index) => {
      const chip = document.createElement("span");
      chip.className = "token";
      chip.append(document.createTextNode(value));
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "×";
      remove.setAttribute("aria-label", `${value} ni o'chirish`);
      remove.onclick = (e) => {
        e.stopPropagation();
        state[key].splice(index, 1);
        markDirty();
        render();
      };
      chip.appendChild(remove);
      node.appendChild(chip);
    });

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = state[key].length ? "" : node.dataset.placeholder || "";
    input.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        const value = input.value.trim().replace(/,$/, "");
        if (value && !state[key].includes(value)) {
          state[key].push(value);
          markDirty();
          render();
          node.querySelector("input").focus();
        }
        input.value = "";
      } else if (e.key === "Backspace" && !input.value && state[key].length) {
        state[key].pop();
        markDirty();
        render();
        node.querySelector("input").focus();
      }
    };
    // Don't lose a half-typed tag when focus moves away.
    input.onblur = () => {
      const value = input.value.trim();
      if (value && !state[key].includes(value)) {
        state[key].push(value);
        markDirty();
        render();
      }
    };
    node.appendChild(input);
  }

  node.onclick = () => node.querySelector("input").focus();
  return render;
}

const renderCats = makeTokenField("#catTokens", "categories");
const renderTags = makeTokenField("#tagTokens", "tags");

/* ─────────────────────────── post list ─────────────────────────── */

function renderPostList() {
  const query = el.filter.value.trim().toLowerCase();
  const items = state.posts.filter((p) => {
    if (state.filter === "draft" && !p.draft) return false;
    if (state.filter === "published" && p.draft) return false;
    if (!query) return true;
    return (
      p.title.toLowerCase().includes(query) ||
      p.tags.join(" ").toLowerCase().includes(query) ||
      p.file.toLowerCase().includes(query)
    );
  });

  el.postList.innerHTML = "";
  if (!items.length) {
    const empty = document.createElement("li");
    empty.className = "postlist__empty";
    empty.textContent = query ? "Hech narsa topilmadi" : "Hali post yo'q";
    el.postList.appendChild(empty);
    return;
  }

  items.forEach((p) => {
    const li = document.createElement("li");
    if (state.current && state.current.file === p.file && state.current.draft === p.draft) {
      li.classList.add("is-active");
    }

    const title = document.createElement("div");
    title.className = "pt";
    title.textContent = p.title;

    const meta = document.createElement("div");
    meta.className = "pm";
    const badge = document.createElement("span");
    badge.className = "badge " + (p.draft ? "badge--draft" : "badge--live");
    badge.textContent = p.draft ? "qoralama" : "live";
    meta.appendChild(badge);
    const info = document.createElement("span");
    info.textContent = `${p.date || "—"} · ${p.words} so'z`;
    meta.appendChild(info);

    li.append(title, meta);
    li.onclick = () => openPost(p);
    el.postList.appendChild(li);
  });
}

/* ─────────────────────────── load / save ─────────────────────────── */

async function refreshPosts() {
  const data = await api("/api/posts");
  state.posts = data.posts;
  renderPostList();
}

function confirmDiscard() {
  return !state.dirty || confirm("Saqlanmagan o'zgarishlar bor. Davom etasizmi?");
}

async function openPost(p) {
  if (!confirmDiscard()) return;
  const data = await api(`/api/post?file=${encodeURIComponent(p.file)}&draft=${p.draft ? 1 : 0}`);

  state.current = { file: data.file, draft: data.draft };
  state.extra = data.extra || [];
  state.categories = [].concat(data.data.categories || []);
  state.tags = [].concat(data.data.tags || []);

  // Keep front-matter keys the form doesn't render so saving can't drop them.
  state.extraData = {};
  const handled = ["title", "date", "categories", "tags", "excerpt", "mathjax", "header"];
  Object.keys(data.data).forEach((k) => {
    if (!handled.includes(k)) state.extraData[k] = data.data[k];
  });

  el.title.value = data.data.title || "";
  el.date.value = /^\d{4}-\d{2}-\d{2}/.test(String(data.data.date || ""))
    ? String(data.data.date).slice(0, 10) : "";
  el.excerpt.value = data.data.excerpt || "";
  el.teaser.value = (data.data.header && data.data.header.teaser) || "";
  el.mathjax.checked = !!data.data.mathjax;
  el.body.value = data.body || "";

  const base = data.file.replace(/\.(md|markdown)$/i, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
  el.slug.value = base;
  state.slugTouched = true;

  renderCats();
  renderTags();
  updatePreview();
  state.dirty = false;
  renderPostList();
}

function newPost() {
  if (!confirmDiscard()) return;
  state.current = null;
  state.categories = [];
  state.tags = [];
  state.extra = [];
  state.extraData = {};
  state.slugTouched = false;

  el.title.value = "";
  el.slug.value = "";
  el.date.value = new Date().toISOString().slice(0, 10);
  el.excerpt.value = "";
  el.teaser.value = "";
  el.mathjax.checked = false;
  el.body.value = "";

  renderCats();
  renderTags();
  updatePreview();
  state.dirty = false;
  renderPostList();
  el.title.focus();
}

async function savePost(asDraft) {
  if (!el.title.value.trim()) {
    toast("Sarlavha kiriting", "error");
    el.title.focus();
    return null;
  }

  // An existing post keeps its draft/published status unless explicitly moved.
  const draft = typeof asDraft === "boolean" ? asDraft : (state.current ? state.current.draft : true);

  const payload = {
    title: el.title.value.trim(),
    slug: el.slug.value.trim() || slugify(el.title.value),
    date: el.date.value || undefined,
    categories: state.categories,
    tags: state.tags,
    excerpt: el.excerpt.value.trim(),
    teaser: el.teaser.value.trim(),
    mathjax: el.mathjax.checked,
    body: el.body.value,
    draft: draft,
    extra: state.extra,
    extraData: state.extraData,
    originalFile: state.current ? state.current.file : undefined,
    originalDraft: state.current ? state.current.draft : undefined,
  };

  try {
    const res = await api("/api/post", { method: "POST", body: JSON.stringify(payload) });
    state.current = { file: res.file, draft: res.draft };
    state.dirty = false;
    await refreshPosts();
    await refreshGit();
    toast(`Saqlandi: ${res.path}`, "success");
    return res;
  } catch (e) {
    toast(e.message, "error");
    return null;
  }
}

/* ─────────────────────────── preview ─────────────────────────── */

let previewTimer;
function updatePreview() {
  const words = el.body.value.split(/\s+/).filter(Boolean).length;
  el.counter.textContent = `${words} so'z · ~${Math.max(1, Math.round(words / 200))} daqiqa`;

  clearTimeout(previewTimer);
  previewTimer = setTimeout(() => {
    const md = el.body.value;
    el.preview.innerHTML = md.trim()
      ? window.MD.render(md)
      : '<p class="preview__empty">Ko\'rish uchun matn yozing…</p>';
  }, 120);
}

/* ─────────────────────────── markdown toolbar ─────────────────────────── */

function surround(before, after, placeholder) {
  const ta = el.body;
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  const selected = ta.value.slice(start, end) || placeholder || "";
  const text = before + selected + after;
  ta.setRangeText(text, start, end, "end");
  if (!ta.value.slice(start, start + text.length).includes(selected) || !selected) {
    ta.selectionStart = start + before.length;
    ta.selectionEnd = start + before.length + selected.length;
  }
  ta.focus();
  markDirty();
  updatePreview();
}

function prefixLines(prefix) {
  const ta = el.body;
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  const lineStart = ta.value.lastIndexOf("\n", start - 1) + 1;
  const block = ta.value.slice(lineStart, end);
  const numbered = prefix === "1. ";
  const out = block
    .split("\n")
    .map((line, i) => (numbered ? `${i + 1}. ` : prefix) + line)
    .join("\n");
  ta.setRangeText(out, lineStart, end, "end");
  ta.focus();
  markDirty();
  updatePreview();
}

const MD_ACTIONS = {
  bold: () => surround("**", "**", "qalin matn"),
  italic: () => surround("*", "*", "kursiv"),
  h2: () => prefixLines("## "),
  h3: () => prefixLines("### "),
  quote: () => prefixLines("> "),
  ul: () => prefixLines("- "),
  ol: () => prefixLines("1. "),
  code: () => surround("\n```python\n", "\n```\n", "# kod"),
  link: () => {
    const url = prompt("Havola manzili (URL):", "https://");
    if (url) surround("[", `](${url})`, "matn");
  },
  table: () =>
    surround(
      "\n| Ustun 1 | Ustun 2 |\n|---|---|\n| qiymat | qiymat |\n",
      "",
      ""
    ),
};

document.querySelectorAll("#toolbar [data-md]").forEach((btn) => {
  btn.onclick = () => MD_ACTIONS[btn.dataset.md] && MD_ACTIONS[btn.dataset.md]();
});

/* ─────────────────────────── images ─────────────────────────── */

async function uploadFiles(files) {
  const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
  if (!list.length) return;

  for (const file of list) {
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      toast(`Yuklanmoqda: ${file.name}…`);
      const res = await api("/api/upload", {
        method: "POST",
        body: JSON.stringify({ filename: file.name, data: dataUrl }),
      });

      const alt = file.name.replace(/\.[^.]+$/, "");
      const snippet = `\n![${alt}](${res.url})\n`;
      const ta = el.body;
      ta.setRangeText(snippet, ta.selectionStart, ta.selectionEnd, "end");
      markDirty();
      updatePreview();
      toast(`Yuklandi: ${res.url}`, "success");
      await refreshGit();
    } catch (e) {
      toast(`Yuklashda xato: ${e.message}`, "error");
    }
  }
}

$("#imageBtn").onclick = () => el.imageInput.click();
el.imageInput.onchange = () => {
  uploadFiles(el.imageInput.files);
  el.imageInput.value = "";
};

const writePane = document.querySelector(".pane--write");
let dragDepth = 0;

writePane.addEventListener("dragenter", (e) => {
  e.preventDefault();
  dragDepth++;
  writePane.classList.add("is-dragging");
});
writePane.addEventListener("dragover", (e) => e.preventDefault());
writePane.addEventListener("dragleave", () => {
  // dragleave fires for child elements too; only clear when we've truly left.
  if (--dragDepth <= 0) {
    dragDepth = 0;
    writePane.classList.remove("is-dragging");
  }
});
writePane.addEventListener("drop", (e) => {
  e.preventDefault();
  dragDepth = 0;
  writePane.classList.remove("is-dragging");
  if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
});

// Pasting a screenshot straight into the editor.
el.body.addEventListener("paste", (e) => {
  const files = Array.from(e.clipboardData.files || []);
  if (files.some((f) => f.type.startsWith("image/"))) {
    e.preventDefault();
    uploadFiles(files);
  }
});

/* ─────────────────────────── git / publish ─────────────────────────── */

async function refreshGit() {
  try {
    const data = await api("/api/git/status");
    el.branchChip.textContent = data.branch;
    const n = data.files.length;
    el.changesChip.textContent = n ? `${n} ta o'zgarish` : "o'zgarishlar yo'q";
    el.changesChip.className = "chip " + (n ? "chip--dirty" : "chip--muted");
    return data;
  } catch (e) {
    el.branchChip.textContent = "git yo'q";
    return { files: [] };
  }
}

async function openPublish() {
  // Publishing always promotes the post out of _drafts/ first. Committing a
  // draft would push a file Jekyll never builds, so the post would silently
  // never appear on the site.
  if (state.dirty || !state.current || state.current.draft) {
    const saved = await savePost(false);
    if (!saved) return;
  }

  const data = await refreshGit();
  el.publishFiles.innerHTML = "";
  if (!data.files.length) {
    const li = document.createElement("li");
    li.textContent = "Commit qilinadigan o'zgarish yo'q.";
    el.publishFiles.appendChild(li);
  } else {
    data.files.forEach((f) => {
      const li = document.createElement("li");
      const st = document.createElement("span");
      st.className = "st";
      st.textContent = f.status || "M";
      const name = document.createElement("span");
      name.textContent = f.file;
      li.append(st, name);
      el.publishFiles.appendChild(li);
    });
  }

  el.commitMessage.value = el.title.value.trim()
    ? `New post: ${el.title.value.trim()}`
    : "Update posts";
  el.publishModal.hidden = false;
  el.commitMessage.focus();
}

$("#publishCancel").onclick = () => { el.publishModal.hidden = true; };
el.publishModal.onclick = (e) => { if (e.target === el.publishModal) el.publishModal.hidden = true; };

$("#publishConfirm").onclick = async () => {
  const btn = $("#publishConfirm");
  btn.disabled = true;
  btn.textContent = "Yuborilmoqda…";
  try {
    const res = await api("/api/git/publish", {
      method: "POST",
      body: JSON.stringify({
        message: el.commitMessage.value,
        push: el.pushCheck.checked,
      }),
    });
    el.publishModal.hidden = true;
    if (res.nothing) toast("Commit qilinadigan o'zgarish yo'q");
    else if (res.pushed) toast("Push qilindi — sayt qayta quriladi", "success");
    else toast("Commit qilindi (push qilinmadi)", "success");
    await refreshGit();
  } catch (e) {
    toast(e.message, "error");
  } finally {
    btn.disabled = false;
    btn.textContent = "Commit & push";
  }
};

/* ─────────────────────────── wiring ─────────────────────────── */

el.body.addEventListener("input", () => { markDirty(); updatePreview(); });

[el.title, el.excerpt, el.teaser, el.date].forEach((input) =>
  input.addEventListener("input", markDirty)
);
el.mathjax.addEventListener("change", markDirty);

// Auto-derive the slug from the title until the author edits it themselves.
el.title.addEventListener("input", () => {
  if (!state.slugTouched) el.slug.value = slugify(el.title.value);
});
el.slug.addEventListener("input", () => { state.slugTouched = true; markDirty(); });

el.filter.addEventListener("input", renderPostList);

document.querySelectorAll(".sidebar__tabs .tab").forEach((tab) => {
  tab.onclick = () => {
    document.querySelectorAll(".sidebar__tabs .tab").forEach((t) => t.classList.remove("is-active"));
    tab.classList.add("is-active");
    state.filter = tab.dataset.filter;
    renderPostList();
  };
});

document.querySelectorAll(".viewswitch button").forEach((btn) => {
  btn.onclick = () => {
    document.querySelectorAll(".viewswitch button").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    el.panes.dataset.view = btn.dataset.view;
  };
});

$("#metaToggle").onclick = () => {
  el.meta.classList.toggle("is-collapsed");
  $("#metaToggle").textContent = el.meta.classList.contains("is-collapsed")
    ? "Ma'lumotlarni ko'rsatish ▼"
    : "Ma'lumotlarni yashirish ▲";
};

$("#newBtn").onclick = newPost;
$("#saveBtn").onclick = () => savePost();
$("#publishBtn").onclick = openPublish;

$("#themeBtn").onclick = () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem("admin-theme", next); } catch (e) {}
};

document.addEventListener("keydown", (e) => {
  const mod = e.metaKey || e.ctrlKey;
  if (!mod) {
    if (e.key === "Escape" && !el.publishModal.hidden) el.publishModal.hidden = true;
    return;
  }
  if (e.key === "s") { e.preventDefault(); savePost(); }
  else if (e.key === "b" && document.activeElement === el.body) { e.preventDefault(); MD_ACTIONS.bold(); }
  else if (e.key === "i" && document.activeElement === el.body) { e.preventDefault(); MD_ACTIONS.italic(); }
  else if (e.key === "k" && document.activeElement === el.body) { e.preventDefault(); MD_ACTIONS.link(); }
});

window.addEventListener("beforeunload", (e) => {
  if (state.dirty) { e.preventDefault(); e.returnValue = ""; }
});

/* ─────────────────────────── boot ─────────────────────────── */

(async function init() {
  try {
    const saved = localStorage.getItem("admin-theme");
    if (saved) document.documentElement.dataset.theme = saved;
  } catch (e) {}

  newPost();
  try {
    await refreshPosts();
  } catch (e) {
    toast(`Postlarni yuklab bo'lmadi: ${e.message}`, "error");
  }
  await refreshGit();
  setInterval(refreshGit, 15000);
})();
