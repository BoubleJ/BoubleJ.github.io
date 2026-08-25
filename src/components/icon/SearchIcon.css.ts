import { style } from "@vanilla-extract/css";
import { searchIconButton } from "@/components/Header/Header.css";
import { vars } from "@/styles/theme.css";

// v2-13 C2: 하드코딩 색(#586069, hover #667eea) → 테마 토큰
export const searchIcon = style({
  width: "20px",
  height: "20px",
  color: vars.color.secondary,
  transition: "color 0.2s",
  selectors: {
    [`${searchIconButton}:hover &`]: {
      color: vars.color.primary,
    },
  },
});
