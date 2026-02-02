import { style } from "@vanilla-extract/css";

export const tocWrapper = style({
  position: "sticky",
  top: "100px",
  maxHeight: "calc(100vh - 120px)",
  overflowY: "auto",
});

export const tocTitle = style({
  fontSize: "0.875rem",
  fontWeight: 600,
  marginBottom: "12px",
  color: "var(--color-text-secondary, #666)",
});

export const tocList = style({
  listStyle: "none",
  margin: 0,
  padding: 0,
});

export const tocItem = style({
  marginBottom: "6px",
});

export const tocItemLevel2 = style({
  paddingLeft: 0,
});

export const tocItemLevel3 = style({
  paddingLeft: "12px",
});

export const tocItemLevel4 = style({
  paddingLeft: "24px",
});

export const tocLink = style({
  fontSize: "0.8125rem",
  color: "var(--color-text-secondary, #666)",
  textDecoration: "none",
  display: "block",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  ":hover": {
    color: "var(--color-primary, #333)",
  },
});
