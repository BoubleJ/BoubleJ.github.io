import { style } from "@vanilla-extract/css";

export const postListWrapper = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px",
  width: "768px",
  margin: "0 auto",
  padding: "50px 0 100px",
  "@media": {
    "(max-width: 768px)": {
      gridTemplateColumns: "1fr",
      width: "100%",
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
