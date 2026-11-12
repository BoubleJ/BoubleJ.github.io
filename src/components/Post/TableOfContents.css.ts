import { globalStyle, style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const tocWrapper = style({
  position: "sticky",
  top: "140px",
  padding: "16px 14px",
  marginTop: "40px",
  minWidth: "260px",
  borderRadius: "12px",
  backgroundColor: vars.color.codeBg,
  border: `1px solid ${vars.color.border}`,
  "@media": {
    "(max-width: 768px)": {
      padding: "12px 10px",
      borderRadius: "10px",
    },
  },
});

export const tocTitle = style({
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  color: vars.color.secondary,
  marginBottom: "14px",
  paddingBottom: "10px",
  borderBottom: `1px solid ${vars.color.border}`,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const tocScrollArea = style({
  maxHeight: "400px",
  overflowY: "auto",
});

export const tocList = style({
  listStyle: "none",
  margin: 0,
  padding: 0,
});

globalStyle(`${tocList} ul`, {
  listStyle: "none",
  margin: 0,
  padding: 0,
});

globalStyle(`${tocList} a`, {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

globalStyle(`${tocList} > ul > li a`, {
  paddingLeft: "8px",
});

globalStyle(`${tocList} > ul > li > ul li a`, {
  paddingLeft: "20px",
});

globalStyle(`${tocList} > ul > li > ul > li > ul li a`, {
  paddingLeft: "32px",
});

export const tocLink = style({
  fontSize: "0.8125rem",
  lineHeight: 1.5,
  color: vars.color.text,
  textDecoration: "none",
  display: "block",
  padding: "6px 8px",
  borderRadius: "6px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  transition: "color 0.15s ease, background-color 0.15s ease",
  ":hover": {
    color: vars.color.primary,
    backgroundColor: vars.color.buttonHoverBg,
  },
  ":focus-visible": {
    outline: `2px solid ${vars.color.primary}`,
    outlineOffset: "2px",
  },
});

export const tocLinkActive = style({
  color: vars.color.primary,
  backgroundColor: vars.color.buttonHoverBg,
  fontWeight: 600,
});
