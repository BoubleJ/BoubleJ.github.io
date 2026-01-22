import { style } from "@vanilla-extract/css";

export const notFoundPageWrapper = style({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
});

export const notFoundText = style({
  fontSize: "150px",
  fontWeight: 800,
  "@media": {
    "(max-width: 768px)": {
      fontSize: "100px",
    },
  },
});

export const notFoundDescription = style({
  fontSize: "25px",
  textAlign: "center",
  lineHeight: 1.3,
  "@media": {
    "(max-width: 768px)": {
      fontSize: "20px",
    },
  },
});

export const goToMainButton = style({
  marginTop: "30px",
  fontSize: "20px",
  textDecoration: "underline",
  ":hover": {
    textDecoration: "underline",
  },
});
