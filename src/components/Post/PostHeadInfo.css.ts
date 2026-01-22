import { style } from "@vanilla-extract/css";

export const title = style({
  display: "-webkit-box",
  overflow: "hidden",
  overflowWrap: "break-word",
  marginTop: "auto",
  textOverflow: "ellipsis",
  whiteSpace: "normal",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  fontSize: "45px",
  fontWeight: 800,
  "@media": {
    "(max-width: 768px)": {
      fontSize: "30px",
    },
  },
});

export const postData = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "10px",
  fontSize: "18px",
  fontWeight: 700,
  "@media": {
    "(max-width: 768px)": {
      flexDirection: "column",
      alignItems: "flex-start",
      fontSize: "15px",
      fontWeight: 400,
    },
  },
});

export const postHeadInfoWrapper = style({
  display: "flex",
  flexDirection: "column",
  width: "768px",
  height: "100%",
  margin: "0 auto",
  padding: "60px 0",
  color: "#ffffff",
  "@media": {
    "(max-width: 768px)": {
      width: "100%",
      padding: "40px 20px",
    },
  },
});

export const prevPageIcon = style({
  display: "grid",
  placeItems: "center",
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  background: "#ffffff",
  color: "#000000",
  fontSize: "22px",
  cursor: "pointer",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
  "@media": {
    "(max-width: 768px)": {
      width: "30px",
      height: "30px",
      fontSize: "18px",
    },
  },
});
