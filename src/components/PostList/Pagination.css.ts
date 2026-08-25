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
  transition: "background-color 0.2s, border-color 0.2s, color 0.2s",
  ":hover": {
    backgroundColor: vars.color.buttonHoverBg,
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
