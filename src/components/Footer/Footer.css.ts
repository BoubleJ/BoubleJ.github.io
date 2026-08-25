import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const footerWrapper = style({
  display: "grid",
  placeItems: "center",
  marginTop: "auto",
  padding: "50px 0",
  backgroundColor: vars.color.footerBg,
  color: vars.color.secondary,
  transition: "background-color 0.2s, color 0.2s",
  fontSize: "15px",
  textAlign: "center",
  lineHeight: 1.5,
  "@media": {
    "(max-width: 768px)": {
      fontSize: "13px",
    },
  },
});
