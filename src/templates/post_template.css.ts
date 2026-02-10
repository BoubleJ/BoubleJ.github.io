import { style } from "@vanilla-extract/css";

export const postBody = style({
  display: "flex",
  gap: "32px",
  maxWidth: "1200px",
  width: "100%",
  margin: "0 auto",
  padding: "0 24px 100px",
  "@media": {
    "(max-width: 768px)": {
      flexDirection: "column",
      padding: "0 20px 80px",
    },
  },
});

export const postBodyContent = style({
  flex: 1,
  minWidth: 0,
});

export const postBodyToc = style({
  flexShrink: 0,
  width: "200px",
  "@media": {
    "(max-width: 768px)": {
      width: "100%",
      order: -1,
    },
  },
});
