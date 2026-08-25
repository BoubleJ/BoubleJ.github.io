import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const postsPage = style({
  maxWidth: "1200px",
  width: "100%",
  margin: "40px auto 0",
  padding: "0 24px 60px",
  "@media": {
    "(max-width: 768px)": {
      margin: "32px auto 0",
      padding: "0 20px 40px",
    },
  },
});

export const pageTitle = style({
  fontSize: "36px",
  fontWeight: 700,
  margin: "0 0 12px 0",
  color: "#24292e",
  "@media": {
    "(max-width: 768px)": {
      fontSize: "28px",
      margin: "0 0 10px 0",
    },
  },
});

// v2-14: 필터된 전체 포스트 개수 표시 — 작은 보조 텍스트
export const postCount = style({
  margin: "0 0 32px 0",
  fontSize: "14px",
  color: vars.color.secondary,
  "@media": {
    "(max-width: 768px)": {
      margin: "0 0 24px 0",
    },
  },
});
