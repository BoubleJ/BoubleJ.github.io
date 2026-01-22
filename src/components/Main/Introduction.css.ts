import { style } from "@vanilla-extract/css";

export const background = style({
  maxWidth: "1140px",
  height: "76px",
  backgroundImage: "linear-gradient(60deg, #29323c 0%, #485563 100%)",
  color: "#ffffff",
});

export const wrapper = style({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  width: "1050px",
  height: "80px",
  margin: "0 auto",
  "@media": {
    "(max-width: 768px)": {
      width: "100%",
      height: "300px",
      padding: "0 20px",
    },
  },
});
