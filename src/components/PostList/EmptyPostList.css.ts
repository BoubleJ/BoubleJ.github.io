import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const emptyMessage = style({
  gridColumn: "1 / -1",
  textAlign: "center",
  padding: "80px 20px",
  color: vars.color.secondary,
  fontSize: "18px",
  "@media": {
    "(max-width: 768px)": {
      fontSize: "16px",
      padding: "60px 20px",
    },
  },
});
