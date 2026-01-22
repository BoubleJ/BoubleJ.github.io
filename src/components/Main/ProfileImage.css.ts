import { style } from "@vanilla-extract/css";

export const profileImageWrapper = style({
  width: "120px",
  height: "120px",
  marginBottom: "30px",
  borderRadius: "50%",
  "@media": {
    "(max-width: 768px)": {
      width: "80px",
      height: "80px",
    },
  },
});
