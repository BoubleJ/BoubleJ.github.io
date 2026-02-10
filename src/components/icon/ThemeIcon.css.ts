import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const themeIcon = style({
  width: "24px",
  height: "24px",
  fill: "none",
  stroke: vars.color.text,
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  transition: "stroke 0.3s ease",
  cursor: "pointer",
});
