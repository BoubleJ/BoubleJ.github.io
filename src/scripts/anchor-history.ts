// src/scripts/anchor-history.ts — 페이지 내 해시 링크(TOC/헤딩 앵커)가 히스토리를 쌓지 않게 처리
// 클릭마다 해시 엔트리가 push되면 뒤로가기 버튼(history.back)이 이전 페이지 대신
// 해시 이동만 하나씩 되돌리게 됨 — replaceState + scrollIntoView로 대체
document.addEventListener("click", (e) => {
  if (
    e.defaultPrevented ||
    e.button !== 0 ||
    e.metaKey ||
    e.ctrlKey ||
    e.shiftKey ||
    e.altKey
  )
    return;
  const anchor = (e.target as Element).closest?.<HTMLAnchorElement>('a[href^="#"]');
  if (!anchor) return;
  const target = document.getElementById(decodeURIComponent(anchor.hash.slice(1)));
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView(); // CSS scroll-behavior: smooth + scroll-margin-top: 80px 적용
  history.replaceState(history.state, "", anchor.hash);
});
