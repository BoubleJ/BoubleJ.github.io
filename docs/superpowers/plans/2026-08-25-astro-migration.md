# Gatsby → Astro 마이그레이션 구현 계획 (v2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** boublej.github.io 블로그를 Gatsby 5에서 Astro 5로 마이그레이션한다 — 디자인·기능·포스트 URL은 유지하되, 스펙 v2 섹션의 의도된 변경 16건(스펙 v2 섹션 참조: /post 제거, 헤더 애니메이션 수정, MDX 전환, utterances 제약 해제, React 19, 검색 UX 개편, 이미지 코로케이션, 페이지네이션, TOC 스크롤 스파이, SEO 스니펫 개선, 부드러운 스크롤, 파비콘, 시각 디테일 3건, 목록 개수 표시, 읽기 진행률 바, 구조 개선 A/B)을 반영한다.

**Architecture:** Astro 정적 빌드(MPA)를 뼈대로, 기존 vanilla-extract 스타일 파일(.css.ts)과 React 컴포넌트를 최대한 그대로 재사용한다. 콘텐츠는 `src/content/posts/*.mdx`(Content Collections + @astrojs/mdx)로 옮기고 서버에서 `<Content />`로 렌더링한다. 인터랙티브 부분(헤더/검색, 목록 필터/페이지네이션, 태그, TOC, PostHead)만 React 아일랜드로 하이드레이션하고, 코드 복사 버튼은 바닐라 스크립트로 재작성한다. 마이그레이션 전 Gatsby 빌드 산출물을 골든 마스터로 보존하고, 각 단계마다 비교 스크립트로 URL/heading id/TOC/메타태그를 기계 검증한다.

**Tech Stack:**

| 영역 | 기존 (Gatsby) | 신규 (Astro) |
|---|---|---|
| 프레임워크 | gatsby ^5.15 | **astro ^5** (정적 출력, MPA) |
| UI 컴포넌트 | React 18 (전체 SSR+하이드레이션) | **React ^19** + `@astrojs/react` 최신 (아일랜드만 하이드레이션) |
| 스타일 | @vanilla-extract/css + webpack-plugin | **@vanilla-extract/css 유지** + `@vanilla-extract/vite-plugin` |
| 콘텐츠 | static/contents/*.md + GraphQL | **src/content/posts/{포스트}/index.mdx** (이미지 코로케이션) + `@astrojs/mdx` + Content Collections(glob 로더, zod) |
| 본문 이미지 | static/image 절대경로, 최적화 무동작 | **포스트 폴더 동봉 + astro:assets 자동 최적화** (공유·gif·썸네일은 public/ 유지) → 차후 Cloudflare R2 이전(부록 A) |
| 검색 | 제출형(제목+요약, 페이지 이동 후 필터) | **라이브 드롭다운**(올리브영 스타일) + 범위 셀렉트(전체/제목/본문) + 빌드 타임 전문 인덱스(`/search-index.json` lazy fetch) + `<mark>` 하이라이트 (스펙 v2-6) |
| 목록 로딩 | 무한 스크롤(IntersectionObserver, 10개 단위) | **번호형 페이지네이션** (10개/페이지, `?page=N` URL 동기화 — 스펙 v2-8) |
| 코드 하이라이트 | gatsby-remark-prismjs + prism-ghcolors | **Astro 내장 Prism**(`syntaxHighlight: 'prism'`) + prism-ghcolors 유지 |
| 마크다운 플러그인 | gatsby-remark-* 체인 | remark-smartypants, rehype-external-links, `@astrojs/markdown-remark`의 rehypeHeadingIds, **커스텀 rehype 2개**(markdown-* 클래스, autolink 헤딩) — MDX에도 동일 적용(extendMarkdownConfig) |
| 읽기 시간 | reading-time (gatsby-node) | **reading-time 유지** (파일 원문 전체 입력) |
| 쿼리 파싱 | query-string | **URLSearchParams 표준으로 통일** (query-string 제거 — v2-16 B1) |
| SEO | react-helmet + 플러그인 3종 | Layout.astro `<head>` 직접 작성 + `@astrojs/sitemap` + 정적 robots.txt |
| 댓글 | utterances (React useEffect) | **utterances 유지** (정적 script — 기존 댓글 보존 제약은 없음, 스펙 v2-4) |
| 린트/포맷/훅 | Biome + lefthook | **유지** |
| 배포 | GitHub Actions → Pages (public/) | **동일 워크플로**, 산출물 경로 dist/, Node 22 |
| 제거 | gatsby* 전체, react-helmet, @mdx-js/react(Gatsby용), ajv, @vanilla-extract/webpack-plugin | — |

**Spec:** `docs/superpowers/plans/2026-08-25-astro-migration-spec.md` (기능 전수 조사 + v2 의도된 변경 16건 — 모든 태스크는 이 스펙을 근거로 한다)

## Global Constraints

- **포스트 URL 보존(SEO)**: trailing slash always, slug = 파일명 `trim()` 후 `/\s+/g → "-"`, 특수문자·대소문자 유지 (스펙 §1). utterances 댓글 제약은 해제됨(실 댓글 0개 확인).
- **v2 의도된 변경 16건 외에는 기존과 동일해야 한다.** 그 외 동작 변경 발견 시 작업 중단 후 사용자 확인. 신규 UI(검색 드롭다운·범위 셀렉트·페이지네이션)는 기존 테마 토큰(vars.color.*)만 사용해 사이트 톤을 유지한다.
- 웹폰트·RSS 추가 금지. font-family 미선언 유지 (스펙 §4, §6). 파비콘은 v2-12로 추가.
- google-site-verification 메타 `32VgiXrbX9YRCfnd2p5rqMCm5eNlviCqwzzD5oUo1jw` 유지.
- 죽은 코드는 이관하지 않는다: ProfileImage, allMdx 쿼리(Gatsby용), 404 죽은 쿼리 (스펙 §7).
- MDX 변환 시 **렌더 결과가 달라지는 내용 수정 금지** — 구문 오류 수정은 이스케이프/치환만, 문구 변경 불가.
- Node 22 기준. 모든 커밋은 저장소 관례(`feat : ...`) 형식.

---

### Task 1: 골든 마스터 캡처 + 비교 스크립트

Gatsby의 현재 빌드 산출물을 기준점으로 보존하고, 이후 태스크들이 사용할 자동 비교 스크립트를 만든다.

**Files:**
- Create: `.golden/` (gitignore 대상, Gatsby public/ 복사본)
- Create: `scripts/compare-golden.mjs`
- Modify: `.gitignore` (`.golden/` 추가; 없으면 생성)

**Interfaces:**
- Produces: `node scripts/compare-golden.mjs <dist경로>` — 골든과 신규 빌드를 비교: (1) 페이지 URL 집합(**`/post/`는 의도적 제거로 예외 처리**), (2) 포스트별 h1~h3 id 집합, (3) TOC 링크 href 집합, (4) 페이지별 `<title>`/canonical/description. 차이 없으면 exit 0.

- [ ] **Step 1: Gatsby 프로덕션 빌드 실행 및 보존**

```bash
npx gatsby build
mkdir -p .golden && cp -R public/ .golden/
echo ".golden/" >> .gitignore
```

(`.golden` 바로 아래에 index.html이 오도록 복사 결과를 확인한다 — `cp -R public/ .golden/`은 macOS에서 내용물을 복사한다.)

- [ ] **Step 2: 비교 스크립트 작성**

```js
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
const distUrls = htmlPages(DIST).filter(isRealPage);
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
```

- [ ] **Step 3: 자기 검증 — 골든끼리 비교 시 통과 확인**

Run: `node scripts/compare-golden.mjs .golden`
Expected: `모두 일치` / exit 0

- [ ] **Step 4: Commit**

```bash
git checkout -b feature/astro-migration
git add scripts/compare-golden.mjs .gitignore
git commit -m "chore : Astro 마이그레이션용 골든 마스터 비교 스크립트 추가"
```

---

### Task 2: Astro 스캐폴드 + React 19 + static→public 전환

**Files:**
- Create: `astro.config.mjs`, `src/consts.ts`
- Modify: `package.json`(추가/업그레이드만 — 제거는 Task 13), `tsconfig.json`
- Rename: `static/` → `public/` (Gatsby의 static ≡ Astro의 public — 루트 서빙 의미 동일)
- Delete: 기존 `public/` (Gatsby 빌드 산출물 — .golden에 보존됨)

**Interfaces:**
- Produces: `npx astro build`가 `dist/`를 생성하는 빈 껍데기. `SITE` 상수 — `{ title: "BoubleJ's Blog", description: "개발하며 궁금한 점을 정리하는 블로그", siteUrl: "https://boublej.github.io/", author: "BoubleJ" }`.

- [ ] **Step 1: 의존성 설치 (React 19 업그레이드 포함)**

```bash
rm -rf public   # Gatsby 빌드 산출물 (골든에 보존됨)
git mv static public
npm i astro @astrojs/react @astrojs/mdx @astrojs/sitemap @astrojs/markdown-remark \
  react@^19 react-dom@^19 remark-smartypants rehype-external-links \
  unist-util-visit hast-util-from-html hast-util-to-string
npm i -D @vanilla-extract/vite-plugin @types/react@^19 @types/react-dom@^19 @astrojs/check
```

- [ ] **Step 2: astro.config.mjs 작성**

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import remarkSmartypants from "remark-smartypants";
import rehypeExternalLinks from "rehype-external-links";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
// Task 5 완료 전까지 아래 1줄은 주석 처리
import { rehypeAutolinkHeaders } from "./src/lib/rehype-autolink-headers.mjs";

export default defineConfig({
  site: "https://boublej.github.io",
  trailingSlash: "always",          // Gatsby 5 기본값과 동일
  build: { format: "directory" },   // /slug/index.html — 기존 URL 보존
  integrations: [react(), mdx(), sitemap()], // mdx는 아래 markdown 설정을 상속(extendMarkdownConfig 기본 true)
  vite: { plugins: [vanillaExtractPlugin()] },
  markdown: {
    syntaxHighlight: "prism",       // Shiki 대신 Prism — 기존 클래스 체계/테마 CSS 유지
    smartypants: false,             // 기본 옵션 대신 oldschool 대시 옵션으로 직접 지정
    remarkPlugins: [[remarkSmartypants, { dashes: "oldschool" }]],
    rehypePlugins: [
      rehypeHeadingIds,             // 커스텀 플러그인보다 먼저 id 주입 (Astro 문서 권장 방식)
      rehypeAutolinkHeaders,        // Task 5에서 작성
      [rehypeExternalLinks, { target: "_blank", rel: ["nofollow", "noopener"] }], // v2-16 B2
    ],
  },
});
```

- [ ] **Step 3: tsconfig.json을 Astro 기준으로 수정**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] },
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  },
  "include": ["src/**/*", "astro.config.mjs"],
  "exclude": ["dist", "node_modules", ".golden"]
}
```

- [ ] **Step 4: src/consts.ts 작성**

```ts
// src/consts.ts — gatsby-config.js의 siteMetadata 대체
export const SITE = {
  title: "BoubleJ's Blog",
  // v2-10: 구글이 스니펫으로 채택하도록 구체화된 문구 — 실행 전 사용자 확정 필요 (스펙 v2-10 초안)
  description:
    "React, Next.js, TypeScript 등 프론트엔드 개발을 하며 마주친 문제와 해결 과정, 궁금했던 점을 깊이 있게 정리하는 BoubleJ의 기술 블로그입니다.",
  siteUrl: "https://boublej.github.io/",
  author: "BoubleJ",
} as const;
```

- [ ] **Step 5: 임시 index로 빌드 확인 후 Commit**

`src/pages/index.astro`에 `<h1>wip</h1>` 한 줄. Run: `npx astro build` → dist/index.html 생성 확인.

```bash
git add -A
git commit -m "feat : Astro 5 스캐폴드 (React 19, static→public 전환)"
```

---

### Task 3: 콘텐츠 이동 + .md → .mdx 변환 + 이미지 코로케이션

53개 포스트를 **폴더 단위**(`src/content/posts/{원파일명}/index.mdx`)로 옮기고, 각 포스트가 단독으로 쓰는 본문 이미지를 같은 폴더로 동봉(상대경로 참조)한다. MDX 컴파일을 깨는 구문은 **렌더 결과가 변하지 않는 방식으로만** 수정한다. (스펙 v2-3, v2-7)

**Files:**
- Move: `public/contents/{이름}.md` → `src/content/posts/{이름}/index.mdx` (git mv — 히스토리 보존)
- Move: `public/image/*` 중 단독 사용 이미지 → 해당 포스트 폴더 (공유 이미지·.gif는 public/image 유지)
- Keep: `public/thumbnail/*` (frontmatter 문자열 경로 + og:image로 쓰이므로 이동하지 않음)
- Create: `scripts/colocate-images.mjs` (이미지 사용처 분석·이동·경로 치환·고아 목록)

**Interfaces:**
- Produces: MDX 컴파일이 통과하는 53개 `{이름}/index.mdx`. 폴더명(따라서 slug 원천)은 기존 파일명과 동일. 본문 이미지는 `![...](<./파일명.png>)` 상대경로(공백·한글 파일명은 `<>` 필수), 공유/gif 이미지는 기존 `/image/` 절대경로 유지.

- [ ] **Step 1: 포스트 일괄 이동 (폴더 구조)**

```bash
for f in public/contents/*.md; do
  base=$(basename "$f" .md)
  mkdir -p "src/content/posts/${base}"
  git mv "$f" "src/content/posts/${base}/index.mdx"
done
rmdir public/contents 2>/dev/null || true
git status --short | head   # 53건 rename 확인
```

- [ ] **Step 1.5: 이미지 코로케이션 스크립트 작성·실행**

```js
// scripts/colocate-images.mjs
// 1) 각 포스트 본문의 /image/... 참조를 수집(URL 인코딩 디코드 포함)
// 2) 정확히 1개 포스트만 쓰는 이미지(.gif 제외) → 그 포스트 폴더로 git mv + 본문 참조를 ![...](<./파일명>)로 치환
// 3) 2개 이상 포스트가 공유하거나 .gif인 이미지 → public/image에 두고 참조 유지 (목록 출력)
// 4) 어떤 포스트/thumbnail frontmatter에서도 참조 안 되는 고아 파일 → 삭제하지 말고 목록만 출력
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

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
  execSync(`git mv ${JSON.stringify(src)} ${JSON.stringify(path.join(POSTS, dir, name))}`);
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
```

Run: `node scripts/colocate-images.mjs`
Expected: 이동/공유/gif/고아 집계 출력. **고아 파일은 목록을 사용자에게 보여주고 승인 후에만 `git rm`** (약 19개 예상).

- [ ] **Step 1.6: 상대 이미지 렌더 방식 주의사항 확인**

콜로케이션된 상대경로 이미지는 Astro가 빌드 시 최적화한다(`/_astro/*.webp`, width/height/lazy — 스펙 §8 편차 8, 사용자 승인됨). `public/image`(공유·gif)와 `public/thumbnail`은 기존처럼 플레인 경로로 서빙된다.

- [ ] **Step 2: MDX 컴파일 오류 색출**

Task 4의 컬렉션 정의가 아직 없으므로, 이 시점에서는 임시로 최소 컬렉션(`src/content.config.ts`를 Task 4 Step 1 내용으로 먼저 작성해도 된다 — 순서 조정 허용)을 만든 뒤:

Run: `npx astro build 2>&1 | grep -A3 "error\|Error" | head -60`

MDX에서 깨지는 전형적 패턴과 허용된 수정 방법:
| 패턴 | 수정 |
|---|---|
| `<br>`, `<img ...>` 등 미닫힘 보이드 태그 | `<br />`, `<img ... />` |
| 본문 텍스트의 `{`, `}` | `\{`, `\}` 이스케이프 |
| 본문 텍스트의 `<`(비교 연산 등, 태그 아님) | `\<` 또는 `&lt;` |
| `<!-- 주석 -->` | `{/* 주석 */}` |
| 미닫힘/잘못 중첩된 HTML | 닫힘 태그 보정(렌더 결과 동일 확인) |

코드 펜스(```)와 인라인 코드(`) 내부는 MDX가 건드리지 않으므로 수정 금지. 오류가 0이 될 때까지 반복.

- [ ] **Step 3: BOM 파일 확인**

`로깅과 비즈니스 로직 분리를 통한 선언적 컴포넌트 관리.mdx`가 U+FEFF로 시작 — MDX 파서가 frontmatter를 정상 인식하는지 빌드 결과로 확인. 실패 시 BOM만 제거(내용 불변):

```bash
python3 -c "
p='src/content/posts/로깅과 비즈니스 로직 분리를 통한 선언적 컴포넌트 관리.mdx'
s=open(p,encoding='utf-8-sig').read(); open(p,'w',encoding='utf-8').write(s)"
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat : 콘텐츠를 src/content/posts로 이동 및 MDX 변환"
```

---

### Task 4: 콘텐츠 컬렉션 — slug/정렬/읽기시간/날짜 포맷

**Files:**
- Create: `src/content.config.ts`, `src/lib/posts.ts`, `scripts/check-slugs.mjs`

**Interfaces:**
- Produces:
  - 컬렉션 `posts` — id가 곧 slug 본체(양끝 슬래시 제외).
  - `src/lib/posts.ts`:
    - `getSortedPosts(): Promise<CollectionEntry<"posts">[]>` — date DESC, 동률 시 title DESC(**코드포인트 비교** — Gatsby lodash orderBy와 동일. localeCompare 금지)
    - `formatDate(date: string): string` — `"2024-01-02"` → `"2024.01.02."` (끝 마침표 포함)
    - `getReadingTimeText(entry): string | undefined` — reading-time에 **entry.body(본문)만** 입력한 `text` (v2-16 A5)
    - `toPostSummary(entry): PostSummary` — `{ id, slug: "/"+id+"/", title, summary, date(포맷 완료), categories, thumbnail }` (목록/태그 페이지 공용 직렬화)

- [ ] **Step 1: content.config.ts 작성**

```ts
// src/content.config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({
    pattern: "*/index.mdx",              // 폴더-단위 코로케이션 구조 (Task 3)
    base: "./src/content/posts",
    // Gatsby slug 규칙 재현: 폴더명(=기존 파일명) → trim → 연속 공백을 하이픈 1개로.
    // 한글·쉼표·괄호·마침표·대소문자 그대로 유지 (스펙 §1)
    generateId: ({ entry }) => entry.replace(/\/index\.mdx$/, "").trim().replace(/\s+/g, "-"),
  }),
  schema: z.object({
    date: z.string(),          // "YYYY-MM-DD" 문자열 그대로 (포맷/정렬 모두 문자열 기반)
    title: z.string(),
    categories: z.array(z.string()),
    summary: z.string(),
    thumbnail: z.string(),     // "/thumbnail/*.png" 절대경로
  }),
});

export const collections = { posts };
```

- [ ] **Step 2: src/lib/posts.ts 작성**

```ts
// src/lib/posts.ts
import { getCollection, type CollectionEntry } from "astro:content";
import readingTime from "reading-time";

export interface PostSummary {
  id: string; slug: string; title: string; summary: string;
  date: string; categories: string[]; thumbnail: string;
}

// Gatsby(lodash orderBy) 정렬 = 코드포인트 비교 (스펙 §2)
const byDateThenTitleDesc = (a: CollectionEntry<"posts">, b: CollectionEntry<"posts">) => {
  if (a.data.date !== b.data.date) return a.data.date < b.data.date ? 1 : -1;
  if (a.data.title !== b.data.title) return a.data.title < b.data.title ? 1 : -1;
  return 0;
};

export const getSortedPosts = async () => (await getCollection("posts")).sort(byDateThenTitleDesc);

// "2024-01-02" → "2024.01.02." (기존 formatString "YYYY.MM.DD.")
export const formatDate = (date: string) => `${date.replaceAll("-", ".")}.`;

// v2-16 A5: frontmatter 제외 본문만 입력 (기존 Gatsby의 "원문 전체 입력" 버그 폐기, 표시값 ±1분 허용)
export const getReadingTimeText = (entry: CollectionEntry<"posts">): string | undefined =>
  entry.body ? readingTime(entry.body).text : undefined; // 예: "9 min read"

export const toPostSummary = (p: CollectionEntry<"posts">): PostSummary => ({
  id: p.id, slug: `/${p.id}/`, title: p.data.title, summary: p.data.summary,
  date: formatDate(p.data.date), categories: p.data.categories, thumbnail: p.data.thumbnail,
});
```

- [ ] **Step 3: slug 검증 스크립트 작성 + 실행**

```js
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
```

Run: `node scripts/check-slugs.mjs`
Expected: `일치: 포스트 53개` / exit 0

- [ ] **Step 4: Commit**

```bash
git add src/content.config.ts src/lib/posts.ts scripts/check-slugs.mjs
git commit -m "feat : 콘텐츠 컬렉션 및 slug/정렬/읽기시간 유틸 (Gatsby 규칙 재현)"
```

---

### Task 5: 마크다운/MDX 파이프라인 — autolink 헤딩 플러그인 + 셀렉터 정리

**Files:**
- Create: `src/lib/rehype-autolink-headers.mjs`
- Modify: `astro.config.mjs` (주석 해제), `src/styles/GlobalStyle.css.ts` (scroll-margin-top 추가), `src/styles/markdown.css.ts` (인라인 코드 셀렉터 수정 — v2-16 A4)

**Interfaces:**
- Produces: MDX 렌더 결과가 골든과 동등 — markdown-* 클래스 11종, autolink 앵커(체인 SVG, `autolink-header before`, aria-label `"{텍스트} permalink"`, 퍼센트 인코딩 href), 헤딩 `style="position:relative;"`, h1~h3 `scroll-margin-top: 80px`(기존 offsetY 80 대응).

- [ ] **Step 1: 인라인 코드 셀렉터 수정 (v2-16 A4 — 클래스 플러그인 대체)**

`src/styles/markdown.css.ts`에서 인라인 코드 셀렉터를 클래스 의존 없이 동작하도록 수정:

```ts
// 변경 전: ".markdown-code:not([class*='language-'])"  (markdown-code 클래스 부착 전제)
// 변경 후: ".markdown-content code:not([class*='language-'])"  (래퍼 후손 셀렉터만으로 커버)
```

나머지 규칙은 이미 `.markdown-content h1, .markdown-h1` 이중 셀렉터라 래퍼 쪽이 항상 매칭됨 — gatsby-remark-classes 재현 플러그인은 만들지 않는다. (`.markdown-h1` 등 직접 클래스 셀렉터는 남아 있어도 무해하므로 CSS 정리는 선택.)

- [ ] **Step 2: autolink 헤딩 플러그인 작성**

```js
// src/lib/rehype-autolink-headers.mjs
// gatsby-remark-autolink-headers 재현 (스펙 §3-7). 전제: rehypeHeadingIds가 먼저 실행됨
import { visit } from "unist-util-visit";
import { fromHtml } from "hast-util-from-html";
import { toString } from "hast-util-to-string";

// gatsby-config.js의 icon 옵션 SVG 원본 그대로
const ICON_SVG = `<svg viewBox="0 0 16 16" height="0.7em" width="0.7em"> <g stroke-width="1.2" fill="none" stroke="currentColor"> <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M8.995,7.005 L8.995,7.005c1.374,1.374,1.374,3.601,0,4.975l-1.99,1.99c-1.374,1.374-3.601,1.374-4.975,0l0,0c-1.374-1.374-1.374-3.601,0-4.975 l1.748-1.698"></path>  <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M7.005,8.995 L7.005,8.995c-1.374-1.374-1.374-3.601,0-4.975l1.99-1.99c1.374-1.374,3.601-1.374,4.975,0l0,0c1.374,1.374,1.374,3.601,0,4.975 l-1.748,1.698"></path></g></svg>`;
const iconTree = fromHtml(ICON_SVG, { fragment: true, space: "svg" }).children;

export function rehypeAutolinkHeaders() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (!["h1", "h2", "h3"].includes(node.tagName)) return;
      const id = node.properties?.id;
      if (!id) return;
      node.properties.style = "position:relative;";
      node.children.unshift({
        type: "element",
        tagName: "a",
        properties: {
          href: `#${encodeURIComponent(String(id))}`,
          ariaLabel: `${toString(node)} permalink`,
          className: ["autolink-header", "before"],
        },
        children: structuredClone(iconTree),
      });
    });
  };
}
```

- [ ] **Step 3: offsetY 80 대응 CSS 추가**

`src/styles/GlobalStyle.css.ts`에 추가:

```ts
globalStyle("h1[id], h2[id], h3[id]", {
  scrollMarginTop: "80px", // gatsby-remark-autolink-headers offsetY: 80 대응
});
// v2-11: TOC/앵커 클릭 시 부드러운 스크롤 이동 (reduced-motion 사용자는 즉시 이동)
globalStyle("html", { scrollBehavior: "smooth" });
globalStyle("html", {
  "@media": { "(prefers-reduced-motion: reduce)": { scrollBehavior: "auto" } },
});
```

- [ ] **Step 4: astro.config.mjs 주석 해제 + 빌드 확인 + Commit**

Run: `npx astro build` → 성공 확인 (마크업 검증은 Task 11의 골든 비교에서 전 포스트 대상으로 수행).

```bash
git add src/lib astro.config.mjs src/styles/GlobalStyle.css.ts src/styles/markdown.css.ts
git commit -m "feat : MDX 파이프라인 구성 (autolink 헤딩, 인라인 코드 셀렉터 정리)"
```

---

### Task 6: TOC 컴포넌트 (headings 기반 렌더 — v2-16 A3)

**Files:**
- Modify: `src/components/Post/TableOfContents.tsx` — HTML 문자열 주입 대신 `headings` 배열을 받아 중첩 리스트를 직접 렌더

**Interfaces:**
- Consumes: Astro `render(entry)`의 `headings: { depth, slug, text }[]`
- Produces: `<TableOfContents headings={MarkdownHeading[]} />` — depth≤3 필터, 중첩 ul/li, `tocLink` 클래스를 렌더 시 직접 부여(런타임 클래스 부여 로직 폐기). depth≤3 헤딩이 없으면 null 반환(기존: TOC 미렌더). href는 `#${encodeURIComponent(slug)}`로 골든과 동일 집합.

- [ ] **Step 1: TableOfContents.tsx 재작성**

```tsx
// 기존 nav/타이틀/스크롤영역 래퍼 마크업과 .css.ts 클래스는 그대로, 내용 렌더만 교체
interface TocNode { heading: MarkdownHeading; children: TocNode[] }

const buildTree = (headings: MarkdownHeading[]): TocNode[] => {
  const items = headings.filter((h) => h.depth <= 3);
  const root: TocNode[] = [];
  const stack: { depth: number; nodes: TocNode[] }[] = [{ depth: 0, nodes: root }];
  for (const h of items) {
    while (stack.length > 1 && h.depth <= stack[stack.length - 1].depth) stack.pop();
    const node: TocNode = { heading: h, children: [] };
    stack[stack.length - 1].nodes.push(node);
    stack.push({ depth: h.depth, nodes: node.children });
  }
  return root;
};

const TocList = ({ nodes }: { nodes: TocNode[] }) => (
  <ul>
    {nodes.map((n) => (
      <li key={n.heading.slug}>
        <a className={tocLink} href={`#${encodeURIComponent(n.heading.slug)}`}>{n.heading.text}</a>
        {n.children.length > 0 && <TocList nodes={n.children} />}
      </li>
    ))}
  </ul>
);
// depth≤3 헤딩이 0개면 null 반환 (기존 tocHtml null 동작과 동일)
```

활성(tocLinkActive) 처리는 Task 11의 스크롤 스파이가 담당 — 이 컴포넌트는 렌더만.

- [ ] **Step 2: 골든 대조 기준 확인**

TOC 검증은 Task 11의 compare-golden `TOC href` 집합 비교로 수행(마크업 구조가 아닌 href 집합 기준 — A3에 따라 `<p>` 래핑 재현 의무 없음). `TableOfContents.css.ts` 스타일이 새 마크업(ul/li/a 직접 중첩)에서 기존과 같은 시각 결과를 내는지 preview로 확인하고, 필요 시 셀렉터만 보정.

- [ ] **Step 3: Commit**

```bash
git add src/components/Post/TableOfContents.tsx
git commit -m "feat : TOC를 headings 기반 컴포넌트 렌더로 구현"
```

---

### Task 7: 레이아웃 셸 — Layout.astro / 메타태그 / Footer / ScrollToTop

**Files:**
- Create: `src/layouts/Layout.astro`, `src/layouts/Layout.css.ts` (기존 `src/components/Layout.css.ts`의 container 스타일 이동)
- Modify: `src/styles/GlobalStyle.css.ts` (`#___gatsby` → `#app`), `src/constants/index.ts` (NAV_LINKS: Home `/`, Tags `/tag/` — **Posts 항목 제거**, 스펙 v2-1)
- Reuse(무수정): `src/styles/theme.css.ts`, `src/components/Footer/*`, `src/components/icon/*`
- Modify: `src/components/ScrollToTop/ScrollToTop.css.ts` — 미정의 변수 폴백(#333/#fff 고정)을 vars.color 테마 토큰으로 교체(스펙 v2-13 C2). 400px 임계값·동작은 무수정
- Delete: `src/components/Template.tsx`, `src/components/Layout.tsx`, `src/components/Layout.css.ts`

**Interfaces:**
- Produces: `Layout.astro` props — `{ title?; description?; url?; image?; noMeta? }`. `noMeta`는 404 전용(메타 전무 재현). body 구조: `<body><div id="app"><Header client:load /><main class={container}>slot</main><Footer /><ScrollToTop client:load /></div></body>`.

- [ ] **Step 1: GlobalStyle 셀렉터 치환**

`#___gatsby` → `#app` (height:100% 체인 유지 — Footer margin-top:auto 하단 고정의 전제).

- [ ] **Step 2: Layout.astro 작성**

```astro
---
// src/layouts/Layout.astro — Template.tsx(react-helmet) + Layout.tsx + wrapPageElement 통합
import "prism-themes/themes/prism-ghcolors.min.css"; // gatsby-browser/ssr의 전역 import 재현
import "@/styles/GlobalStyle.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import ScrollToTop from "@/components/ScrollToTop/ScrollToTop";
import { container } from "./Layout.css";
import { lightTheme as lightThemeClass, darkTheme as darkThemeClass } from "@/styles/theme.css";
import { SITE } from "@/consts";

interface Props {
  title?: string; description?: string; url?: string; image?: string;
  type?: "website" | "article"; // v2-16 B3: 포스트 상세는 article
  noMeta?: boolean; // 404 재현용: head 메타 전무
}
// v2-10(e): image 기본값 = 브랜드 OG 이미지. 포스트 상세는 썸네일을 넘겨 덮어씀. 항상 절대 URL로 변환해 출력.
const { title = SITE.title, description = SITE.description, url = SITE.siteUrl, image = "/og-image.png", type = "website", noMeta = false } = Astro.props;
const ogImage = image ? new URL(image, Astro.site).href : "";
const canonical = new URL(Astro.url.pathname, Astro.site); // stripQueryString 동작과 동일
// ↑ og:image/twitter:image의 content에는 image 대신 ogImage를 사용할 것
---
<html lang="ko">
  <head>
    {/* v2-12: 파비콘 — 404 포함 전 페이지 공통 */}
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon.png" />
    {!noMeta && (
      <>
        <title>{title}</title>
        <meta name="google-site-verification" content="32VgiXrbX9YRCfnd2p5rqMCm5eNlviCqwzzD5oUo1jw" />
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
        <meta property="og:type" content={type} /> {/* v2-16 B3 */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />
        <meta property="og:site_name" content={SITE.title} /> {/* v2-10: 페이지 title이 아닌 사이트명 고정 */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        {/* v2-10(d): twitter:site/creator "@사용자이름" 플레이스홀더는 제거됨 (X 계정 없음) */}
        <link rel="canonical" href={canonical} />
        {Astro.url.pathname === "/" && (
          <script type="application/ld+json" set:html={JSON.stringify({
            "@context": "https://schema.org", "@type": "WebSite",
            name: SITE.title, description: SITE.description, url: SITE.siteUrl,
          })} /> /* v2-10: 사이트명/설명 구조화 데이터 */
        )}
      </>
    )}
    {noMeta && <meta charset="utf-8" />}
  </head>
  <body>
    {/* v2-16 A1: 첫 페인트 전에 테마 클래스 적용 — MPA FOUC 제거. vanilla-extract 해시 클래스명을 빌드 시 주입 */}
    <script is:inline define:vars={{ light: lightThemeClass, dark: darkThemeClass }}>
      try {
        const saved = localStorage.getItem("theme");
        const dark = saved === "dark" || (!saved && matchMedia("(prefers-color-scheme: dark)").matches);
        document.body.className = dark ? dark : light; // define:vars로 주입된 테마 클래스명
      } catch (_) { document.body.className = light; }
    </script>
    <div id="app">
      <Header client:load pathname={Astro.url.pathname} />
      <main class={container}><slot /></main>
      <Footer />
      <ScrollToTop client:load />
    </div>
  </body>
</html>
```

주의(v2-16 A1): 인라인 스크립트가 첫 페인트 전에 body 테마 클래스를 적용하므로, ThemeContext의 마운트 useEffect는 같은 판정 로직으로 **동일한 결과**를 내야 한다(다르면 하이드레이션 후 테마가 뒤집힘). ThemeContext 초기 state도 body 클래스를 읽어 결정하도록 소폭 수정(ThemeIcon 아이콘이 첫 렌더부터 올바르게).

- [ ] **Step 3: 빌드 확인 + Commit**

Run: `npx astro build` → dist/index.html에 `<div id="app">`과 Footer 문구 "Thank You for Visiting My Blog, Have a Good Day 😆" 존재 확인. (Header가 아직 Gatsby import를 갖고 있어 실패하면 Task 8을 먼저 진행 후 함께 커밋.)

```bash
git add -A
git commit -m "feat : Layout.astro 및 공통 셸 (메타태그/Footer/ScrollToTop)"
```

---

### Task 8: Header 아일랜드 + 헤더 애니메이션 버그 수정

실사이트에서 검증된 버그 2건(스펙 v2-2)을 수정하며 이식한다: (a) 최초 진입 시 slideDown 재생, (b) 빠른 방향 전환 시 keyframes 고정 시작값 재시작으로 인한 점프/깜빡임.

**Files:**
- Modify: `src/components/Header/Header.tsx` — Gatsby Link 제거, ThemeProvider 래핑
- Modify: `src/components/Header/Header.css.ts` — **slideDown/slideUp keyframes 및 animation 속성 삭제** (transform+transition만 유지)
- Modify: `src/hooks/useSearch.tsx` — `navigate` → `window.location.assign`, 이동 대상 `/post` → `/` (스펙 v2-1)
- Reuse(무수정): `src/hooks/useHeader.tsx`, `src/components/Header/SearchContainer.tsx`, `src/context/ThemeContext.tsx`

**Interfaces:**
- Consumes: Layout.astro의 `pathname` prop
- Produces: `<Header pathname={string} />` — ThemeProvider로 감싼 default export

- [ ] **Step 1: Header.css.ts 수정 — 애니메이션 버그 수정의 핵심**

```ts
// 변경 전: headerVisible/headerHidden에 transform + animation(slideDown/slideUp keyframes) 병용
//   → 최초 렌더에 slideDown 재생 + 방향 전환 시 keyframe 시작값으로 점프
// 변경 후: keyframes 완전 삭제. 클래스는 transform만 선언, 전환은 기존 base의
//   transition("transform 0.3s ease-in-out, ...")이 담당.
export const headerVisible = style({ transform: "translateY(0)" });
export const headerHidden = style({ transform: "translateY(-100%)" });
// slideDown/slideUp keyframes 정의 삭제
```

동작 근거: 초기 상태 isVisible=true → translateY(0)이고 클래스 변경이 없으므로 **최초 진입 시 아무 애니메이션 없음**. 이후 클래스 전환 시 transition이 **현재 계산값에서** 목표값으로 보간하므로 빠른 방향 전환에도 점프 없이 연속적으로 움직임(opacity 깜빡임도 소멸 — opacity는 keyframes에만 있었음).

- [ ] **Step 2: Header.tsx 수정**

```tsx
// 변경 1: import { Link } from "gatsby" 제거 → <a href>
// 변경 2: ThemeProvider로 감싼 래퍼를 default export
//   (원본은 wrapRootElement에서 감쌌음 — 테마 소비자가 Header 내부 ThemeIcon뿐이므로 동일 결과)
import { ThemeProvider } from "@/context/ThemeContext";

const Header = ({ pathname }: { pathname: string }) => { /* 기존 본문 그대로 */ };

export default function HeaderIsland(props: { pathname: string }) {
  return <ThemeProvider><Header {...props} /></ThemeProvider>;
}
```

활성 링크 판정(`pathname === path` 정확 일치)과 useHeader의 10px/100px 임계값 로직은 무수정 — 단 스크롤 리스너가 매 스크롤마다 재등록되는 원본 비효율은 ref 기반으로 정리(v2-16 B6 확정 — lastScrollY를 useRef로, 리스너 1회 등록). NAV_LINKS는 Task 7에서 Home/Tags 2개로 축소됨. 추가(스펙 v2-13): SearchIcon 하드코딩 색(#586069→hover #667eea)을 테마 토큰으로 교체(C2), ThemeContext의 테마 변경 시 `themechange` 커스텀 이벤트 dispatch(C3 utterances 연동용). matchMedia change 리스너는 추가하지 않음(C4 제외 — 초기 판정 1회만 기존대로).

- [ ] **Step 3: 검색 인덱스 엔드포인트 작성 (본문 전문 검색용)**

```ts
// src/pages/search-index.json.ts — 빌드 타임에 정적 JSON으로 출력됨
import { getSortedPosts, toPostSummary } from "@/lib/posts";

const stripMdx = (raw: string) =>
  raw
    .replace(/```[\s\S]*?```/g, " ")          // 코드펜스 제외 (검색 노이즈 방지)
    .replace(/<[^>]+>/g, " ")                 // HTML/JSX 태그 제거
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")    // 이미지 문법 제거
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")  // 링크 → 앵커 텍스트만
    .replace(/^---[\s\S]*?---/, " ")          // frontmatter 제거
    .replace(/\s+/g, " ")
    .trim();

export async function GET() {
  const posts = await getSortedPosts();
  const index = posts.map((p) => ({ ...toPostSummary(p), body: stripMdx(p.body ?? "") }));
  return new Response(JSON.stringify(index), { headers: { "Content-Type": "application/json" } });
}
```

- [ ] **Step 4: useSearch.tsx 재작성 — 라이브 검색 + 범위 + 인덱스 lazy fetch (스펙 v2-6)**

```tsx
// src/hooks/useSearch.tsx — 기존 훅을 확장 재작성
// - scope: "" (전체) | "title" | "content" — <select> 값과 URL ?scope= 에 대응
// - 검색창 첫 포커스 시 /search-index.json 1회 fetch 후 메모리 캐시
// - 입력 디바운스 150ms → matches 상위 8개를 드롭다운용으로 반환
// - Enter 제출: 값 있으면 location.assign(`/?search=${encodeURIComponent(v)}` + (scope ? `&scope=${scope}` : ""))
//              빈 값이면 location.assign("/")
export const matchesPost = (p: IndexedPost, term: string, scope: string) => {
  const t = term.trim().toLowerCase();
  if (!t) return false;
  const inTitle = p.title.toLowerCase().includes(t) || p.summary.toLowerCase().includes(t);
  const inBody = p.body.toLowerCase().includes(t);
  if (scope === "title") return inTitle;
  if (scope === "content") return inBody;
  return inTitle || inBody; // 전체
};
```

- [ ] **Step 5: SearchContainer에 범위 셀렉트 + 라이브 드롭다운 추가**

- `SearchContainer.tsx`: input 왼쪽에 `<select>`(전체/제목/본문) 추가. input 아래에 `SearchDropdown` 렌더.
- Create `src/components/Header/SearchDropdown.tsx` + `.css.ts`(신규 UI — 스펙 v2-6이 허용한 유일한 신규 디자인 영역): 매칭 상위 8개를 제목(매칭부 `<mark>`)·요약 1줄·날짜로 표시, 클릭 시 해당 포스트로 이동, Esc/외부 클릭 시 닫힘. 배경·보더·호버 색은 기존 테마 토큰(vars.color.*) 사용해 사이트 톤 유지.
- 아코디언 높이: 고정 `max-height 200px` keyframes → `grid-template-rows 0fr↔1fr` transition(콘텐츠 기반 높이)으로 교체 — 드롭다운이 200px을 넘어도 잘리지 않음.
- `/?search=` 프리필: Header 마운트 시 `location.search`에 search가 있으면 아코디언을 연 상태로 input에 값·scope를 채움.

- [ ] **Step 6: 브라우저 검증 (agent-browser)**

`npx astro build && npx astro preview` 후:
1. 최초 로드: header의 `getAnimations()`가 빈 배열이어야 함(기존 버그: slideDown 러닝).
2. 빠른 방향 전환: 스크롤 600→300→700 연타 시 `getBoundingClientRect().top`이 연속적으로 변해야 함(순간 점프 금지).
3. 스크롤 다운 100px 초과 숨김 / 업 표시 / 10px 미만 항상 표시.
4. 검색: 타이핑 → 드롭다운 라이브 갱신(첫 포커스에 /search-index.json 1회 로드), 범위를 '본문'으로 바꾸면 본문만 매칭, Enter → `/?search=…&scope=…` 이동 + 검색창 프리필, 테마 토글 → localStorage 유지.

Expected: 1·2·4(드롭다운/범위/프리필)는 기존 사이트와 **달라야** 하고(승인된 개선), 3은 동일해야 함.

- [ ] **Step 7: Commit**

```bash
git add src/components/Header src/hooks src/constants src/pages/search-index.json.ts
git commit -m "feat : Header 이식, 헤더 애니메이션 버그 수정, 검색 UX 개편 (라이브 드롭다운/범위/전문 검색)"
```

---

### Task 9: `/` 전체 포스트 목록 (`/post/`는 생성하지 않음)

**Files:**
- Create: `src/pages/index.astro` (임시본 대체), `src/components/PostList/PostPageClient.tsx`
- 생성 금지: `src/pages/post.astro` — `/post/`는 리다이렉트 없이 완전 제거(스펙 v2-1, 접속 시 404)
- Move: `src/pages/post.css.ts`·`index.css.ts`·`tag.css.ts`·`404.css.ts` → `src/pages-styles/` (기존 page-creator ignore와 같은 취지)
- Modify: `src/components/PostList/PostItem.tsx` — Gatsby Link → `<a>` (링크 정규화 `link.trim().replace(/\s+/g,'-')` 유지) + searchTerm 하이라이트 + 썸네일 `object-fit: cover`(스펙 v2-13 C1), `PostList.tsx` — props를 `PostSummary[]` 기반으로 + useInfiniteScroll 제거·페이지네이션 적용(아래 참조), `EmptyPostList.css.ts` — #666 고정색을 vars.color.secondary로(v2-13 C2)
- Reuse(무수정): `EmptyPostList.tsx`, 각 .css.ts
- Create: `src/components/PostList/Pagination.tsx` + `.css.ts` (신규 UI — 스펙 v2-8)
- 이관 제외: `useInfiniteScroll.tsx` (페이지네이션으로 대체 — 스펙 v2-8)
- 확인 후 결정: `CategoryList` — `grep -rn "CategoryList" src`로 사용처 확인, 미사용이면 이관 제외(스펙 §7)

**Interfaces:**
- Consumes: `getSortedPosts()`, `toPostSummary()` (Task 4)
- Produces: `<PostPageClient posts={PostSummary[]} />` — `?category`/`?search`/`?scope`/`?page`를 읽어 클라이언트 필터 + PostList(페이지네이션) 렌더. Task 10의 태그 페이지도 같은 PostList를 소비.

**PostList 페이지네이션 (스펙 v2-8):** useInfiniteScroll 호출을 제거하고 PostList 내부에서 페이지 단위 slice + Pagination 렌더:

```tsx
// PostList.tsx 변경 골자 — 페이지당 10개(기존 배치 크기 유지)
const PER_PAGE = 10;
// page 상태는 URL ?page=N과 동기화: 초기값은 URL에서 읽고(1 미만/범위 밖/비숫자 → 1),
// 변경 시 history.pushState로 ?page= 갱신(다른 파라미터 보존) + 목록 상단으로
// scrollTo({ top, behavior: "instant" }) — html의 scroll-behavior:smooth(v2-11)를 여기선 무시(목록 교체와 동시라 어지러움 방지).
// posts(필터 결과)가 바뀌면 page를 1로 리셋.
const totalPages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
const visible = posts.slice((page - 1) * PER_PAGE, page * PER_PAGE);
// PostItem에는 기존처럼 index(0~9)를 넘겨 스태거 애니메이션 유지
```

```tsx
// src/components/PostList/Pagination.tsx (신규 UI — 테마 토큰 기반)
// [이전] [1] [2] … [N] [다음] 형태. 현재 페이지는 vars.color.primary 강조,
// 페이지가 1개면 렌더하지 않음. 페이지가 많을 때는 현재±2 + 처음/끝 + 말줄임.
// 버튼은 <button type="button">, aria-label("N페이지로 이동"), aria-current="page" 지정.
```

- [ ] **Step 1: index.astro 작성 (기존 post.tsx의 역할을 `/`로 이동 — 스펙 v2-1)**

```astro
---
// src/pages/index.astro — 전체 포스트 목록 (기존 /post 페이지의 역할)
import Layout from "@/layouts/Layout.astro";
import PostPageClient from "@/components/PostList/PostPageClient";
import { getSortedPosts, toPostSummary } from "@/lib/posts";
import { SITE } from "@/consts";
const posts = (await getSortedPosts()).map(toPostSummary);
---
<Layout title={SITE.title} description={SITE.description} url={SITE.siteUrl} image="">
  <PostPageClient client:load posts={posts} />
</Layout>
```

문서 title은 `BoubleJ's Blog`(기존 `/`와 동일 — " - Posts" 접미사는 페이지 소멸과 함께 제거). og:image는 빈 문자열(profile-image 부재 — 기존 동작).

- [ ] **Step 2: PostPageClient 작성 — 기존 post.tsx 로직 이식**

```tsx
// src/components/PostList/PostPageClient.tsx
// v2-16 B1: query-string 대신 표준 URLSearchParams. 파싱 규칙 유지: category는 truthy만, search는 빈 문자열 허용
import { useEffect, useState } from "react";
import PostList from "./PostList";
import type { PostSummary } from "@/lib/posts";
// 페이지 제목 스타일은 기존 post.css.ts 이동본에서 — 실제 export명 사용
import { pageTitle } from "@/pages-styles/post.css";

export default function PostPageClient({ posts }: { posts: PostSummary[] }) {
  const [{ category, search, scope }, setParams] = useState({ category: "", search: "", scope: "" });
  const [bodyIndex, setBodyIndex] = useState<Map<string, string> | null>(null); // slug → body plain text
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const search = sp.get("search") ?? "";
    const rawScope = sp.get("scope");
    const scope = rawScope === "title" || rawScope === "content" ? rawScope : "";
    setParams({ category: sp.get("category") || "", search, scope });
    // 본문 검색이 필요할 때만 인덱스 로드 (scope=content 또는 전체 검색) — 스펙 v2-6
    if (search.trim() && scope !== "title")
      fetch("/search-index.json").then((r) => r.json())
        .then((idx) => setBodyIndex(new Map(idx.map((p: { slug: string; body: string }) => [p.slug, p.body]))));
  }, []);
  const term = search.trim().toLowerCase();
  const inTitle = (p: PostSummary) => (p.title ?? "").toLowerCase().includes(term) || (p.summary ?? "").toLowerCase().includes(term);
  const inBody = (p: PostSummary) => (bodyIndex?.get(p.slug) ?? "").toLowerCase().includes(term);
  const filtered = !term ? posts
    : scope === "title" ? posts.filter(inTitle)
    : scope === "content" ? posts.filter(inBody)
    : posts.filter((p) => inTitle(p) || inBody(p));
  return (
    <>
      <h2 className={pageTitle}>모든 포스트</h2>
      {/* v2-14: 현재 조건의 포스트 개수 — 필터된 전체 기준(페이지 슬라이스 아님). vars.color.secondary 작은 텍스트 */}
      <p className={postCount}>총 {filtered.length}개의 포스트</p>
      <PostList posts={filtered} selectedCategory={category} searchTerm={search} />
    </>
  );
}
```

(제목 문구·마크업은 기존 post.tsx 원본을 열어 그대로 맞춘다. 카테고리 필터링이 PostList 내부 책임인 기존 구조도 유지.)

**하이라이트 (스펙 v2-6):** `PostItem.tsx`에 `searchTerm` prop을 추가하고, 제목/요약의 매칭 부분을 `<mark>`로 감싸 렌더한다(본문 매칭만으로 포함된 카드는 하이라이트 없음 — 스니펫 미표시 결정). PostList가 이미 받는 searchTerm을 그대로 내려준다:

```tsx
// PostItem 내부 헬퍼 — 대소문자 무시 전체 매칭 <mark> 래핑
const highlight = (text: string, term: string) => {
  const t = term.trim();
  if (!t) return text;
  const parts = text.split(new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"));
  return parts.map((part, i) =>
    part.toLowerCase() === t.toLowerCase() ? <mark key={i}>{part}</mark> : part
  );
};
```

`<mark>` 색상은 브라우저 기본 대신 테마 토큰 기반으로 라이트/다크 각각 지정(PostItem.css.ts에 globalStyle 추가). 결과 개수 표시는 **하지 않는다**(사용자 결정).

- [ ] **Step 3: 빌드 + 검증**

Run: `npx astro build && node scripts/compare-golden.mjs dist`
Expected: URL 집합 일치(포스트 53개는 Task 11 전까지 "골든에만 있음"으로 예상 실패 — 그 외 차이 없어야 함).

수동 확인(preview): `/?category=React`, `/?search=스크롤` 필터, 페이지네이션(10개/페이지, `?page=` URL 동기화, 필터 변경 시 1페이지 리셋, 페이지 이동 시 상단 스크롤), 카드 스태거 애니메이션. `/post/` 접속 시 404 페이지가 나오는지도 확인(의도된 동작).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat : 루트를 전체 포스트 목록으로 변경 (/post 제거)"
```

---

### Task 10: 태그 페이지 — `/tag/`

**Files:**
- Create: `src/pages/tag.astro`, `src/components/Tag/TagPageClient.tsx` (기존 tag.tsx 로직 이식)

**Interfaces:**
- Consumes: `PostSummary[]`, `PostList`
- Produces: `/tag/` — 태그 개수 내림차순 버튼(`#태그명 (개수)`), 토글 다중 선택, `history.pushState`로 `?tags=` 동기화(%2C 인코딩), OR 필터

- [ ] **Step 1: TagPageClient 작성 — tag.tsx에서 이식**

변경점만: `navigate('/tag?tags=' + ...)` → `history.pushState` + 상태 갱신(원본의 리로드 없는 URL 갱신과 동등). popstate 리스너로 뒤로가기 시 재파싱(원본의 useEffect[location.search] 동작 재현):

```tsx
const applyTags = (tags: string[]) => {
  const url = tags.length
    ? (() => { const sp = new URLSearchParams(); sp.set("tags", tags.join(",")); return `/tag?${sp}`; })()
    : "/tag";
  history.pushState(null, "", url);
  setSelectedTags(tags);
};
useEffect(() => {
  const read = () => setSelectedTags(new URLSearchParams(location.search).get("tags")?.split(",") ?? []);
  read();
  addEventListener("popstate", read);
  return () => removeEventListener("popstate", read);
}, []);
```

태그 집계(categories null 스킵, 개수 내림차순·동률 시 삽입 순서), 버튼 마크업(`<button type="button">` + onKeyDown Enter/Space), OR 필터, `PostList`에 `selectedCategory="" searchTerm=""` — 전부 원본 그대로. 추가(v2-14): 필터된 목록 위에 `총 {filtered.length}개의 포스트` 개수 표시(PostPageClient와 동일한 공용 스타일 사용).

- [ ] **Step 2: tag.astro 작성**

```astro
---
import Layout from "@/layouts/Layout.astro";
import TagPageClient from "@/components/Tag/TagPageClient";
import { getSortedPosts, toPostSummary } from "@/lib/posts";
import { SITE } from "@/consts";
const posts = (await getSortedPosts()).map(toPostSummary);
---
<Layout title={`${SITE.title} - Tags`} description={SITE.description} url={SITE.siteUrl} image="">
  <TagPageClient client:load posts={posts} />
</Layout>
```

- [ ] **Step 3: 수동 검증 + Commit**

preview에서: 태그 2개 토글 → `?tags=a%2Cb` 확인, OR 필터, 전체 해제 시 `/tag`, 뒤로가기 복원.

```bash
git add -A
git commit -m "feat : 태그 페이지 이식 (다중 선택 필터 + URL 동기화)"
```

---

### Task 11: 포스트 상세 페이지 — `/{slug}/`

**Files:**
- Create: `src/pages/[slug].astro`, `src/components/Post/CommentWidget.astro`, `src/scripts/code-copy.ts` (코드 복사 — 바닐라 재작성), `src/scripts/reading-progress.ts` (읽기 진행률 바 — 스펙 v2-15)
- Move: `src/templates/post_template.css.ts` → `src/pages-styles/post_template.css.ts`
- Reuse(무수정): `PostHead.tsx`, `PostHeadInfo.tsx`, 관련 .css.ts
- Modify: `TableOfContents.tsx` — hashchange 활성화 → **IntersectionObserver 스크롤 스파이** (스펙 v2-9):

```tsx
// TableOfContents.tsx 변경 골자 — 기존 tocLink 클래스 부여 로직은 유지하고 활성화 방식만 교체
useEffect(() => {
  const headings = [...document.querySelectorAll(".markdown-content h1[id], .markdown-content h2[id], .markdown-content h3[id]")];
  const links = new Map( // 헤딩 id → TOC 링크 (href는 퍼센트 인코딩이므로 디코드해서 매칭)
    [...document.querySelectorAll('nav[aria-label="목차"] a[href^="#"]')]
      .map((a) => [decodeURIComponent((a as HTMLAnchorElement).hash.slice(1)), a as HTMLAnchorElement])
  );
  let activeId = "";
  const setActive = (id: string) => {
    if (id === activeId) return;
    activeId = id;
    links.forEach((a, key) => a.classList.toggle(tocLinkActive, key === id));
  };
  // 고정 헤더(70px)+여유를 rootMargin 상단 -80px로 보정, 하단 -60%로 "화면 상단부에 있는 헤딩"을 현재 섹션으로 판정
  const io = new IntersectionObserver(
    () => {
      // 관찰 콜백마다 '뷰포트 상단(80px) 위를 지나간 마지막 헤딩'을 현재 섹션으로 계산
      const current = headings.filter((h) => h.getBoundingClientRect().top <= 81).at(-1) ?? headings[0];
      if (current) setActive(current.id);
    },
    { rootMargin: "-80px 0px -60% 0px", threshold: [0, 1] }
  );
  headings.forEach((h) => io.observe(h));
  // 클릭 시 즉시 활성(스크롤 애니메이션 완료 전 반응성) — 이후 스파이가 이어받음
  const onHash = () => setActive(decodeURIComponent(location.hash.slice(1)));
  window.addEventListener("hashchange", onHash);
  return () => { io.disconnect(); window.removeEventListener("hashchange", onHash); };
}, [headings]);
```
- Delete: `src/components/Post/PostContent.tsx`(MDX 서버 렌더 + 바닐라 스크립트로 대체 — React createRoot 의존 소멸), `src/components/Post/CommentWidget.tsx`

**Interfaces:**
- Consumes: `render(entry)`(astro:content), `TableOfContents`(Task 6 — headings props), `getReadingTimeText`/`formatDate`(Task 4)
- Produces: 53개 포스트 페이지 — PostHead(island) + `.markdown-content` 본문(서버 렌더 `<Content />`) + TOC(island) + 댓글(정적) + 코드 복사(인라인 스크립트)

- [ ] **Step 1: [slug].astro 작성**

```astro
---
// src/pages/[slug].astro — 기존 src/templates/post_template.tsx 재현 (MDX 버전)
import { render } from "astro:content";
import Layout from "@/layouts/Layout.astro";
import PostHead from "@/components/Post/PostHead";
import TableOfContents from "@/components/Post/TableOfContents";
import CommentWidget from "@/components/Post/CommentWidget.astro";
import { getSortedPosts, formatDate, getReadingTimeText } from "@/lib/posts";
import { markdownRenderer } from "@/styles/markdown.css";           // 기존 PostContent 래퍼 클래스
import { contentWrapper, aside } from "@/pages-styles/post_template.css"; // 실제 export명 사용

export async function getStaticPaths() {
  return (await getSortedPosts()).map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}
const { entry } = Astro.props;
const { title, summary, categories, thumbnail } = entry.data;
const date = formatDate(entry.data.date);
const readingTimeText = getReadingTimeText(entry);
const { Content, headings } = await render(entry);
---
<Layout title={title} description={summary} url={new URL(Astro.url.pathname, Astro.site).href} image={thumbnail} type="article">
  <PostHead client:load title={title} date={date} categories={categories} thumbnail={thumbnail} readingTimeText={readingTimeText} />
  <div class={contentWrapper}>
    <div class={`${markdownRenderer} markdown-content`}><Content /></div>
    <aside class={aside}><TableOfContents client:load headings={headings.filter((h) => h.depth <= 3)} /></aside>
  </div>
  <CommentWidget />
  <div id="reading-progress" aria-hidden="true"></div> {/* v2-15: 스타일은 post_template.css에 추가 */}
  <script src="@/scripts/code-copy.ts"></script>
  <script src="@/scripts/reading-progress.ts"></script>
</Layout>
```

(본문/aside 마크업 구조·클래스는 post_template.tsx와 PostContent.tsx 원본을 열어 그대로 맞춘다.)

- [ ] **Step 2: code-copy.ts 작성 — 기존 PostContent useEffect의 바닐라 이식**

```ts
// src/scripts/code-copy.ts — PostContent.tsx의 복사 버튼 로직 재작성 (동작 동일, React 의존 제거)
const COPY_SVG = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="복사"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
const CHECK_SVG = `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="완료"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
// ↑ 실제 path는 기존 CopyIcon.tsx / CheckIcon.tsx의 SVG 원본을 열어 그대로 복사할 것

const root = document.querySelector(".markdown-content");
if (root) {
  root.querySelectorAll("pre").forEach((pre) => {
    if (pre.querySelector(".code-copy-button")) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "code-copy-button";
    btn.setAttribute("aria-label", "코드 복사");
    const icon = document.createElement("span");
    icon.className = "code-copy-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML = COPY_SVG;
    btn.appendChild(icon);
    btn.addEventListener("click", async () => {
      const text = pre.querySelector("code")?.textContent ?? pre.textContent ?? "";
      try {
        if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
        else {
          const ta = document.createElement("textarea");
          ta.value = text; ta.style.position = "fixed"; ta.style.left = "-9999px";
          document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
        }
        btn.classList.add("copied");
        btn.setAttribute("aria-label", "복사 완료");
        icon.innerHTML = CHECK_SVG;
      } catch {
        btn.setAttribute("aria-label", "복사 실패");
      }
      setTimeout(() => {
        if (!btn.isConnected) return;
        btn.classList.remove("copied");
        btn.setAttribute("aria-label", "코드 복사");
        icon.innerHTML = COPY_SVG;
      }, 1500);
    });
    pre.appendChild(btn);
  });
}
```

- [ ] **Step 2.5: reading-progress.ts 작성 (스펙 v2-15)**

```ts
// src/scripts/reading-progress.ts — 포스트 읽기 진행률 바
const bar = document.getElementById("reading-progress");
if (bar) {
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const progress = max > 0 ? Math.min(scrollY / max, 1) : 0;
    bar.style.transform = `scaleX(${progress})`; // width 대신 transform — 리플로 없음
    ticking = false;
  };
  addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  addEventListener("resize", update, { passive: true });
  update(); // 새로고침으로 중간 위치에서 시작해도 즉시 반영
}
```

`post_template.css.ts`에 스타일 추가:

```ts
globalStyle("#reading-progress", {
  position: "fixed", top: 0, left: 0, width: "100%", height: "3px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // 로고 그라디언트
  transform: "scaleX(0)", transformOrigin: "left", zIndex: 1001, // 헤더(1000)보다 위
  pointerEvents: "none",
});
```

- [ ] **Step 3: CommentWidget.astro 작성**

```astro
---
// utterances — repo/issue-term/label은 기존과 동일, 테마는 다크모드 연동 (스펙 v2-13 C3)
import { wrapper } from "@/components/Post/CommentWidget.css"; // 실제 export명 사용
---
<div class={wrapper} id="comment-widget"></div>
<script is:inline>
  // 저장된 테마에 맞춰 초기 삽입 (라이트=github-light, 다크=github-dark)
  (() => {
    const dark = localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") && matchMedia("(prefers-color-scheme: dark)").matches);
    const s = document.createElement("script");
    s.src = "https://utteranc.es/client.js";
    s.async = true;
    s.crossOrigin = "anonymous";
    s.setAttribute("repo", "BoubleJ/BoubleJ.github.io");
    s.setAttribute("issue-term", "pathname");
    s.setAttribute("label", "Comment");
    s.setAttribute("theme", dark ? "github-dark" : "github-light");
    document.getElementById("comment-widget").appendChild(s);
  })();
</script>
```

테마 토글 시 실시간 전환: ThemeContext의 toggleTheme에서 utterances iframe으로 postMessage 전송(커스텀 이벤트 `themechange`를 window에 dispatch하고, 여기 인라인 스크립트가 수신해서 `iframe.contentWindow.postMessage({ type: "set-theme", theme: "github-dark" }, "https://utteranc.es")` 호출).

- [ ] **Step 4: 전체 빌드 + 골든 비교 (핵심 게이트)**

Run: `npx astro build && node scripts/compare-golden.mjs dist && node scripts/check-slugs.mjs`
Expected: **URL 집합 완전 일치, 전 포스트 heading id/TOC href 일치, title/canonical/description 일치.** 불일치는 대개 slugger 규칙(한글 id) 또는 TOC 구조 — 개별 원인 수정. rehypeHeadingIds의 한글 slug가 gatsby(github-slugger+deburr)와 다르면 커스텀 slugger로 교체.

수동 확인(preview): 코드 하이라이트(라이트/다크), 복사 버튼 1.5초 체크 전환, TOC 클릭 시 **부드러운 스크롤**로 해당 섹션 이동(+80px 오프셋 — 스펙 v2-11), **스크롤만 해도 현재 섹션이 목차에서 자동 강조되는지(스크롤 스파이 — 스펙 v2-9)**, **스크롤 시 상단 진행률 바가 좌→우로 채워지는지(v2-15)**, utterances 로딩(+다크 연동), 읽기 시간 표기, 뒤로가기 버튼.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat : 포스트 상세 페이지 이식 (MDX 본문/TOC/댓글/복사버튼)"
```

---

### Task 12: 404 + robots.txt + sitemap 마무리

**Files:**
- Create: `src/pages/404.astro`, `public/robots.txt`

- [ ] **Step 1: 404.astro 작성**

기존 404.tsx 마크업 그대로(문구·`<br />` 위치는 원본에서 복사), 죽은 GraphQL 쿼리 미이관. Layout으로 감싸고(원본도 wrapPageElement로 헤더/푸터 있었음) `noMeta` 사용:

```astro
---
import Layout from "@/layouts/Layout.astro";
import { wrapper, code, description, goMain } from "@/pages-styles/404.css"; // 실제 export명 사용
---
<Layout noMeta>
  <div class={wrapper}>
    <div class={code}>404</div>
    <div class={description}>찾을 수 없는 페이지입니다.<br />다른 콘텐츠를 보러 가보시겠어요?</div>
    <a class={goMain} href="/">메인으로</a>
  </div>
</Layout>
```

- [ ] **Step 2: robots.txt — 골든의 `.golden/robots.txt` 내용을 그대로 복사해 `public/robots.txt` 생성**

- [ ] **Step 2.5: 파비콘 생성 (스펙 v2-12)**

`public/favicon.svg` 작성 — 로고 그라디언트 + "B" 모노그램:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#667eea"/><stop offset="1" stop-color="#764ba2"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#g)"/>
  <text x="32" y="45" text-anchor="middle" font-family="-apple-system, 'Segoe UI', sans-serif"
    font-size="38" font-weight="700" fill="#ffffff">B</text>
</svg>
```

구글 SERP 폴백용 `public/favicon.png`(96×96)는 SVG에서 변환 — `rsvg-convert`, `qlmanage`, 또는 agent-browser로 SVG를 열어 스크린샷 후 크롭 등 가용한 방법 중 택일. 브라우저 탭에서 그라디언트 "B"가 보이는지 확인. (파일은 추후 사용자가 원하는 이미지로 교체 가능 — 같은 파일명으로 덮어쓰면 됨)

**대표 OG 이미지 생성 (스펙 v2-10(e))**: `public/og-image.png` (1200×630) — 파비콘과 같은 방식으로 SVG 작성 후 PNG 변환. 디자인: 로고 그라디언트(135deg #667eea→#764ba2) 전면 배경 + 중앙에 "BoubleJ's Blog" 흰색 굵은 텍스트(대략 96px) + 그 아래 SITE.description 요지 한 줄(작은 흰색 텍스트, opacity 0.85). 홈/태그 페이지의 og:image·twitter:image로 쓰이며(Layout 기본값), 검증: 빌드 후 `dist/index.html`에서 `og:image`가 `https://boublej.github.io/og-image.png` 절대 URL인지 grep 확인. 카톡/트위터 미리보기 시뮬레이션은 opengraph.xyz 같은 검사기 또는 agent-browser로 확인 가능.

- [ ] **Step 3: sitemap 확인**

Run: `npx astro build && ls dist/sitemap*`
Expected: `sitemap-index.xml`/`sitemap-0.xml`. `grep -c "<loc>" dist/sitemap-0.xml` — 골든 대비 -1(/post 제외)이면 정상.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat : 404/robots/sitemap 이관"
```

---

### Task 13: CI/배포/도구 전환 + Gatsby 제거 + 최종 검증

**Files:**
- Modify: `.github/workflows/main.yml`, `package.json`, `biome.json`, `lefthook.yml`, `README.md`
- Delete: `gatsby-config.js`, `gatsby-node.js`, `gatsby-browser.js`, `gatsby-ssr.js`, `src/templates/`, 잔여 `src/pages/*.tsx`, `src/components/etc/ProfileImage.*`, `src/components/Template.tsx`, `src/hooks/useInfiniteScroll.tsx`(페이지네이션으로 대체), 미사용 확인 시 `CategoryList`

- [ ] **Step 1: package.json 정리**

```json
"scripts": {
  "develop": "astro dev", "start": "astro dev",
  "build": "astro build", "serve": "astro preview",
  "clean": "rm -rf dist .astro",
  "deploy": "astro build && gh-pages -d dist -b master",
  "lint": "biome check .", "lint:fix": "biome check --write .", "format": "biome format --write ."
}
```

```bash
npm uninstall gatsby gatsby-plugin-canonical-urls gatsby-plugin-image gatsby-plugin-mdx \
  gatsby-plugin-react-helmet gatsby-plugin-robots-txt gatsby-plugin-sharp gatsby-plugin-sitemap \
  gatsby-plugin-typescript gatsby-remark-autolink-headers gatsby-remark-classes \
  gatsby-remark-copy-linked-files gatsby-remark-external-links gatsby-remark-images \
  gatsby-remark-prismjs gatsby-remark-smartypants gatsby-source-filesystem \
  gatsby-transformer-remark gatsby-transformer-sharp react-helmet @types/react-helmet \
  @mdx-js/react ajv ajv-keywords @vanilla-extract/webpack-plugin
```

유지: react/react-dom(^19), @vanilla-extract/css, prismjs(Astro Prism 하이라이터 사용), prism-themes, reading-time, gh-pages, biome/lefthook/typescript. (query-string은 v2-16 B1로 설치하지 않음)

- [ ] **Step 2: GitHub Actions 수정**

변경점: `node-version: "22"`, 타입체크 `npx tsc --noEmit` → `npx astro check`, `upload-pages-artifact`의 `path: ./public` → `path: ./dist`. 트리거/권한/concurrency/deploy 잡 구조는 그대로.

- [ ] **Step 3: biome.json / lefthook.yml 갱신**

- biome.json: domains의 next 제거, 존재하지 않는 `app/**` 제거, `src/content/**` 포맷 제외 여부 결정(mdx는 md처럼 포맷 제외 권장).
- lefthook.yml: glob `"**/*.{ts,tsx,js,jsx,css,astro}"`.

- [ ] **Step 4: 최종 전체 검증 (머지 게이트)**

```bash
npm run lint
npx astro build
node scripts/compare-golden.mjs dist   # 전 항목 ✓
node scripts/check-slugs.mjs           # 53개 일치
```

수동 스모크(preview + agent-browser): `/`(필터·페이지네이션), `/tag/`, 포스트 2개(한글 slug 1, 괄호 slug 1)를 라이트/다크로 기존 배포 사이트와 나란히 비교. 헤더(최초 무애니메이션 + 연속 전환 확인), 카드 애니메이션, 검색(드롭다운/범위/프리필/하이라이트), TOC, 코드 복사, utterances, ScrollToTop, `/post/`가 404인지(의도된 제거).

- [ ] **Step 5: README 갱신 + Commit + 배포 전 확인**

```bash
git add -A
git commit -m "feat : Gatsby 제거 및 Astro 전환 완료 (CI/배포 포함)"
```

main 머지는 곧 실배포다. 머지 전 최종 검증 결과(비교 스크립트 출력 + 스크린샷)를 사용자에게 보여주고 승인 받는다.

---

## 부록 A: Cloudflare R2 이미지 이전 (차후 작업 — 이번 마이그레이션 범위 밖)

사용자 결정: 지금은 코로케이션으로 가고, 추후 이미지를 Cloudflare R2로 옮긴다. 그 시점에 별도 계획으로 실행할 개요:

1. **R2 버킷 + 공개 도메인**: Cloudflare 계정에 R2 버킷 생성(예: `blog-images`), 커스텀 도메인 연결(예: `img.boublej.dev` — r2.dev 개발 URL은 프로덕션 비권장). R2는 **이그레스(전송료) 무료**, 저장 10GB까지 무료 — 이 블로그(65MB)는 사실상 0원.
2. **업로드**: `wrangler r2 object put` 또는 rclone으로 일괄 업로드. 한글 파일명은 업로드 시 URL-safe 키로 변경 권장(예: 해시 or 로마자화) — 이 시점이 파일명 정리 적기.
3. **참조 치환**: 코로케이션된 상대경로 → `https://img.도메인/키` 절대 URL로 일괄 치환(스크립트). 이 경우 Astro 빌드 최적화 대상에서 빠지므로, 최적화를 유지하려면 astro.config에 `image: { domains: ["img.도메인"] }`를 추가하고 `<Image>` 컴포넌트 경유 필요 — 아니면 최적화 포기(플레인 img). 둘 중 택일.
4. **velog CDN 핫링크 40건**: 이 기회에 다운로드해 R2로 이관(외부 서비스 의존 제거 — velog가 핫링크를 차단하면 이미지가 깨질 리스크 해소).
5. **CI**: 새 포스트 이미지 업로드 워크플로(로컬 스크립트 또는 GitHub Actions에서 wrangler) 추가.
6. **롤백 안전망**: 원본 파일은 R2 이전 후에도 저장소에 한 릴리스 주기 동안 보존 후 제거.

## 부록 B: 방문자 수 카운터 (차후 작업 — 사용자 확정: Cloudflare Worker 자작)

마이그레이션 완료 후 별도 작업으로 진행. 개요:

1. **Worker + KV**: `visit` 엔드포인트 — 요청 시 `YYYY-MM-DD` 키와 `total` 키를 +1 하고 `{ today, total }` 반환. 중복 제거: `IP+UA 해시 + 날짜` 키를 TTL 24h로 저장해 같은 방문자는 하루 1회만 집계. CORS는 `https://boublej.github.io`만 허용.
2. **프론트**: 페이지 로드 시 fetch 한 번 → "오늘 N · 전체 M" 표시(표시 위치는 구현 시 결정 — Footer 부근 후보). 실패 시 조용히 미표시(카운터 장애가 블로그를 깨지 않게).
3. **비용/운영**: Workers 무료 티어(일 10만 요청)로 충분. R2 이미지 이전(부록 A)과 같은 Cloudflare 계정 사용. 배포는 wrangler CLI.
4. **선정 사유**: 기술 블로그 특성상 방문자의 광고차단기 사용률이 높은데, 자작 카운터는 공개 차단 목록에 없는 자체 주소라 GA/GoatCounter 대비 집계 누락이 적음(사용자 확정 결정).

## Self-Review 결과

- **스펙 커버리지**: v2 변경 1(/post 제거)→Task 7·9, v2-2(헤더 버그)→Task 8, v2-3(MDX)→Task 3·5·11, v2-4(utterances 완화)→Global Constraints·Task 11, v2-5(React 19)→Task 2. §1 slug→Task 4·11, §3 파이프라인→Task 5·6·11, §4 디자인→vanilla-extract 재사용, §5 인터랙티브→Task 8~11, §6 SEO/배포→Task 7·12·13, §7 죽은 코드→Task 9·13. 공백 없음.
- **주의 지점(구현자용)**: (1) `.css.ts`의 실제 export 명칭은 원본 파일 기준(계획의 이름은 대표값). (2) code-copy.ts의 SVG 2개는 반드시 기존 CopyIcon/CheckIcon 원본에서 복사. (3) MDX 구문 수정은 렌더 결과 불변이 원칙 — 골든 heading id/TOC 비교가 변형을 잡아낸다. (4) compare-golden은 `/post/`를 골든 집합에서 제외하고 비교한다(의도적 완전 제거).
