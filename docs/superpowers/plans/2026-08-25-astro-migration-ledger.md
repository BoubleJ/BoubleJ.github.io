# SDD ledger — plan: docs/superpowers/plans/2026-08-25-astro-migration.md

Spec: docs/superpowers/plans/2026-08-25-astro-migration-spec.md (v2 의도된 변경 16건 포함 — 스펙이 최종 권위)

## Pre-flight conflict scan (2026-08-25)

| 쌍/태스크 | 검사 내용 | 결과 |
|---|---|---|
| T1↔T13 | compare-golden이 /post/를 골든에서 제외 vs T13 스모크가 /post/ 404 확인 | 일치 (의도적 제거) |
| T2↔T5 | astro.config가 T5의 rehype-autolink-headers를 import | 계획에 "T5 전까지 주석 처리" 명시 — 일치 |
| T2↔T3 | T3의 MDX 오류 색출이 컬렉션 정의(T4 Step1) 필요 | 계획에 "순서 조정 허용" 명시 — 일치 |
| T3↔T4 | 폴더 구조({이름}/index.mdx) vs glob pattern "*/index.mdx" + check-slugs 디렉토리 순회 | 일치 |
| T4↔T9/T10 | toPostSummary {id,slug,title,summary,date,categories,thumbnail} vs 소비측 | 일치 |
| T6↔T11 | TableOfContents headings props vs [slug].astro가 depth≤3 필터 후 전달 (컴포넌트도 내부 필터 — 이중 필터 무해) | 일치 |
| T7↔T8 | Layout이 Header import — T7 빌드 확인은 T8 선행 필요 가능 | 계획에 "실패 시 T8 먼저" 명시 — 일치 |
| T7↔T8 | A1 인라인 스크립트의 테마 판정 ↔ ThemeContext 판정 동일성 | T7 주의사항에 명시 — 일치 |
| T8 내부 | Files에 "ThemeContext 무수정 목표" vs v2-16 A1/C3가 ThemeContext 수정 요구 | **충돌** → Ruling 1 |
| T9↔T10 | PostList 페이지네이션/개수 표시를 태그 페이지가 동일 소비 | 일치 |
| T12↔T7 | favicon/og-image 파일 생성(T12) vs Layout 링크(T7) — T7 빌드 시 파일 부재 | 링크는 정적 경로라 빌드 실패 없음(404만) — 허용, T12에서 해소 |
| T13 | 삭제 목록에 useInfiniteScroll/ProfileImage/Template 포함, 의존성 정리 | 스펙 §7과 일치 |
| 각 태스크 자체 일관성 | 테스트/검증 스텝과 코드 스텝 대조 | 모순 없음 |

Ruling 1: ThemeContext는 T8에서 Modify 대상이다(초기 state를 body 클래스에서 읽기 + themechange 이벤트 dispatch) — 스펙 v2-16 A1·v2-13 C3가 요구하므로 T8 Files의 "무수정 목표" 표기보다 스펙이 우선. — 틀렸을 경우 비용: ThemeContext 재작업 소폭.

Ruling 2: 별도 git worktree 대신 현재 체크아웃에서 feature/astro-migration 브랜치로 진행한다 — T1의 골든 마스터 생성이 기존 node_modules(gatsby)를 필요로 하고 계획 자체가 브랜치 생성을 명시(T1 Step 4). main 직접 작업 아님. — 틀렸을 경우 비용: 브랜치 전환으로 복구 가능, 낮음.

## Task progress
Task 1: implementer DONE_WITH_CONCERNS (ae390cd). 자기검증 113/113 통과.
Ruling 3: compare-golden의 INTENTIONALLY_REMOVED 필터를 dist 쪽에도 적용한 구현자 수정을 승인 — 자기검증(골든 vs 골든) 요구가 계획 원문과 물리적으로 충돌했고, /post/ 잔존 미검출 리스크는 T13 수동 스모크(/post/ 404 확인)가 커버. — 틀렸을 경우 비용: /post/가 실수로 생성되어도 스크립트가 못 잡음(낮음, 스모크로 보완).
Task 1: review — Critical 1건(htmlPages 루트가 "//"로 계산, / description 제외 무동작), Important 1건(distUrls 필터 — Ruling 3으로 종결), Minor 2건(deferred): DESCRIPTION_CHANGED Set 루프 내 재생성, readdirSync 에러 핸들링 부재. ⚠️ 3건은 컨트롤러가 직접 확인 완료(브랜치/커밋/골든 91항목 정상).
Task 1: fix round 1/5 시작 (open: htmlPages 루트 URL 버그)
Task 1: fix round 1/5 (1 addressed, 0 open — htmlPages 루트 URL 버그; commits ae390cd..197061d)
Task 1: complete (commits 603379e..197061d, review clean)
Task 2: implementer DONE_WITH_CONCERNS (6b8281d). concerns: cookie 이중패키지→재설치로 해결, --legacy-peer-deps 사용(허용됨), 구 .tsx 페이지 경고(후속 태스크에서 해소), git add -A에서 docs/ 제외(컨트롤러가 별도 커밋 1604a6d로 처리). 컨트롤러 부가 커밋: docs 1604a6d, .superpowers gitignore.
Task 2: review — spec ✅, quality Approved + Important 1건(.gitignore의 public 항목이 rename 후 소스 무시). fix round 1/5 시작.
Task 2: fix round 1/5 (1 addressed, 0 open — .gitignore public 제거; commits 8829da6..956e8c5)
Task 2: complete (commits 197061d..956e8c5, review clean)
Ruling 4: 고아 이미지 19개의 git rm은 태스크 중 실행하지 않고 목록만 수집, 마이그레이션 완료 보고 시 사용자에게 목록 제시 후 승인받아 처리한다 — 계획이 "사용자 승인 후 삭제"를 명시(파괴적 작업은 정지 대상). — 틀렸을 경우 비용: 없음(지연만).
Task 3: implementer DONE_WITH_CONCERNS (e475d6e). 53 이동, 이미지 190 콜로케이션/1 공유/7 gif, MDX 수정 6파일 8건, BOM 1건 제거, 빌드 54페이지 성공. execFileSync 전환(셸 보간 사고 회피) — 타당. 고아 13(raw 16, NFC/NFD 오탐 3) 목록 보고서에 보존 — Ruling 4 대기.
주의(사용자 보고용): 40건의 velog 참조가 실제로는 "/image/https://velog..." 형태의 깨진 참조로 확인됨(기존 사이트에서도 동일하게 깨져 있었을 가능성) — 마이그레이션 범위 밖, 최종 보고에 포함할 것.
Task 3: review — spec ✅, quality Approved + Important 1건(보고서가 MDX 수정 1건 미기재: 타입스크립트 제대로 사용하기의 <br> 수정. 실제 수정은 8파일/약 12라인).
Ruling 5: 보고서 기재 누락은 코드 결함이 아니며, 리뷰어가 203개 변경 라인 전수를 분류·검증 완료 — 픽스 라운드 없이 렛저의 정정 기록(8파일/12라인)이 공식 기록을 대체한다. — 틀렸을 경우 비용: 없음(기록 문제).
Ruling 6: "html 파서 만들기"의 \<p> 이스케이프는 렌더 결과가 변하는 수정이지만 승인 — 골든 확인 결과 기존 사이트는 이 <p>가 실제 태그로 파싱되어 문장이 중간에 끊기고 텍스트가 보이지 않는 깨진 렌더였음. 새 렌더가 저자 의도(태그를 텍스트로 표기)와 일치. — 틀렸을 경우 비용: 해당 문단 표기 차이 1곳(육안 확인됨).
Task 3: complete (commits 956e8c5..e475d6e, review clean — deferred: 고아 13건 사용자 승인 대기(Ruling 4), velog 깨진 참조 40건 최종 보고 항목)
Task 4: complete (commits e475d6e..f546248, review clean). check-slugs 53/53 일치(URL 보존 기계 검증). ⚠️: 계획 문서 Task4 Interfaces의 낡은 서술 — 컨트롤러가 문서 정정 커밋으로 해소.
Task 5: complete (commits 8c239e5..f74f18d, review clean). autolink 앵커 52/53 포스트 검증(1개는 헤딩 없음 — 정상), SVG 원본 일치, A4 셀렉터 수정 완료. 참고: Astro 직렬화가 style 트레일링 세미콜론 제거(position:relative) — 시각 무차이, 리뷰어 검증 승인.
Task 6: implementer DONE_WITH_CONCERNS (597940a). concern: astro check 1 error — 구 post_template.tsx가 옛 tocHtml prop 사용(과도기 부채, Task 13에서 templates/ 삭제로 해소 예정 — Task 13 디스패치에 "astro check 0 error 확인" 명시할 것).
Task 6: complete (commits f74f18d..597940a, review clean). buildTree depth-스킵 트레이스 통과, 래퍼/클래스 유지 확인.
Task 13 인계 메모: (1) astro check/tsc가 과도기 부채(post_template.tsx tocHtml, astro:content 사전 에러)로 현재 실패 — templates/ 삭제 후 astro check 0 error를 T13 검증 게이트에 포함. (2) CI 타입체크 스텝 교체 확인.
Task 7: complete (commits 597940a..4db8bcf, review clean). 메타/테마 스크립트/컨테이너/삭제 전부 검증. 참고: T7 구현자가 T8 범위 일부를 선반영 — ThemeContext 초기 state(body 클래스 읽기), ScrollToTop.css.ts 토큰화(C2) — 리뷰어 검증 완료. T8 디스패치에 중복 방지 명시.
minor (deferred): src/consts.ts:5의 낡은 "실행 전 사용자 확정 필요" 주석 — description은 확정됨. T13 정리에서 제거.
Task 8: complete (commits 4db8bcf..c2dbcf5, review clean). keyframes 삭제·B6·검색 인덱스/드롭다운/scope/프리필/C2/C3 전부 검증. minor (deferred): useSearch 프리필 ref 대입 중복(no-op), 디바운스 수동 clear 중복(무해), 드롭다운 방향키 탐색 없음(후속 UX 후보).
Task 9: implementer DONE (7c62f36).
Ruling 7: `/` title의 아포스트로피 엔티티 표기 차이(&#x27; vs &#39;)는 시각 동일 문자 — compare-golden의 title/description 비교에 엔티티 정규화를 추가해 해소한다(Task 11 디스패치에 포함). — 틀렸을 경우 비용: 비교 완화 폭이 문자 참조 정규화에 한정되므로 낮음.
Ruling 8: ?category= 필터가 원본 Gatsby에서도 실제로 동작하지 않았음이 확인됨(카테고리 필터 로직 부재, CategoryList는 데드 코드) — 패리티 원칙에 따라 그대로 보존, 최종 보고에서 사용자에게 고지. — 틀렸을 경우 비용: 사용자가 필터 동작을 기대했다면 후속 소작업 필요.
Task 9: review — Important 2건 + Minor. Important#1(search+page 딥링크 리셋)은 fix round 1/5로.
Ruling 9: Pagination 활성 버튼의 #ffffff 하드코딩 수용 — 기존 사이트가 primary 배경 위 흰 글자를 #ffffff 리터럴로 쓰는 관례 다수(검색 버튼 등), on-primary 전용 토큰이 원 테마에 없음. — 틀렸을 경우 비용: 토큰화 소작업.
Ruling 10: mark 하이라이트 색(#fff3a0 라이트/rgba(255,214,51,.35) 다크) 수용 — 강조용 토큰이 원 테마 계약에 없고 라이트/다크 쌍이 각각 정의되어 다크모드 이질감 없음. — 틀렸을 경우 비용: 토큰화 소작업.
minor (deferred): PostPageClient fetch abort cleanup 없음(MPA라 실질 위험 낮음).
Task 9: fix round 1/5 (1 addressed, 0 open — 딥링크 페이지 리셋; commits 7c62f36..91deca7)
Task 9: complete (commits c2dbcf5..91deca7, review clean)
Task 10: review — spec ✅ Approved. ⚠️(태그 토글 시 페이지 미리셋 — 무리로드 필터 변경의 유일 소비자)를 컨트롤러가 실제 갭으로 확정 → fix round 1/5 (filterKey prop 방식, 딥링크 보존 설계 지정).
Task 10: fix round 1/5 (1 addressed, 0 open — filterKey 페이지 리셋; commits 78becda..7fba5dd)
Task 10: complete (commits 91deca7..7fba5dd, review clean)
minor (deferred): filterKey join(",")의 잠재 충돌(태그명에 콤마 포함 시) — 현 데이터 무해, 주석/구분자 개선 후보.
Task 11: implementer DONE (18ca6ac). 게이트: build 55p, slugs 53/53, compare-golden 잔여 3건.
Ruling 11: /CRA와-Vite/의 TOC 여분 1항목 수용 — 원문에 실존하는 리스트-중첩 헤딩을 gatsby(mdast-util-toc)가 누락했던 것. 새 TOC가 실제 문서 구조에 더 정확, 앵커 동작 정상. — 틀렸을 경우 비용: 해당 포스트 TOC 항목 1개 표시 차이.
Ruling 12: DX 포스트 헤딩 2개의 slug 차이 수용 — 원문 헤딩의 인라인 <code>를 gatsby는 원시 문자열째 슬러그화(부정확), 새 slugger는 렌더 텍스트 기준(정확). 내부 TOC/앵커는 신규 id로 일관 동작, 깨지는 건 해당 2개 헤딩으로의 외부 공유 #해시뿐(발생 가능성 극히 낮음). — 틀렸을 경우 비용: 외부 해시 링크 2개 단절.
Ruling 13: compare-golden 스크립트는 엄격하게 유지(예외 하드코딩 안 함) — 최종 게이트에서 잔여 편차가 렛저의 승인 목록(Ruling 11/12)과 정확히 일치하는지 컨트롤러가 대조한다. /404/는 Task 12 후 해소 예정. — 틀렸을 경우 비용: 최종 게이트 수동 대조 1회.
참고: Layout canonical의 decodeURI 수정(한글 URL 인코딩 차이) — 실버그 수정, 리뷰에서 검증 대상.
Task 11: complete (commits 7fba5dd..18ca6ac, review clean). 스파이/복사/진행률/댓글 다크연동/엔티티 정규화/decodeURI 전부 검증.
minor (deferred→Task 12에 포함): 포스트 페이지의 og:url이 인코딩된 채 canonical(디코딩됨)과 불일치 — [slug].astro의 url도 decodeURI 일관화 1줄.
Task 12: review — spec ✅, Important 1건(compare-golden 404 특례)·Minor 1건(보고서 인용).
Ruling 14: compare-golden의 /404/ 평면 파일(404.html) 폴백을 소급 승인 — Astro가 404를 평면으로만 출력하는 구조적 제약 대응이며, 리뷰어 검증 결과 이 변경으로 /404/ 내용 비교가 처음으로 가능해져 오히려 엄격해짐(리터럴 "/404/" 한정, 은폐 없음). Ruling 13의 취지(회귀 은폐 금지)와 합치. — 틀렸을 경우 비용: 없음(검증 강화).
Ruling 15: 보고서 인용("골든 404 head를 확인해 다르면 보고")은 조작이 아님 — 컨트롤러 디스패치 지시문에 실재하는 문구(SDD 문서 밖이라 리뷰어가 못 찾음). 오탐 종결.
Task 12: fix round 1/5 시작 (404 canonical 골든 패리티 1줄).
Task 12: fix round 1/5 (1 addressed, 0 open — 404 canonical; commits a8d73e1..668e3a3)
Task 12: complete (commits 18ca6ac..668e3a3, review clean). compare-golden 잔여 = 기승인 편차(Ruling 11/12)만.
Task 13: complete (commits 668e3a3..3db45d5, review clean).
수동 스모크(컨트롤러 직접, preview+agent-browser): 헤더 무애니메이션 로드·연속 전환, FOUC 없음(body 테마 클래스 선적용), 총 개수 표시, 페이지네이션(aria-current), object-fit cover, 라이브 드롭다운 8건+mark, Enter 제출→프리필+15건 필터+하이라이트, 포스트 상세(진행률 바·smooth scroll·복사버튼 8개·TOC 18링크+스파이 활성·utterances·og:type article·og:image 절대), 다크모드 토글+localStorage+원복, 태그 딥링크 ?tags=React%2CTypescript OR 필터 18건 — 전부 통과.
최종 전체 브랜치 리뷰(fable): NOT READY→READY WITH FIXES. Critical 1(C-1 인라인 테마 스크립트 dark 변수 섀도잉 — 다크 경로 FOUC 무효, 계획 코드가 심은 버그), Minor 4(M-1 lock name 잔재, M-2 페이지네이션 popstate 미청취, M-3 검색 필터 로직 중복, M-4 og-image.svg 미참조, M-5 scripts lint 범위 밖). v2 16건 커버리지 15/16(A1만 결함). 보안/배포 점검 이상 없음. deferred minors 전부 "보류 가능" 판정.
Ruling 16: 최종 픽스 웨이브 범위 = C-1 + M-1 + M-4. M-2(같은 문서 내 뒤로가기 페이지 비동기화 — 스펙 요구 아님·엣지), M-3(로직 중복 — 리팩터 후보), M-5(무해)는 보류, 최종 보고에 기재. — 틀렸을 경우 비용: 후속 소작업.
최종 픽스 웨이브 1/1 시작.
최종 픽스 웨이브 1/1 (3 addressed, 0 open — C-1/M-1/M-4; commits 3db45d5..c809de9). 재리뷰 클린.
전체 완료: 13 태스크 + 최종 리뷰 + 픽스 웨이브. 브랜치 feature/astro-migration, main..HEAD 22커밋, 388파일. 머지 대기(배포 트리거 = 사용자 승인 필요).
사용자 대기 항목: (1) 고아 이미지 13개 git rm 승인, (2) main 머지(=실배포) 승인.
