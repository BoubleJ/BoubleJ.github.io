import { style } from "@vanilla-extract/css";

export const postListWrapper = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "24px",
  maxWidth: "1200px",
  width: "100%",
  margin: "0 auto",
  padding: "50px 24px 100px",
  "@media": {
    "(max-width: 768px)": {
      gridTemplateColumns: "1fr",
      padding: "50px 20px",
    },
  },
});

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
