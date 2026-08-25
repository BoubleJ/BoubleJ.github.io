// scripts/compare-golden.mjs
// 사용법: node scripts/compare-golden.mjs <새 빌드 디렉토리, 예: dist>
import fs from "node:fs";
import path from "node:path";

const GOLDEN = ".golden";
const DIST = process.argv[2] ?? "dist";
// v2 의도된 제거: /post/는 리다이렉트 없이 완전 삭제됨 → 골든 URL 집합에서 제외하고 비교
const INTENTIONALLY_REMOVED = new Set(["/post/"]);
let failed = false;

const htmlPages = (root) => {
  const out = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === "index.html") out.push("/" + path.relative(root, dir).split(path.sep).join("/"));
    }
  };
  walk(root);
  return out.map((u) => (u === "/." ? "/" : u + "/")).sort();
};

const report = (label, missing, extra) => {
  if (missing.length || extra.length) {
    failed = true;
    console.log(`✗ ${label}`);
    missing.forEach((m) => console.log(`  골든에만 있음: ${m}`));
    extra.forEach((m) => console.log(`  새 빌드에만 있음: ${m}`));
  } else console.log(`✓ ${label}`);
};

const diffSets = (label, a, b) => {
  const A = new Set(a), B = new Set(b);
  report(label, [...A].filter((x) => !B.has(x)), [...B].filter((x) => !A.has(x)));
};

const isRealPage = (u) => !u.startsWith("/page-data") && !u.startsWith("/~partytown") && !u.startsWith("/dev-404") && !u.startsWith("/offline-plugin");
const goldenUrls = htmlPages(GOLDEN).filter(isRealPage).filter((u) => !INTENTIONALLY_REMOVED.has(u));
const distUrls = htmlPages(DIST).filter(isRealPage).filter((u) => !INTENTIONALLY_REMOVED.has(u));
diffSets("페이지 URL 집합", goldenUrls, distUrls); // /post/는 의도적 제거라 골든 쪽에서 걸러냄

const extract = (html) => ({
  headingIds: [...html.matchAll(/<h[123][^>]*\sid="([^"]+)"/g)].map((m) => m[1]),
  tocHrefs: [...(html.match(/aria-label="목차"[\s\S]*?<\/nav>/)?.[0] ?? "").matchAll(/href="(#[^"]+)"/g)].map((m) => m[1]),
  title: html.match(/<title[^>]*>([^<]*)<\/title>/)?.[1] ?? "(없음)",
  canonical: html.match(/rel="canonical"\s+href="([^"]+)"/)?.[1] ?? html.match(/href="([^"]+)"\s+rel="canonical"/)?.[1] ?? "(없음)",
  description: html.match(/name="description"\s+content="([^"]*)"/)?.[1] ?? "(없음)",
});

for (const url of goldenUrls) {
  if (!distUrls.includes(url)) continue;
  const g = extract(fs.readFileSync(path.join(GOLDEN, url, "index.html"), "utf8"));
  const d = extract(fs.readFileSync(path.join(DIST, url, "index.html"), "utf8"));
  diffSets(`${url} heading id`, g.headingIds, d.headingIds);
  diffSets(`${url} TOC href`, g.tocHrefs, d.tocHrefs);
  // v2-10: 사이트 공통 description은 의도적으로 변경됨 — 목록/태그 페이지는 description 비교 제외
  const DESCRIPTION_CHANGED = new Set(["/", "/tag/"]);
  for (const k of ["title", "canonical", "description"]) {
    if (k === "description" && DESCRIPTION_CHANGED.has(url)) continue;
    if (g[k] !== d[k]) { failed = true; console.log(`✗ ${url} ${k}: 골든='${g[k]}' vs 새 빌드='${d[k]}'`); }
  }
}

console.log(failed ? "\n차이 발견" : "\n모두 일치");
process.exit(failed ? 1 : 0);
