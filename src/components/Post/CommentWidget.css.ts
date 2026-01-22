import { style } from "@vanilla-extract/css";

export const utterancesWrapper = style({
  "@media": {
    "(max-width: 768px)": {
      padding: "0 20px",
    },
  },
});
