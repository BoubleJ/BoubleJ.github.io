import { style } from "@vanilla-extract/css";

// 마크다운 컨테이너 - 레이아웃만 관리
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
