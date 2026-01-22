import { style } from "@vanilla-extract/css";

export const categoryListWrapper = style({
  display: "flex",
  flexWrap: "wrap",
  maxWidth: "1200px",
  width: "100%",
  margin: "100px auto 0",
  padding: "0 24px",
  "@media": {
    "(max-width: 768px)": {
      marginTop: "50px",
      padding: "0 20px",
    },
  },
});

export const categoryItem = style({
  marginRight: "20px",
  padding: "5px 0",
  fontSize: "18px",
  fontWeight: 400,
  cursor: "pointer",
  ":last-of-type": {
    marginRight: 0,
  },
  "@media": {
    "(max-width: 768px)": {
      fontSize: "15px",
    },
  },
});

export const categoryItemActive = style({
  fontWeight: 800,
});
