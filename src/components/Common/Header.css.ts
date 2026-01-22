import { style } from "@vanilla-extract/css";

export const header = style({
  position: "sticky",
  top: 0,
  zIndex: 1000,
  backgroundColor: "#ffffff",
  borderBottom: "1px solid #e1e4e8",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
});

export const headerContainer = style({
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: "64px",
  "@media": {
    "(max-width: 768px)": {
      padding: "0 16px",
      height: "56px",
    },
  },
});

export const logo = style({
  textDecoration: "none",
  color: "inherit",
  ":hover": {
    opacity: 0.8,
  },
});

export const logoText = style({
  fontSize: "20px",
  fontWeight: 700,
  color: "#24292e",
  letterSpacing: "-0.5px",
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
    color: "#0366d6",
  },
  "@media": {
    "(max-width: 768px)": {
      fontSize: "14px",
    },
  },
});
