// src/scripts/reading-progress.ts — 포스트 읽기 진행률 바 (스펙 v2-15)
const bar = document.getElementById("reading-progress");
if (bar) {
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const progress = max > 0 ? Math.min(scrollY / max, 1) : 0;
    bar.style.transform = `scaleX(${progress})`; // width 대신 transform — 리플로 없음
    ticking = false;
  };
  addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  addEventListener("resize", update, { passive: true });
  update(); // 새로고침으로 중간 위치에서 시작해도 즉시 반영
}
