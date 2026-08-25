import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

// 신규 UI(스펙 v2-6) — 색상은 반드시 기존 테마 토큰만 사용
export const dropdown = style({
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "column",
  border: `1px solid ${vars.color.border}`,
  borderRadius: "8px",
  backgroundColor: vars.color.background,
  // 결과 5개 이상이면 리스트 내부 스크롤 (아이템 74px 기준 4.5개 노출 — 잘린 항목으로 스크롤 가능함을 암시)
  maxHeight: "336px",
  overflowX: "hidden",
  overflowY: "auto",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", // 오버레이로 콘텐츠 위에 뜨므로 구분용
});

export const item = style({
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  width: "100%",
  padding: "10px 16px",
  border: "none",
  borderTop: `1px solid ${vars.color.border}`,
  background: "none",
  textAlign: "left",
  cursor: "pointer",
  color: vars.color.text,
  fontFamily: "inherit",
  transition: "background-color 0.2s",
  selectors: {
    "&:first-child": {
      borderTop: "none",
    },
  },
  ":hover": {
    backgroundColor: vars.color.buttonHoverBg,
  },
});

export const title = style({
  fontSize: "15px",
  fontWeight: 600,
  color: vars.color.text,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const mark = style({
  backgroundColor: "transparent",
  color: vars.color.primary,
  fontWeight: 700,
});

export const summary = style({
  fontSize: "13px",
  color: vars.color.secondary,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const date = style({
  fontSize: "12px",
  color: vars.color.secondary,
});
