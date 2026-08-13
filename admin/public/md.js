"use strict";

/*
 * Small markdown renderer used only for the editor's live preview.
 *
 * It intentionally covers the subset this blog actually writes: ATX headings,
 * fenced code, tables, lists, blockquotes, images, links and inline emphasis.
 * The published site is still rendered by Jekyll/kramdown — this only has to
 * be close enough to write against.
 */
window.MD = (function () {
  // A character that cannot appear in the source text, used to park code
  // spans while the other inline rules run.
  var SENTINEL = "\u0000";

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function inline(s) {
    let t = esc(s);

    // Code spans first, so their contents escape the other rules.
    const spans = [];
    t = t.replace(/`([^`]+)`/g, (_, code) => {
      spans.push(code);
      return SENTINEL + (spans.length - 1) + SENTINEL;
    });

    t = t.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,
      (_, alt, src) => `<img src="${src}" alt="${alt}" loading="lazy">`);
    t = t.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,
      (_, text, href) => `<a href="${href}" target="_blank" rel="noopener">${text}</a>`);

    t = t.replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>");
    t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    t = t.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
    t = t.replace(/__([^_]+)__/g, "<strong>$1</strong>");
    t = t.replace(/~~([^~]+)~~/g, "<del>$1</del>");

    // Bare URLs that weren't already linked.
    t = t.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g,
      (m, pre, url) => `${pre}<a href="${url}" target="_blank" rel="noopener">${url}</a>`);

    t = t.replace(new RegExp(SENTINEL + "(\\d+)" + SENTINEL, "g"), (_, i) => `<code>${spans[Number(i)]}</code>`);
    return t;
  }

  function splitRow(row) {
    return row.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
  }

  function render(src) {
    const lines = String(src || "").replace(/\r\n/g, "\n").split("\n");
    const out = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Fenced code
      const fence = line.match(/^\s*(```+|~~~+)\s*([\w+-]*)\s*$/);
      if (fence) {
        const marker = fence[1][0];
        const lang = fence[2];
        const buf = [];
        i++;
        while (i < lines.length && !new RegExp(`^\\s*${marker}{3,}\\s*$`).test(lines[i])) {
          buf.push(lines[i++]);
        }
        i++; // closing fence
        out.push(
          `<pre class="md-code"${lang ? ` data-lang="${esc(lang)}"` : ""}><code>${esc(buf.join("\n"))}</code></pre>`
        );
        continue;
      }

      // Heading
      const h = line.match(/^(#{1,6})\s+(.*)$/);
      if (h) {
        const level = h[1].length;
        out.push(`<h${level}>${inline(h[2].replace(/\s+#+\s*$/, ""))}</h${level}>`);
        i++;
        continue;
      }

      // Horizontal rule
      if (/^\s*([-*_])\s*(\1\s*){2,}$/.test(line)) {
        out.push("<hr>");
        i++;
        continue;
      }

      // Table: header row followed by a separator row
      if (/\|/.test(line) && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(lines[i + 1])) {
        const head = splitRow(line);
        i += 2;
        const rows = [];
        while (i < lines.length && /\|/.test(lines[i]) && lines[i].trim()) {
          rows.push(splitRow(lines[i++]));
        }
        out.push(
          `<div class="md-table-wrap"><table><thead><tr>${head
            .map((c) => `<th>${inline(c)}</th>`)
            .join("")}</tr></thead><tbody>${rows
            .map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`)
            .join("")}</tbody></table></div>`
        );
        continue;
      }

      // Blockquote
      if (/^\s*>/.test(line)) {
        const buf = [];
        while (i < lines.length && /^\s*>/.test(lines[i])) {
          buf.push(lines[i++].replace(/^\s*>\s?/, ""));
        }
        out.push(`<blockquote>${render(buf.join("\n"))}</blockquote>`);
        continue;
      }

      // Lists (one level of nesting)
      if (/^\s*([-*+]|\d+\.)\s+/.test(line)) {
        const ordered = /^\s*\d+\./.test(line);
        const tag = ordered ? "ol" : "ul";
        const items = [];
        while (i < lines.length && /^\s*([-*+]|\d+\.)\s+/.test(lines[i])) {
          const indent = lines[i].match(/^\s*/)[0].length;
          let text = lines[i].replace(/^\s*([-*+]|\d+\.)\s+/, "");
          i++;
          // Continuation lines belonging to this item.
          const sub = [];
          while (i < lines.length && lines[i].trim() && !/^\s*([-*+]|\d+\.)\s+/.test(lines[i])) {
            sub.push(lines[i++].trim());
          }
          // Nested list under this item.
          const nested = [];
          while (i < lines.length && /^\s+([-*+]|\d+\.)\s+/.test(lines[i]) &&
                 lines[i].match(/^\s*/)[0].length > indent) {
            nested.push(lines[i++].replace(/^\s{2}/, ""));
          }
          if (sub.length) text += " " + sub.join(" ");
          items.push(`<li>${inline(text)}${nested.length ? render(nested.join("\n")) : ""}</li>`);
        }
        out.push(`<${tag}>${items.join("")}</${tag}>`);
        continue;
      }

      // Blank line
      if (!line.trim()) {
        i++;
        continue;
      }

      // Raw block-level HTML passes through untouched.
      if (/^\s*<(\/?)(div|p|img|figure|iframe|table|details|summary|br|hr|span|a|video)\b/i.test(line)) {
        out.push(line);
        i++;
        continue;
      }

      // Paragraph
      const buf = [];
      while (
        i < lines.length &&
        lines[i].trim() &&
        !/^\s*(#{1,6}\s|>|```|~~~|([-*+]|\d+\.)\s)/.test(lines[i])
      ) {
        buf.push(lines[i++]);
      }
      out.push(`<p>${inline(buf.join("\n"))}</p>`);
    }

    return out.join("\n");
  }

  return { render: render, escape: esc };
})();
