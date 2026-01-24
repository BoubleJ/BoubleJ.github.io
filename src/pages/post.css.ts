import { style } from "@vanilla-extract/css";

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
  margin: "0 0 40px 0",
  color: "#24292e",
  "@media": {
    "(max-width: 768px)": {
      fontSize: "28px",
      margin: "0 0 32px 0",
    },
  },
});
