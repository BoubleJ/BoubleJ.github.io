import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const dropdown = style({
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "column",
  border: `1px solid ${vars.color.border}`,
  borderRadius: "8px",
  backgroundColor: vars.color.background,
  maxHeight: "342px",
  overflowX: "hidden",
  overflowY: "auto",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
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
