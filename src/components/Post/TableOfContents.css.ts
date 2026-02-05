import { style } from "@vanilla-extract/css";

export const tocWrapper = style({
  position: "sticky",
  top: "140px",
  maxHeight: "calc(100vh - 160px)",
  overflowY: "auto",
  padding: "16px 14px",
  marginTop: "100px",
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
});

export const tocList = style({
  listStyle: "none",
  margin: 0,
  padding: 0,
});

export const tocItem = style({
  marginBottom: "2px",
  selectors: {
    "&:last-child": {
      marginBottom: 0,
    },
  },
});

export const tocItemLevel1 = style({
  paddingLeft: 0,
  marginTop: "10px",
  selectors: {
    "&:first-child": {
      marginTop: 0,
    },
  },
});

export const tocItemLevel2 = style({
  paddingLeft: "12px",
  borderLeft: "2px solid transparent",
});

export const tocItemLevel3 = style({
  paddingLeft: "24px",
  borderLeft: "2px solid var(--color-border, #e1e4e8)",
});

export const tocItemLevel4 = style({
  paddingLeft: "36px",
  borderLeft: "2px solid var(--color-border, #e1e4e8)",
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
