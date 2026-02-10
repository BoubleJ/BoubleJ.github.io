import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const tagPage = style({
  maxWidth: "1200px",
  width: "100%",
  margin: "40px auto 0",
  padding: "0 24px 60px",
  "@media": {
    "(max-width: 768px)": {
      margin: "32px auto 0",
      padding: "0 20px 40px",
    },
  },
});

export const pageTitle = style({
  fontSize: "36px",
  fontWeight: 700,
  margin: "0 0 40px 0",
  color: vars.color.text,
  "@media": {
    "(max-width: 768px)": {
      fontSize: "28px",
      margin: "0 0 32px 0",
    },
  },
});

export const tagListWrapper = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginBottom: "40px",
});

export const tagItem = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 10px",
  borderRadius: "8px",
  textDecoration: "none",
  color: vars.color.text,
  backgroundColor: vars.color.buttonHoverBg,
  border: `1px solid ${vars.color.border}`,
  transition: "all 0.2s ease",
  cursor: "pointer",
  ":hover": {
    backgroundColor: vars.color.primary,
    color: "#ffffff",
    borderColor: vars.color.primary,
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
  },
  "@media": {
    "(max-width: 768px)": {
      padding: "10px 16px",
      fontSize: "14px",
    },
  },
});

export const tagItemActive = style({
  backgroundColor: vars.color.primary,
  color: "#ffffff",
  borderColor: vars.color.primary,
  ":hover": {
    backgroundColor: vars.color.linkHover,
    borderColor: vars.color.linkHover,
  },
});

export const tagName = style({
  fontSize: "12px",
  fontWeight: 600,
  "@media": {
    "(max-width: 768px)": {
      fontSize: "12px",
    },
  },
});

export const tagCount = style({
  fontSize: "12px",
  fontWeight: 400,
  opacity: 0.7,
  "@media": {
    "(max-width: 768px)": {
      fontSize: "12px",
    },
  },
});
