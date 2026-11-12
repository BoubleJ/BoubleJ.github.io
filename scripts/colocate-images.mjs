import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const POSTS = "src/content";
const IMG = "public/image";
const usage = new Map();

const decode = (s) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};
for (const dir of fs.readdirSync(POSTS)) {
  const mdx = path.join(POSTS, dir, "index.mdx");
  if (!fs.existsSync(mdx)) continue;
  const body = fs.readFileSync(mdx, "utf8");
  for (const m of body.matchAll(/\/image\/([^)"\s]+)/g)) {
    const name = decode(m[1]);
    if (!usage.has(name)) usage.set(name, new Set());
    usage.get(name).add(dir);
  }
}

const shared = [],
  moved = [],
  gifs = [];
for (const [name, posts] of usage) {
  const src = path.join(IMG, name);
  if (!fs.existsSync(src)) {
    console.log(`⚠ 참조되지만 파일 없음: ${name}`);
    continue;
  }
  if (name.toLowerCase().endsWith(".gif")) {
    gifs.push(name);
    continue;
  }
  if (posts.size > 1) {
    shared.push(name);
    continue;
  }
  const dir = [...posts][0];
  execFileSync("git", ["mv", src, path.join(POSTS, dir, name)]);
  const mdx = path.join(POSTS, dir, "index.mdx");
  let body = fs.readFileSync(mdx, "utf8");
  for (const ref of [`/image/${name}`, `/image/${encodeURIComponent(name)}`])
    body = body.replaceAll(`](${ref})`, `](<./${name}>)`);
  fs.writeFileSync(mdx, body);
  moved.push(name);
}

const all = fs.existsSync(IMG) ? fs.readdirSync(IMG) : [];
const frontmatterUsed = new Set();
const orphans = all.filter((f) => !usage.has(f) && !frontmatterUsed.has(f));
console.log(
  `이동 ${moved.length} / 공유 유지 ${shared.length} / gif 유지 ${gifs.length}`,
);
console.log("공유:", shared);
console.log("gif:", gifs);
console.log(`고아 후보 ${orphans.length}개 (삭제 전 확인 필요):`, orphans);
