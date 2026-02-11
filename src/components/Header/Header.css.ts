import { keyframes, style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

const slideDown = keyframes({
  "0%": {
    transform: "translateY(-100%)",
    opacity: 0,
  },
  "100%": {
    transform: "translateY(0)",
    opacity: 1,
  },
});

const slideUp = keyframes({
  "0%": {
    transform: "translateY(0)",
    opacity: 1,
  },
  "100%": {
    transform: "translateY(-100%)",
    opacity: 0,
  },
});

export const header = style({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  backgroundColor: vars.color.background,
  borderBottom: `1px solid ${vars.color.border}`,
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  transition:
    "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, background-color 0.2s, border-color 0.2s",
});

export const headerVisible = style({
  transform: "translateY(0)",
  animation: `${slideDown} 0.3s ease-out`,
});

export const headerHidden = style({
  transform: "translateY(-100%)",
  animation: `${slideUp} 0.3s ease-out`,
});

export const headerContainer = style({
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: "70px",
  "@media": {
    "(max-width: 768px)": {
      padding: "0 16px",
      height: "60px",
    },
  },
});

export const logo = style({
  textDecoration: "none",
  color: "inherit",
  transition: "opacity 0.2s",
  ":hover": {
    opacity: 0.8,
  },
});

export const logoText = style({
  fontSize: "24px",
  fontWeight: 700,
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  letterSpacing: "-0.5px",
  "@media": {
    "(max-width: 768px)": {
      fontSize: "20px",
    },
  },
});

export const nav = style({
  display: "flex",
  gap: "24px",
  alignItems: "center",
  "@media": {
    "(max-width: 768px)": {
      gap: "16px",
    },
  },
});

export const navLink = style({
  textDecoration: "none",
  color: vars.color.secondary,
  fontSize: "16px",
  fontWeight: 500,
  transition: "color 0.2s",
  ":hover": {
    color: vars.color.primary,
  },
  "@media": {
    "(max-width: 768px)": {
      fontSize: "14px",
    },
  },
});

export const navLinkActive = style({
  color: vars.color.primary,
  fontWeight: 600,
  position: "relative",
  "::after": {
    content: '""',
    position: "absolute",
    bottom: "-4px",
    left: 0,
    right: 0,
    height: "2px",
    backgroundColor: vars.color.primary,
    borderRadius: "1px",
  },
});

export const searchIconButton = style({
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "8px",
  transition: "background-color 0.2s",
  ":hover": {
    backgroundColor: vars.color.buttonHoverBg,
  },
  ":active": {
    transform: "scale(0.95)",
  },
});

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

export const searchContainer = style({
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 24px",
  overflow: "hidden",
  "@media": {
    "(max-width: 768px)": {
      padding: "0 16px",
    },
  },
});

export const searchForm = style({
  display: "flex",
  gap: "8px",
  width: "100%",
  "@media": {
    "(max-width: 768px)": {
      flexDirection: "column",
    },
  },
});
