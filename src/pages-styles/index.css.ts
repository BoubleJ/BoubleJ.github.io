import { style } from "@vanilla-extract/css";

export const postsSection = style({
  maxWidth: "1200px",
  width: "100%",
  margin: "60px auto",
  padding: "60px 24px",
  "@media": {
    "(max-width: 768px)": {
      margin: "40px auto",
      padding: "40px 20px",
    },
  },
});

export const sectionTitle = style({
  fontSize: "32px",
  fontWeight: 700,
  margin: "0 0 32px 0",
  color: "#24292e",
  "@media": {
    "(max-width: 768px)": {
      fontSize: "24px",
      margin: "0 0 24px 0",
    },
  },
});

export const postListWrapper = style({
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gridTemplateRows: "repeat(2, 1fr)",
  gap: "24px",
  marginBottom: "48px",
  "@media": {
    "(max-width: 1024px)": {
      gridTemplateColumns: "repeat(2, 1fr)",
      gridTemplateRows: "repeat(4, 1fr)",
    },
    "(max-width: 768px)": {
      gridTemplateColumns: "1fr",
      gridTemplateRows: "auto",
      gap: "20px",
      marginBottom: "32px",
    },
  },
});

export const moreButton = style({
  display: "block",
  width: "100%",
  maxWidth: "400px",
  margin: "0 auto",
  padding: "16px 32px",
  fontSize: "16px",
  fontWeight: 600,
  textAlign: "center",
  textDecoration: "none",
  color: "#ffffff",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  borderRadius: "8px",
  transition: "opacity 0.3s, transform 0.2s",
  ":hover": {
    opacity: 0.9,
    transform: "translateY(-2px)",
  },
  ":active": {
    transform: "translateY(0)",
  },
  "@media": {
    "(max-width: 768px)": {
      padding: "14px 24px",
      fontSize: "14px",
    },
  },
});
