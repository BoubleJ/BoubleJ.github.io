import { style } from "@vanilla-extract/css";

export const footerWrapper = style({
  display: "grid",
  placeItems: "center",
  marginTop: "auto",
  padding: "50px 0",
  fontSize: "15px",
  textAlign: "center",
  lineHeight: 1.5,
  "@media": {
    "(max-width: 768px)": {
      fontSize: "13px",
    },
  },
});
