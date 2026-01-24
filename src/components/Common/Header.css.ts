import { style, keyframes } from "@vanilla-extract/css";

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

const expandSearch = keyframes({
  "0%": {
    maxHeight: "0",
    opacity: 0,
    paddingTop: "0",
    paddingBottom: "0",
  },
  "100%": {
    maxHeight: "200px",
    opacity: 1,
    paddingTop: "16px",
    paddingBottom: "16px",
  },
});

const collapseSearch = keyframes({
  "0%": {
    maxHeight: "200px",
    opacity: 1,
    paddingTop: "16px",
    paddingBottom: "16px",
  },
  "100%": {
    maxHeight: "0",
    opacity: 0,
    paddingTop: "0",
    paddingBottom: "0",
  },
});

export const header = style({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  backgroundColor: "#ffffff",
  borderBottom: "1px solid #e1e4e8",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
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
  color: "#586069",
  fontSize: "16px",
  fontWeight: 500,
  transition: "color 0.2s",
  ":hover": {
    color: "#667eea",
  },
  "@media": {
    "(max-width: 768px)": {
      fontSize: "14px",
    },
  },
});

export const navLinkActive = style({
  color: "#667eea",
  fontWeight: 600,
  position: "relative",
  "::after": {
    content: '""',
    position: "absolute",
    bottom: "-4px",
    left: 0,
    right: 0,
    height: "2px",
    backgroundColor: "#667eea",
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
    backgroundColor: "#f3f4f6",
  },
  ":active": {
    transform: "scale(0.95)",
  },
});

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

export const searchContainerOpen = style({
  animation: `${expandSearch} 0.3s ease-out forwards`,
});

export const searchContainerClosed = style({
  animation: `${collapseSearch} 0.3s ease-out forwards`,
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

export const searchInput = style({
  flex: 1,
  padding: "12px 16px",
  fontSize: "16px",
  border: "2px solid #e0e0e0",
  borderRadius: "8px",
  outline: "none",
  transition: "border-color 0.3s",
  ":focus": {
    borderColor: "#667eea",
  },
  "::placeholder": {
    color: "#999",
  },
  "@media": {
    "(max-width: 768px)": {
      fontSize: "14px",
    },
  },
});

export const searchButton = style({
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
      padding: "12px 20px",
    },
  },
});
