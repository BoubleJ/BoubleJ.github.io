import { style } from "@vanilla-extract/css";

export const background = style({
  width: "100%",
  height: "200px",
  backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "@media": {
    "(max-width: 768px)": {
      height: "160px",
    },
  },
});

export const wrapper = style({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  maxWidth: "1200px",
  width: "100%",
  margin: "0 auto",
  padding: "0 24px",
  textAlign: "center",
  "@media": {
    "(max-width: 768px)": {
      padding: "0 20px",
    },
  },
});

export const title = style({
  fontSize: "48px",
  fontWeight: 700,
  margin: "0 0 16px 0",
  letterSpacing: "-1px",
  "@media": {
    "(max-width: 768px)": {
      fontSize: "32px",
    },
  },
});

export const description = style({
  fontSize: "18px",
  fontWeight: 400,
  margin: 0,
  opacity: 0.9,
  "@media": {
    "(max-width: 768px)": {
      fontSize: "16px",
    },
  },
});
