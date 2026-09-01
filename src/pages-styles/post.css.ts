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
  color: vars.color.text,
  "@media": {
    "(max-width: 768px)": {
      fontSize: "28px",
    },
  },
});

// 검색 결과 제목은 "모든 포스트"보다 한 단계 작게 둔다
export const pageTitleSearch = style({
  fontSize: "28px",
  "@media": {
    "(max-width: 768px)": {
      fontSize: "22px",
    },
  },
});

// 제목 안에서 검색어만 강조 — 어떤 조건으로 걸러진 목록인지 한눈에 보이게
export const searchTermMark = style({
  color: vars.color.primary,
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
