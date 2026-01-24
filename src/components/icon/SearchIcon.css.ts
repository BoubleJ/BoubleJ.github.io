import { style } from "@vanilla-extract/css";
import { searchIconButton } from "@/components/Header/Header.css";

export const searchIcon = style({
    width: "20px",
    height: "20px",
    color: "#586069",
    transition: "color 0.2s",
    selectors: {
        [`${searchIconButton}:hover &`]: {
            color: "#667eea",
        },
    },
});