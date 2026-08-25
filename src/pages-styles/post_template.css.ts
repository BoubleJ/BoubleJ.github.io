import { globalStyle, style } from "@vanilla-extract/css";

// 마크다운 컨테이너 - 레이아웃만 관리 (기존 PostContent.css.ts에서 이동)
export const markdownRenderer = style({
  display: "flex",
  flexDirection: "column",
  maxWidth: "1200px",
  width: "100%",
  margin: "0 auto",
  padding: "100px 24px",
  "@media": {
    "(max-width: 768px)": {
      padding: "100px 20px",
    },
  },
});

export const postBody = style({
  display: "flex",
  gap: "32px",
  maxWidth: "1200px",
  width: "100%",
  margin: "0 auto",
  padding: "0 24px 100px",
  "@media": {
    "(max-width: 768px)": {
      flexDirection: "column",
      padding: "0 20px 80px",
    },
  },
});

export const postBodyContent = style({
  flex: 1,
  minWidth: 0,
});

export const postBodyToc = style({
  flexShrink: 0,
  width: "200px",
  "@media": {
    "(max-width: 768px)": {
      width: "100%",
      order: -1,
    },
  },
});

// v2-15: 포스트 읽기 진행률 바 — 헤더(zIndex 1000)보다 위, 클릭 통과
globalStyle("#reading-progress", {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "3px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  transform: "scaleX(0)",
  transformOrigin: "left",
  zIndex: 1001,
  pointerEvents: "none",
});
