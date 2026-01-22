import { style } from "@vanilla-extract/css";

export const background = style({
  width: "100%",
  height: "76px",
  backgroundImage: "linear-gradient(60deg, #29323c 0%, #485563 100%)",
  color: "#ffffff",
});

export const wrapper = style({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  maxWidth: "1200px",
  width: "100%",
  height: "80px",
  margin: "0 auto",
  padding: "0 24px",
  "@media": {
    "(max-width: 768px)": {
      height: "300px",
      padding: "0 20px",
    },
  },
});
