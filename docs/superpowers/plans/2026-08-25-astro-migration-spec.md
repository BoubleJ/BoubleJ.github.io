# Astro 마이그레이션 스펙 — 기능 전수 조사 결과

> 2026-08-25, 멀티 에이전트 감사(에이전트 6개, 툴 호출 133회)로 확인된 사실만 기록.
> 목표: 기존 디자인과 기능을 유지하며 Gatsby 5 → Astro 5 마이그레이션. **단, 아래 v2 의도된 변경 16건은 예외.**

## v2 의도된 변경 (사용자 승인, 2026-08-25)

1. **`/post/` 경로 완전 제거** — `/`가 전체 포스트 목록(+`?category=`/`?search=` 필터)을 담당. `/post/`는 리다이렉트 없이 제거(접속 시 404 — 방문자가 거의 없어 구 링크 보존 불필요, 사용자 결정). 네비게이션은 Home/Tags 2개.
2. **헤더 애니메이션 버그 수정** — 실사이트에서 확인된 버그 2건: (a) 최초 진입 시 slideDown 애니메이션이 재생되며 헤더가 내려옴 → 최초에는 즉시 표시로 수정. (b) 빠른 위아래 스크롤 방향 전환 시 keyframes가 고정 시작값에서 재시작되어 헤더가 점프/깜빡임(측정: 숨김 진행 중 top -24px 상태에서 방향 전환 시 -65px로 순간이동 후 재슬라이드, slideDown의 opacity 0→1로 깜빡임) → keyframes 제거, transform+transition 기반으로 수정(현재 위치에서 부드럽게 이어짐).
3. **MDX 전환** — 53개 .md를 .mdx로 변환, `@astrojs/mdx` 사용, 콘텐츠를 `src/content/posts/`로 이동(원본 .md가 배포 루트에 복사되던 부수 동작은 소멸 — 링크된 곳 없음 확인).
4. **utterances 제약 해제** — 실 댓글 0개 확인(GitHub API로 검증: Comment 라벨 이슈 1개는 삭제된 테스트 포스트 경로). URL 보존은 이제 댓글이 아닌 **SEO(검색 색인) 목적**으로만 유지.
5. **React 19 업그레이드** — react/react-dom ^19 + @astrojs/react 최신. 재사용 컴포넌트는 함수형+훅만 사용하므로 호환.
6. **검색 UX 개편 (올리브영 테크블로그 스타일 라이브 드롭다운)** — 기존 "제출 → 페이지 이동 → 필터" 방식을 개편:
   - **라이브 드롭다운**: 헤더 검색창에 타이핑하면(디바운스 ~150ms) 검색바 하단에 매칭 포스트 드롭다운(제목·요약·날짜, 최대 8개)이 즉시 표시, 클릭 시 해당 포스트로 이동. 모든 페이지에서 동작. (oliveyoung.tech의 searchDropdown 패턴 — 실사이트 DOM 확인으로 검증됨)
   - **검색 범위 셀렉트**: 검색창 옆 드롭다운박스로 `전체 / 제목 / 본문` 선택. URL 파라미터 `?scope=title|content`(전체는 파라미터 없음).
   - **본문 전문 검색**: 빌드 타임에 전 포스트의 plain text 인덱스(`/search-index.json`)를 생성, 검색창 첫 포커스 시 lazy fetch. 53개 포스트 기준 수백 KB 수준.
   - **Enter 제출 시**: 기존처럼 `/?search=…(&scope=…)`로 이동해 전체 결과를 목록으로 표시. 이때 **검색창에 검색어 프리필** + 목록 카드의 제목/요약 매칭 부분 `<mark>` 하이라이트.
   - ~~검색 결과 개수 표시는 하지 않음~~ → **v2-14로 대체됨(목록 개수 표시 — 사용자 재결정)**.
   - 검색 아코디언의 max-height 200px 고정 한계는 드롭다운 수용을 위해 콘텐츠 기반 높이로 수정.
   - 이 항목은 검색 영역에 한해 "디자인 동일" 원칙의 예외(신규 UI 추가)임.
7. **이미지 포스트별 코로케이션** — 본문 이미지를 `src/content/posts/{포스트}/` 폴더에 포스트와 동봉하고 상대경로 참조로 전환(Astro가 빌드 시 최적화). 예외: 여러 포스트가 공유하는 이미지와 .gif(애니메이션 보존)는 `public/image/` 유지, 썸네일 43개는 frontmatter/og:image 특성상 `public/thumbnail/` 유지. 고아 이미지 19개는 목록 확인 후 삭제. 현황: image/ 211개(60MB) + thumbnail/ 43개(4.7MB), 본문 참조 199건(절대경로) + velog CDN 핫링크 40건. **차후 Cloudflare R2 이전 예정**(계획 부록 참조).
8. **무한 스크롤 → 페이지네이션 전환** — 목록(`/`, `/tag/`)의 IntersectionObserver 무한 스크롤을 제거하고 번호형 페이지네이션(페이지당 10개 — 기존 배치 크기 유지)으로 교체. 페이지 상태는 `?page=N` 쿼리 파라미터로 URL 동기화(클라이언트 사이드 — 검색/카테고리/태그 필터와 조합 가능, 필터 변경 시 1페이지로 리셋, 페이지 이동 시 목록 상단으로 스크롤). 정적 라우트(`/page/2/`)는 만들지 않으므로 URL 집합 비교에 영향 없음. `useInfiniteScroll` 훅은 이관하지 않는다. 페이지네이션 UI는 신규 디자인(테마 토큰 기반) — 검색 드롭다운과 함께 "디자인 동일" 원칙의 예외.
9. **TOC 스크롤 스파이** — 기존 hashchange 전용 활성화(클릭했을 때만 강조)를 스크롤 스파이로 교체: 본문 h1~h3를 IntersectionObserver로 관찰해 현재 읽고 있는 섹션의 목차 링크를 자동 강조. 고정 헤더 오프셋(80px)을 rootMargin으로 보정. 목차 클릭 시 즉시 해당 링크 활성(기존 클릭 동작 유지), 이후 스크롤하면 스파이가 이어받음. 활성 스타일(tocLinkActive)은 기존 것 그대로 사용.
10. **검색엔진 스니펫/사이트명 개선** — 구글 검색 결과가 meta description("개발하며 궁금한 점을 정리하는 블로그", 13자) 대신 본문의 포스트 요약을 스니펫으로 쓰는 문제(실SERP 확인) 대응: (a) meta description을 다음 문구로 확정(**사용자 확정 완료**): "React, Next.js, TypeScript 등 프론트엔드 개발을 하며 마주친 문제와 해결 과정, 궁금했던 점을 깊이 있게 정리하는 BoubleJ의 기술 블로그입니다.", (b) og:site_name을 페이지 title이 아닌 사이트명 고정값("BoubleJ's Blog")으로 수정(기존 버그성 동작 폐기), (c) 홈에 WebSite JSON-LD(name/description/url) 추가, (d) `twitter:site`/`twitter:creator`의 "@사용자이름" 플레이스홀더 **제거**(X 계정 없음 — 사용자 확정), (e) **목록 페이지(홈/태그) 대표 og:image 추가** — 현재는 존재하지 않는 profile-image 참조로 `og:image=""` 빈 태그가 렌더됨 → 브랜드 OG 이미지(`public/og-image.png`, 1200×630, 로고 그라디언트 배경 + "BoubleJ's Blog" 텍스트)를 생성해 카톡/슬랙/트위터 공유 미리보기에 표시(사용자 확정). og:image는 항상 절대 URL로 출력. 단, 스니펫 최종 선택권은 구글에 있어 100% 보장은 불가 — 짧고 일반적인 문구일수록 구글이 무시하므로 구체화가 핵심.
11. **TOC 부드러운 스크롤 이동** — 목차 링크(및 본문 헤딩 앵커) 클릭 시 해당 섹션으로 즉시 점프하는 대신 부드럽게 스크롤하며 이동. 구현: 전역 CSS `html { scroll-behavior: smooth }` + 기존 계획의 `scroll-margin-top: 80px`(고정 헤더 보정) 조합 — JS 불필요. `prefers-reduced-motion: reduce` 사용자는 즉시 이동으로 폴백(접근성). 페이지네이션의 목록 상단 이동은 `behavior: "instant"`로 명시해 스무스 대상에서 제외(목록 교체와 동시라 어지러움 방지). 스크롤 스파이(v2-9)와 자연스럽게 연동됨.
12. **파비콘 추가** — 현재 사이트에는 파비콘이 전혀 없어 브라우저 탭과 구글 검색 결과에 기본(지구본) 아이콘이 표시됨. 로고 그라디언트(135deg #667eea→#764ba2) 배경에 "B" 모노그램 SVG 파비콘(`public/favicon.svg`) + 구글 SERP용 96×96 PNG 폴백(`public/favicon.png`)을 생성하고 Layout `<head>`에 `<link rel="icon">` 2종 추가. 파일은 추후 사용자가 원하는 이미지로 교체 가능. (기존 "파비콘 없음 유지" 제약 폐기)
13. **시각 디테일 개선 3건 (사용자 선택 C1~C3)** — 기존 "버그성 동작 유지" 항목들을 폐기하고 개선:
    - **C1** 카드 썸네일에 `object-fit: cover` 추가 — 비율 안 맞는 이미지가 왜곡되는 대신 잘리도록.
    - **C2** 테마 무시 고정색 토큰화 — ScrollToTop(#333/#fff 폴백), EmptyPostList(#666), 검색 아이콘(#586069→hover #667eea 하드코딩)을 vars.color.* 테마 토큰으로 교체(다크모드에서 자연스럽게).
    - **C3** utterances 댓글 다크모드 연동 — 초기 로드 시 저장된 테마에 맞는 utterances 테마(`github-light`/`github-dark`)로 삽입하고, 테마 토글 시 utterances iframe에 postMessage(`{ type: "set-theme", theme }`)로 실시간 전환.
    - (C4 시스템 테마 변경 실시간 반영은 **사용자 결정으로 제외** — matchMedia change 리스너 없음 유지.)
14. **목록 포스트 개수 표시** — 모든 목록 화면(`/` 기본 목록, `?search=`/`?category=` 필터 결과, `/tag/` 태그 필터 결과)의 목록 상단에 **현재 조건에 해당하는 포스트 개수**를 표시. 필터가 없으면 전체 개수(예: "총 53개의 포스트"), 검색/카테고리/태그 필터 적용 시 필터된 개수. 개수는 페이지네이션 슬라이스가 아닌 **필터된 전체 기준**. 스타일은 신규 UI 원칙대로 테마 토큰(vars.color.secondary) 기반 작은 텍스트, 페이지 제목 아래 배치. (v2-6의 "개수 표시 안 함" 결정을 대체 — 사용자 재결정)
15. **읽기 진행률 바 (reading progress bar)** — 포스트 상세 페이지 상단(뷰포트 최상단, `position: fixed; top: 0`)에 스크롤 진행률만큼 좌→우로 채워지는 얇은 바(높이 3px) 추가. 색상은 로고 그라디언트(135deg #667eea→#764ba2), z-index는 헤더(1000)보다 위(1001). 진행률 = `scrollY / (문서 전체 높이 - 뷰포트 높이)`, 성능을 위해 `transform: scaleX()` + rAF 스로틀로 갱신(width 변경 아님 — 리플로 방지). 포스트 상세에만 적용(목록 페이지는 읽기 진행 개념이 없어 제외). 참고 사례: coding-maggot.tistory.com.
16. **구조 개선 A/B 8건 (사용자 승인 — "Gatsby 맹목 재현" 제거)**:
    - **A1** 다크모드 FOUC 제거 — `<head>` 인라인 스크립트가 첫 페인트 전에 localStorage/prefers-color-scheme을 판정해 body에 테마 클래스를 적용(판정 로직은 기존 ThemeContext와 동일). 기존의 "라이트 첫 페인트 후 전환" 재현 폐기 — MPA에서는 페이지 이동마다 번쩍이므로 필수.
    - **A2** og:image 절대 URL — v2-10(e)에 이미 포함(Layout이 모든 og:image를 절대 URL로 변환).
    - **A3** TOC 컴포넌트 렌더 — tableOfContents HTML 문자열 재현·innerHTML 주입·런타임 tocLink 클래스 부여를 전부 폐기하고, `render()`의 headings 배열(depth≤3)을 받아 중첩 리스트를 컴포넌트로 직접 렌더(클래스도 렌더 시 부여). 골든 비교는 TOC href 집합 기준으로 유지, `<p>` 래핑 등 마크업 구조 재현 의무는 해제.
    - **A4** markdown-* 클래스 rehype 플러그인 삭제 — markdown.css의 인라인 코드 셀렉터를 `.markdown-content code:not([class*='language-'])`로 수정하면 래퍼 후손 셀렉터만으로 전체 커버(§3-3의 클래스 부착 의무 해제).
    - **A5** 읽기 시간 본문만 계산 — frontmatter 포함 원문 전체 입력(기존 버그) 폐기, `entry.body`만 입력. 표시값 ±1분 변동 허용.
    - **B1** query-string 의존성 제거 — URLSearchParams로 통일(중복 파라미터 처리의 미세 차이는 허용).
    - **B2** 외부 링크 `rel="nofollow noopener"` (noopener 추가).
    - **B3** 포스트 상세 `og:type=article`, 그 외 페이지 website.
    - **B6** 헤더 스크롤 리스너를 ref 기반으로 정리(스크롤마다 리스너 재등록되던 원본 비효율 제거 — 동작 동일).

## 1. URL 체계 (v2 반영)

| 경로 | 내용 | 쿼리스트링 |
|---|---|---|
| `/` | **전체 포스트 목록** (페이지네이션) | `?category=`, `?search=`, `?scope=`, `?page=` (클라이언트 필터) |
| `/post/` | **제거** (리다이렉트 없음 → 404) | — |
| `/tag/` | 태그 목록 + 필터된 포스트 | `?tags=a,b` (콤마는 %2C 인코딩) |
| `/{slug}/` | 포스트 상세 (루트 바로 아래, 프리픽스 없음) | 없음 |
| `/404/`, `404.html` | 404 페이지 | 없음 |

- trailing slash **always** (Gatsby 5 기본값).
- **slug 규칙**: 파일명(확장자 제외) → `trim()` → `replace(/\s+/g, "-")`. 한글·쉼표·괄호·마침표 등 특수문자 **그대로 유지**, 대소문자 유지. 예: `내부 DNS, 외부 DNS.md` → `/내부-DNS,-외부-DNS/`, `프로그래머스 문자열 내 마음대로 정렬하기 (레벨1).md` → 괄호 유지. (SEO 색인 보존 목적)
- 페이지네이션은 `?page=N` 쿼리 파라미터(클라이언트 사이드 — v2 변경 8). 정적 페이지 라우트는 없음.

## 2. 콘텐츠

- 소스: `static/contents/*.md` **53개** (전부 .md, .mdx 없음, 평평한 구조).
- frontmatter 5필드 전부 실질 필수: `date`(문자열 "YYYY-MM-DD"), `title`, `categories`(문자열 배열), `summary`, `thumbnail`("/thumbnail/*.png" 절대경로).
- 1개 파일이 **UTF-8 BOM**으로 시작 (`로깅과 비즈니스 로직 분리를 통한 선언적 컴포넌트 관리.md`).
- 날짜 표시 포맷: `YYYY.MM.DD.` (**끝 마침표 포함**).
- 정렬: date DESC → 동률 시 title DESC (**코드포인트 비교**, localeCompare 아님 — Gatsby 내부는 lodash orderBy).
- **실제 렌더링은 100% markdownRemark(HTML 문자열) 경로.** gatsby-plugin-mdx는 설정만 있고 allMdx 쿼리는 전부 주석 처리된 죽은 코드 → MDX 마이그레이션 불필요.

## 3. 마크다운 변환 파이프라인 (HTML 출력 동일해야 함)

1. **smartypants** `dashes: "oldschool"` — 곧은따옴표→굽은따옴표, `--`→en dash, `---`→em dash. 본문 텍스트가 바이트 단위로 달라지므로 필수.
2. **prismjs** `classPrefix: "language-"` — `<div class="gatsby-highlight" data-language="x"><pre class="language-x"><code class="language-x">` + 토큰 span. 사이트 CSS는 `.gatsby-highlight`에 의존하지 않음(`pre[class*='language-']`와 `.markdown-content pre`만 사용).
3. **classes 매핑** — h1→`markdown-h1`, h2→`markdown-h2`, h3→`markdown-h3`, p→`markdown-p`, blockquote→`markdown-blockquote`, ul→`markdown-ul`, ol→`markdown-ol`, li→`markdown-li`, a→`markdown-a`, code→`markdown-code`, pre→`markdown-pre`. CSS는 `.markdown-content h1, .markdown-h1` 이중 셀렉터라 래퍼 셀렉터만으로도 커버되지만 인라인 코드 셀렉터는 **v2-16 A4에 따라 `.markdown-content code:not([class*='language-'])`로 수정** — 클래스 부착 플러그인은 재현하지 않음.
4. **images** maxWidth 768 — **실질 무동작** (본문 이미지가 전부 `/image/` 절대경로 199건 + velog CDN 외부 URL 40건, 상대경로 0건 → gatsby-remark-images는 상대경로만 처리). 본문 이미지는 플레인 `<img>` 원본 그대로.
5. **copy-linked-files** — 실질 무동작.
6. **external-links** — `target="_blank"`, rel은 ~~nofollow만~~ → **v2-16 B2: `nofollow noopener`**.
7. **autolink-headers** — h1~h3에 id 부여(github-slugger: 한글 유지, 공백→하이픈, 소문자화, removeAccents=deburr) + 헤딩에 인라인 `style="position:relative;"` + 내부에 체인 SVG 앵커 `<a href="#퍼센트인코딩" aria-label="{텍스트} permalink" class="autolink-header before">`. offsetY 80(앵커 이동 시 80px 스크롤 보정). 아이콘 SVG는 gatsby-config.js에 있는 16x16 체인 아이콘 원본을 그대로 사용.

- **TOC**: ~~tableOfContents HTML 문자열 구조 재현~~ → **v2-16 A3: headings 배열 기반 컴포넌트 렌더**. href 퍼센트 인코딩·헤딩 id(비인코딩 한글) 매칭·maxDepth 3은 유지.
- **읽기 시간**: reading-time@1.5.0 유지, 입력은 ~~frontmatter 포함 원문 전체~~ → **v2-16 A5: 본문(entry.body)만**. 출력 `text` = "N min read" 영어 그대로(표시값 ±1분 변동 허용).

## 4. 디자인 시스템

- **vanilla-extract** 전면 사용. `theme.css.ts`: createThemeContract로 17개 색 토큰, lightTheme(GitHub 라이트 팔레트)/darkTheme(GitHub 다크 팔레트). 테마 적용 = `document.body.className`을 테마 클래스로 **통째로 대입**(추가 아님).
- **웹폰트 없음** — 전역 font-family 선언 자체가 없음(브라우저/OS 기본 폰트). 추가하면 디자인이 달라짐. 유일한 예외: 인라인 코드 monospace 스택.
- GlobalStyle: 전 요소 리셋, `html, body, #___gatsby { height:100% }` 체인(Footer margin-top:auto 하단 고정의 전제), 전역 a 호버색, `.autolink-header` 기본 opacity 0 → 헤딩 호버/focus-visible 시 1.
- markdown.css.ts: 본문 요소 스타일 + 코드 복사 버튼 스타일 + **다크모드 Prism 오버라이드**(`body.${darkTheme}` 셀렉터, GitHub Dark Dimmed 색).
- Prism 라이트 테마: `prism-themes/themes/prism-ghcolors.min.css` 전역 import.
- 레이아웃: 고정 헤더(70px, 모바일 60px) + main(max-width 1200px, padding-top 70px/60px) + Footer. 반응형 브레이크포인트 768px.
- 포스트 카드: 등장 시 slideUpFadeIn 0.6s + `animationDelay = (index % 10) * 0.1s` 스태거, 호버 시 -8px 리프트. 썸네일 `<img>` height 200px 고정, ~~object-fit 없음(왜곡 허용)~~ → **v2-13 C1: object-fit cover**. 카테고리 뱃지는 테마 무관 검정 배경 고정.
- PostHead: 썸네일 배경 `filter: brightness(0.25)`, 흰 글자, 뒤로가기 버튼 = `history.back()`.
- ScrollToTop: ~~미정의 CSS 변수 폴백으로 항상 #333/#fff~~ → **v2-13 C2: 테마 토큰화**. 400px 임계값 유지.
- EmptyPostList: ~~`#666` 고정색~~ → **v2-13 C2: 테마 토큰화**. 문구 3종: 검색어 있음 → "검색된 포스팅이 없습니다.", 카테고리 있음 → `"{카테고리}" 카테고리에 포스트가 없습니다.`, 그 외 → "포스트가 없습니다.".

## 5. 인터랙티브 기능

- **다크모드**: localStorage 'theme' → 없으면 prefers-color-scheme 판정(기존 로직 유지). ~~FOUC 방지 스크립트 없음~~ → **v2-16 A1: head 인라인 스크립트로 첫 페인트 전 적용**. matchMedia 변경 리스너 없음(기존 유지 — C4 제외 결정). 토글 시 localStorage 저장.
- **헤더 스크롤**: scrollY<10 항상 표시, 아래스크롤 && scrollY>100 숨김, 위스크롤 표시. passive 리스너. ~~첫 로드 시 slideDown 애니메이션 1회 재생~~ → **v2 변경 2: keyframes 제거, 최초 즉시 표시 + transition 기반 전환**. 활성 네비 링크는 pathname **정확 일치**(`/`, `/tag/`) — 포스트 상세에선 아무것도 활성 안 됨.
- **검색**: 아이콘 클릭 → max-height 0↔200px 아코디언(초기 로드 시 collapse 애니메이션 1회 실행됨), 열리면 input 자동 focus. 제출: trim → 값 있으면 `/?search=${encodeURIComponent(v)}`, 빈 값이면 `/` 이동 (**v2 변경 1** — 기존 `/post` 대상에서 변경). placeholder "포스트 제목, 요약으로 검색...". 필터: title/summary 소문자 includes. query-string 파싱 규칙: category는 빈 문자열이면 무시, search는 빈 문자열도 유효.
- ~~**무한 스크롤**: IntersectionObserver, 10개 단위~~ → **v2 변경 8: 페이지네이션(10개/페이지, `?page=N`)으로 교체.** useInfiniteScroll 훅과 count 미리셋 동작은 이관하지 않음.
- **태그 페이지**: useState+useEffect, 클릭 토글 → `navigate('/tag?tags=' + join(','))` (URLSearchParams.set 인코딩). 태그는 개수 내림차순 정렬, `#태그명 (개수)` 표기, OR 필터.
- ~~**TOC 활성화**: hashchange 이벤트에서만 active~~ → **v2 변경 9: IntersectionObserver 스크롤 스파이로 교체** (읽는 위치를 자동 추적, 80px 헤더 오프셋 보정). 주입된 HTML의 a에 런타임으로 tocLink 클래스를 부여하는 구조는 유지.
- **코드 복사 버튼**: 런타임 DOM 주입(pre마다 button append). 클릭 → clipboard.writeText(execCommand 폴백) → .copied + CheckIcon 1500ms → 원복. aria-label 3단계(코드 복사/복사 완료/복사 실패). pre:hover 시에만 노출.
- **댓글**: utterances(`https://utteranc.es/client.js`), repo `BoubleJ/BoubleJ.github.io`, issue-term `pathname`, label `Comment`, ~~theme github-light 고정~~ → **v2-13 C3: 다크모드 연동**. 위젯은 유지하되 기존 댓글 보존 제약은 없음(v2 변경 4).
- **ScrollToTop**: 마운트 시 즉시 1회 판정, smooth 스크롤, 숨김 시 tabIndex -1 + pointer-events none.

## 6. SEO / 메타 / 배포

- Template(react-helmet)이 삽입: title, google-site-verification(`32VgiXrbX9YRCfnd2p5rqMCm5eNlviCqwzzD5oUo1jw` — **반드시 유지**), description, viewport, Content-Type, og:type=website 고정, og:title/description/image/url, og:site_name(=페이지 title과 동일 값 — 사이트명 아님), twitter:card=summary, twitter:site/creator=`@사용자이름`(플레이스홀더), `<html lang="ko">`.
- 페이지별 title: `/`=`BoubleJ's Blog`, `/post/`=`BoubleJ's Blog - Posts`, `/tag/`=`BoubleJ's Blog - Tags`, 상세=포스트 제목. **404는 메타 전무**(Template 미사용).
- profile-image 파일이 실존하지 않아 목록 페이지 og:image는 빈 문자열(기존 동작). 포스트 og:image = thumbnail 상대경로 그대로. 포스트 og:url = location.href(정적 HTML엔 비어 있음).
- ~~파비콘 없음~~ → **v2 변경 12: 파비콘 추가**. RSS 없음, 애널리틱스 없음.
- sitemap: `sitemap-index.xml` + `sitemap-0.xml`. robots.txt: 전체 허용 + Sitemap 라인. canonical: 쿼리스트링 제거된 절대 URL.
- 배포: GitHub Actions (main push → Node 18 + npm ci → `tsc --noEmit` → `gatsby build` → upload `./public` → deploy-pages). 수동 경로: `gh-pages -d public -b master`.
- 개발 도구: Biome 2.x(린트/포맷), lefthook pre-commit(biome check --write), tsconfig paths `@/*`→src, `static/*`.

## 7. 죽은 코드 / 이관 제외 대상

- `ProfileImage` 컴포넌트(GatsbyImage 유일 사용처) — **어디서도 import 안 됨. 이관 금지**(gatsby-plugin-image 의존 제거).
- gatsby-plugin-image / gatsby-plugin-sharp(이중 등록) / gatsby-transformer-sharp / ajv / ajv-keywords — 실사용 없음.
- allMdx 쿼리, PostContent의 MDX 분기, 404.tsx의 죽은 GraphQL 쿼리, Header.css.ts의 미사용 search 스타일 중복.
- `CategoryList` 컴포넌트 — 사용처 불명. 실행 시 grep으로 확인 후 미사용이면 제외.

## 8. 허용된 동작 편차

**SPA→MPA 전환의 구조적 차이** (사용자 체감상 무시 가능 수준):

1. 페이지 이동이 클라이언트 라우팅 → 풀 페이지 로드로 바뀜(Gatsby Link prefetch 소멸).
2. 페이지 이동 간 헤더/테마 리액트 상태가 리마운트됨 — 테마는 localStorage 재적용으로 동일 결과, 검색창은 원래도 navigate 후 닫힘.
3. 뒤로가기 스크롤 복원이 Gatsby 세션스토리지 방식 → 브라우저 네이티브 방식.
4. 포스트 og:url이 빌드 타임 절대 URL로 채워짐(기존: 정적 HTML에서 비어 있고 런타임에 채워짐 — 개선이지만 편차임을 명시).

**v2 의도된 변경으로 인한 편차** (문서 상단 v2 섹션 참조):

5. `/post/` 소멸(리다이렉트), 네비게이션 Home/Tags 2개, 검색이 `/?search=`로 이동.
6. 헤더 표시/숨김이 keyframes → transition 기반(최초 진입 애니메이션 없음, 방향 전환 시 현재 위치에서 연속 전환).
7. `/contents/*.md` 원본 파일이 배포 산출물에서 제외됨(콘텐츠가 src/content로 이동).
8. 코로케이션된 본문 이미지의 출력 마크업이 플레인 `<img src="/image/...">`에서 Astro 최적화 이미지(`/_astro/*.webp`, width/height/lazy 속성)로 바뀜 — 시각적 결과는 동일하나 파일 URL이 달라짐(구 이미지 URL을 직접 링크한 외부 문서가 있다면 깨짐 — 알려진 것 없음).
