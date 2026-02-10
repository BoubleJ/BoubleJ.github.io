import { style } from "@vanilla-extract/css";

export const button = style({
  position: "fixed",
  right: "24px",
  bottom: "24px",
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  border: "none",
  backgroundColor: "var(--color-bg-secondary, #333)",
  color: "var(--color-text-inverse, #fff)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  transition: "opacity 0.2s, transform 0.2s, visibility 0.2s",
  zIndex: 1000,
  ":hover": {
    opacity: 0.9,
    transform: "scale(1.05)",
  },
  ":focus-visible": {
    outline: "2px solid currentColor",
    outlineOffset: "2px",
  },
  "@media": {
    "(max-width: 768px)": {
      right: "16px",
      bottom: "16px",
      width: "44px",
      height: "44px",
    },
  },
});

export const buttonHidden = style({
  opacity: 0,
  visibility: "hidden",
  pointerEvents: "none",
});
