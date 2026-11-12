import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const searchPositioner = style({
  position: "relative",
  width: "100%",
});

export const searchContainer = style({
  overflow: "hidden",
  maxHeight: 0,
  opacity: 0,
  transition: "max-height 0.3s ease-out, opacity 0.3s ease-out",
});

export const searchContainerOpen = style({ maxHeight: "200px", opacity: 1 });
export const searchContainerClosed = style({ maxHeight: 0, opacity: 0 });

export const searchContainerSettled = style({ overflow: "visible" });

export const searchInner = style({
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 24px 16px",
  "@media": {
    "(max-width: 768px)": {
      padding: "0 16px 16px",
    },
  },
});

export const dropdownOverlay = style({
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  zIndex: 1000,
});

export const dropdownOverlayInner = style({
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 24px",
  "@media": {
    "(max-width: 768px)": {
      padding: "0 16px",
    },
  },
});

export const searchForm = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  width: "100%",
  "@media": {
    "(max-width: 768px)": {
      gap: "6px",
    },
  },
});

export const scopeSelect = style({
  padding: "12px 8px",
  fontSize: "16px",
  border: `2px solid ${vars.color.inputBorder}`,
  borderRadius: "8px",
  outline: "none",
  backgroundColor: vars.color.background,
  color: vars.color.text,
  cursor: "pointer",
  transition: "border-color 0.3s, background-color 0.2s, color 0.2s",
  ":focus": {
    borderColor: vars.color.primary,
  },
  "@media": {
    "(max-width: 768px)": {
      fontSize: "14px",
    },
  },
});

export const searchInputWrapper = style({
  position: "relative",
  flex: 1,
  minWidth: 0,
  display: "flex",
});

export const clearTermButton = style({
  position: "absolute",
  top: "50%",
  right: "10px",
  transform: "translateY(-50%)",
  display: "grid",
  placeItems: "center",
  width: "22px",
  height: "22px",
  padding: 0,
  border: "none",
  borderRadius: "50%",
  background: "transparent",
  color: vars.color.secondary,
  cursor: "pointer",
  transition: "color 0.15s ease, background-color 0.15s ease",
  ":hover": {
    color: vars.color.text,
    backgroundColor: vars.color.buttonHoverBg,
  },
  ":focus-visible": {
    outline: `2px solid ${vars.color.primary}`,
    outlineOffset: "1px",
  },
});

export const searchInput = style({
  width: "100%",
  minWidth: 0,
  padding: "12px 38px 12px 16px",
  fontSize: "16px",
  border: `2px solid ${vars.color.inputBorder}`,
  borderRadius: "8px",
  outline: "none",
  backgroundColor: vars.color.background,
  color: vars.color.text,
  transition: "border-color 0.3s, background-color 0.2s, color 0.2s",
  ":focus": {
    borderColor: vars.color.primary,
  },
  "::placeholder": {
    color: vars.color.placeholder,
  },
  "@media": {
    "(max-width: 768px)": {
      fontSize: "14px",
    },
  },
});

export const searchButton = style({
  flexShrink: 0,
  whiteSpace: "nowrap",
  padding: "12px 24px",
  fontSize: "16px",
  fontWeight: 600,
  color: "#ffffff",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "opacity 0.3s, transform 0.2s",
  ":hover": {
    opacity: 0.9,
  },
  ":active": {
    transform: "scale(0.98)",
  },
  "@media": {
    "(max-width: 768px)": {
      fontSize: "14px",
      padding: "12px 14px",
    },
  },
});
