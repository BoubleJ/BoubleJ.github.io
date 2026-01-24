import { style } from "@vanilla-extract/css";

export const emptyMessage = style({
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "80px 20px",
    color: "#666",
    fontSize: "18px",
    "@media": {
        "(max-width: 768px)": {
            fontSize: "16px",
            padding: "60px 20px",
        },
    },
});