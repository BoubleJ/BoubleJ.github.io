import { globalStyle } from "@vanilla-extract/css";
import { vars } from "./theme.css";

globalStyle("*", {
  padding: 0,
  margin: 0,
  boxSizing: "border-box",
});

globalStyle("html, body, #app", {
  backgroundColor: vars.color.background,
  color: vars.color.text,
  transition: "background-color 0.2s ease, color 0.2s ease",
});

globalStyle("html, body", {
  height: "100%",
});

// 본문 글꼴. 라틴 폰트를 앞에 두어 U+2026(…)이 베이스라인에 놓이게 한다 —
// CJK 폰트는 동아시아 조판 관습대로 말줄임표를 세로 가운데에 그리기 때문.
// 한글은 뒤쪽 한국어 폰트로 폴백된다. 웹폰트는 받지 않는다(시스템 폰트만).
globalStyle("html", {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", sans-serif',
});

// #app에 확정 높이(height:100%)를 주면 main(height:100%)이 뷰포트 높이로 고정되어
// 본문이 넘쳐흐르고 Footer가 콘텐츠 중간에 겹침 — min-height + flex column으로
// 콘텐츠만큼 늘어나게 하고, 짧은 페이지에서는 Footer(margin-top:auto)가 하단 고정됨
globalStyle("#app", {
  display: "flex",
  flexDirection: "column",
  minHeight: "100%",
});

globalStyle("a", {
  color: "inherit",
  textDecoration: "none",
});

globalStyle("a:hover", {
  color: vars.color.linkHover,
  cursor: "pointer",
});

globalStyle(".autolink-header", {
  opacity: 0,
  transition: "opacity 0.15s ease",
});

// gatsby-remark-autolink-headers의 `before` 배치 재현.
// 앵커는 헤딩의 첫 자식으로 삽입되므로, 절대 위치로 헤딩(position:relative) 바깥 왼쪽에 빼내야
// 인라인 흐름에서 빠져 제목 좌측에 빈 여백이 생기지 않는다.
globalStyle(".autolink-header.before", {
  position: "absolute",
  left: 0,
  top: 0,
  bottom: 0,
  transform: "translateX(-100%)",
  paddingRight: "4px",
  display: "inline-flex",
  alignItems: "center",
  // 터치 환경엔 hover가 없어 노출될 일이 없고, 본문 밖으로 삐져나가 가로 스크롤이 생기는 것도 막는다
  "@media": {
    "(max-width: 768px)": {
      display: "none",
    },
  },
});

globalStyle(
  "h1:hover .autolink-header, h2:hover .autolink-header, h3:hover .autolink-header, .autolink-header:focus-visible",
  {
    opacity: 1,
  },
);

globalStyle("h1[id], h2[id], h3[id]", {
  scrollMarginTop: "80px", // gatsby-remark-autolink-headers offsetY: 80 대응
});
// v2-11: TOC/앵커 클릭 시 부드러운 스크롤 이동 (reduced-motion 사용자는 즉시 이동)
globalStyle("html", { scrollBehavior: "smooth" });
globalStyle("html", {
  "@media": { "(prefers-reduced-motion: reduce)": { scrollBehavior: "auto" } },
});
