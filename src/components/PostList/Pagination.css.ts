import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const pagination = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "6px",
  flexWrap: "wrap",
  margin: "8px auto 60px",
  padding: "0 24px",
  maxWidth: "1200px",
  "@media": {
    "(max-width: 768px)": {
      margin: "4px auto 40px",
      padding: "0 20px",
    },
  },
});

const buttonBase = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "36px",
  height: "36px",
  padding: "0 10px",
  border: `1px solid ${vars.color.border}`,
  borderRadius: "6px",
  background: "transparent",
  color: vars.color.text,
  fontSize: "14px",
  fontWeight: 500,
  cursor: "pointer",
  textDecoration: "none",
  transition: "background-color 0.2s, border-color 0.2s, color 0.2s",
  // <a>로 렌더되므로 전역 a:hover의 링크 색상이 적용되지 않도록 색을 명시한다
  ":hover": {
    backgroundColor: vars.color.buttonHoverBg,
    color: vars.color.text,
  },
  ":disabled": {
    opacity: 0.4,
    cursor: "not-allowed",
    backgroundColor: "transparent",
  },
});

export const navButton = style([buttonBase, { padding: "0 14px" }]);

export const pageButton = style([buttonBase, {}]);

export const pageButtonActive = style({
  backgroundColor: vars.color.primary,
  borderColor: vars.color.primary,
  color: "#ffffff",
  ":hover": {
    backgroundColor: vars.color.primary,
    color: "#ffffff",
  },
});

export const ellipsis = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "36px",
  height: "36px",
  color: vars.color.secondary,
  fontSize: "14px",
});
