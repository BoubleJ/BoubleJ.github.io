import { style } from "@vanilla-extract/css";

export const postHeadWrapper = style({
  position: "relative",
  zIndex: 0,
  width: "100%",
  height: "400px",
  "@media": {
    "(max-width: 768px)": {
      height: "300px",
    },
  },
});

export const backgroundImage = style({
  position: "absolute",
  zIndex: -1,
  width: "100%",
  height: "400px",
  objectFit: "cover",
  filter: "brightness(0.25)",
  "@media": {
    "(max-width: 768px)": {
      height: "300px",
    },
  },
});
