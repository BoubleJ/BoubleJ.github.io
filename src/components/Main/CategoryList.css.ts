import { style } from "@vanilla-extract/css";

export const categoryListWrapper = style({
  display: "flex",
  flexWrap: "wrap",
  width: "768px",
  margin: "100px auto 0",
  "@media": {
    "(max-width: 768px)": {
      width: "100%",
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
