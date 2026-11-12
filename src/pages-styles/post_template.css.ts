import { globalStyle, keyframes, style } from "@vanilla-extract/css";

export const markdownRenderer = style({
  display: "flex",
  flexDirection: "column",
  maxWidth: "1200px",
  width: "100%",
  margin: "0 auto",
  padding: "40px 24px 100px",
  "@media": {
    "(max-width: 768px)": {
      padding: "40px 20px 100px",
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

const growProgress = keyframes({
  from: { transform: "scaleX(0)" },
  to: { transform: "scaleX(1)" },
});

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
  animationName: growProgress,
  animationDuration: "auto",
  animationTimingFunction: "linear",
  animationFillMode: "both",
  animationTimeline: "scroll(root block)",
});
