import { globalStyle, style } from "@vanilla-extract/css";

export const tocWrapper = style({
  position: "sticky",
  top: "140px",
  padding: "16px 14px",
  marginTop: "100px",
  minWidth: "260px",
  borderRadius: "12px",
  backgroundColor: "var(--color-codeBg, #f6f8fa)",
  border: "1px solid var(--color-border, #e1e4e8)",
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
  color: "var(--color-secondary, #586069)",
  marginBottom: "14px",
  paddingBottom: "10px",
  borderBottom: "1px solid var(--color-border, #e1e4e8)",
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
  color: "var(--color-text, #24292e)",
  textDecoration: "none",
  display: "block",
  padding: "6px 8px",
  borderRadius: "6px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  transition: "color 0.15s ease, background-color 0.15s ease",
  ":hover": {
    color: "var(--color-primary, #0969da)",
    backgroundColor: "var(--color-buttonHoverBg, rgba(0,0,0,0.04))",
  },
  ":focus-visible": {
    outline: "2px solid var(--color-primary, #0969da)",
    outlineOffset: "2px",
  },
});

export const tocLinkActive = style({
  color: "var(--color-primary, #0969da)",
  backgroundColor: "var(--color-buttonHoverBg, rgba(9,105,218,0.06))",
  fontWeight: 600,
});
