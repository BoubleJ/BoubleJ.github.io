// scripts/check-slugs.mjs — 골든 마스터의 포스트 URL 집합과 slug 규칙 산출값 비교
import fs from "node:fs";

const dirs = fs.readdirSync("src/content/posts", { withFileTypes: true })
  .filter((e) => e.isDirectory() && fs.existsSync(`src/content/posts/${e.name}/index.mdx`));
const computed = dirs
  .map((e) => "/" + e.name.trim().replace(/\s+/g, "-") + "/")
  .sort();

const reserved = new Set(["/", "/post/", "/tag/", "/404/"]);
const golden = fs.readdirSync(".golden", { withFileTypes: true })
  .filter((e) => e.isDirectory() && fs.existsSync(`.golden/${e.name}/index.html`))
  .map((e) => `/${e.name}/`)
  .filter((u) => !reserved.has(u) && !u.startsWith("/page-data") && !u.startsWith("/~partytown") && !u.startsWith("/dev-404") && !u.startsWith("/offline-plugin"))
  .sort();

const miss = golden.filter((u) => !computed.includes(u));
const extra = computed.filter((u) => !golden.includes(u));
console.log(miss.length || extra.length ? { miss, extra } : `일치: 포스트 ${computed.length}개`);
process.exit(miss.length || extra.length ? 1 : 0);
