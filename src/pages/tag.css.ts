import { style } from "@vanilla-extract/css";

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
  color: "#24292e",
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
  gap: "16px",
  "@media": {
    "(max-width: 768px)": {
      gap: "12px",
    },
  },
});

export const tagItem = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "12px 20px",
  borderRadius: "8px",
  textDecoration: "none",
  color: "inherit",
  backgroundColor: "#f6f8fa",
  border: "1px solid #e1e4e8",
  transition: "all 0.2s ease",
  ":hover": {
    backgroundColor: "#667eea",
    color: "#ffffff",
    borderColor: "#667eea",
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

export const tagName = style({
  fontSize: "16px",
  fontWeight: 600,
  "@media": {
    "(max-width: 768px)": {
      fontSize: "14px",
    },
  },
});

export const tagCount = style({
  fontSize: "14px",
  fontWeight: 400,
  opacity: 0.7,
  "@media": {
    "(max-width: 768px)": {
      fontSize: "12px",
    },
  },
});
