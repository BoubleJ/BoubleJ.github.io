import { style } from "@vanilla-extract/css";
import { searchIconButton, searchIconButtonActive } from "@/components/Header/Header.css";
import { vars } from "@/styles/theme.css";

export const searchIcon = style({
  width: "20px",
  height: "20px",
  color: vars.color.secondary,
  transition: "color 0.2s",
  selectors: {
    [`${searchIconButton}:hover &`]: {
      color: vars.color.primary,
    },
    [`${searchIconButtonActive} &`]: {
      color: vars.color.primary,
    },
  },
});
