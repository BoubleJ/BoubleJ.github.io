import { keyframes, style } from "@vanilla-extract/css";

const slideUpFadeIn = keyframes({
  "0%": {
    transform: "translateY(30px)",
    opacity: 0,
  },
  "100%": {
    transform: "translateY(0)",
    opacity: 1,
  },
});

export const postItemWrapper = style({
  display: "flex",
  flexDirection: "column",
  borderRadius: "10px",
  boxShadow: "0 0 8px rgba(0, 0, 0, 0.15)",
  transition: "0.3s box-shadow, 0.3s transform",
  cursor: "pointer",
  textDecoration: "none",
  color: "inherit",
  animation: `${slideUpFadeIn} 0.6s ease-out forwards`,
  opacity: 0,
  ":hover": {
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
    transform: "translateY(-8px)",
  },
});

export const postItemContent = style({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  padding: "15px",
});

export const title = style({
  display: "-webkit-box",
  overflow: "hidden",
  marginBottom: "3px",
  textOverflow: "ellipsis",
  whiteSpace: "normal",
  overflowWrap: "break-word",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  fontSize: "20px",
  fontWeight: 700,
});

export const date = style({
  fontSize: "14px",
  fontWeight: 400,
  opacity: 0.7,
});

export const category = style({
  display: "flex",
  flexWrap: "wrap",
  marginTop: "10px",
  margin: "10px -5px",
});

export const categoryItem = style({
  margin: "2.5px 5px",
  padding: "3px 5px",
  borderRadius: "3px",
  background: "black",
  fontSize: "14px",
  fontWeight: 700,
  color: "white",
});

export const summary = style({
  display: "-webkit-box",
  overflow: "hidden",
  marginTop: "auto",
  textOverflow: "ellipsis",
  whiteSpace: "normal",
  overflowWrap: "break-word",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  fontSize: "16px",
  opacity: 0.8,
});

export const thumbnailImage = style({
  width: "100%",
  height: "200px",
  borderRadius: "10px 10px 0 0",
});
