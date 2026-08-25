// scripts/colocate-images.mjs
// 1) 각 포스트 본문의 /image/... 참조를 수집(URL 인코딩 디코드 포함)
// 2) 정확히 1개 포스트만 쓰는 이미지(.gif 제외) → 그 포스트 폴더로 git mv + 본문 참조를 ![...](<./파일명>)로 치환
// 3) 2개 이상 포스트가 공유하거나 .gif인 이미지 → public/image에 두고 참조 유지 (목록 출력)
// 4) 어떤 포스트/thumbnail frontmatter에서도 참조 안 되는 고아 파일 → 삭제하지 말고 목록만 출력
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const POSTS = "src/content/posts";
const IMG = "public/image";
const usage = new Map(); // 이미지 파일명 → Set<포스트 폴더>

const decode = (s) => { try { return decodeURIComponent(s); } catch { return s; } };
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

const shared = [], moved = [], gifs = [];
for (const [name, posts] of usage) {
  const src = path.join(IMG, name);
  if (!fs.existsSync(src)) { console.log(`⚠ 참조되지만 파일 없음: ${name}`); continue; }
  if (name.toLowerCase().endsWith(".gif")) { gifs.push(name); continue; }   // 애니메이션 보존 위해 public 유지
  if (posts.size > 1) { shared.push(name); continue; }                       // 공유 이미지는 public 유지
  const dir = [...posts][0];
  execFileSync("git", ["mv", src, path.join(POSTS, dir, name)]);
  const mdx = path.join(POSTS, dir, "index.mdx");
  let body = fs.readFileSync(mdx, "utf8");
  // 원문은 인코딩/비인코딩 두 형태가 있을 수 있어 둘 다 치환. 공백·한글 파일명 → <> 감싼 상대경로
  for (const ref of [`/image/${name}`, `/image/${encodeURIComponent(name)}`])
    body = body.replaceAll(`](${ref})`, `](<./${name}>)`);
  fs.writeFileSync(mdx, body);
  moved.push(name);
}

const all = fs.existsSync(IMG) ? fs.readdirSync(IMG) : [];
const frontmatterUsed = new Set(); // thumbnail은 public/thumbnail이라 여기 해당 없음 — image 폴더 기준 고아만
const orphans = all.filter((f) => !usage.has(f) && !frontmatterUsed.has(f));
console.log(`이동 ${moved.length} / 공유 유지 ${shared.length} / gif 유지 ${gifs.length}`);
console.log("공유:", shared); console.log("gif:", gifs);
console.log(`고아 후보 ${orphans.length}개 (삭제 전 확인 필요):`, orphans);
