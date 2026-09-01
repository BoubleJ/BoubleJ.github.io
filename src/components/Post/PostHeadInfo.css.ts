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
      gap: "4px",
    },
  },
});

export const categoryList = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "6px",
});

// 헤더는 brightness(0.25) 썸네일 위라 배경이 어둡습니다. 흰 테두리와 반투명 배경으로 칩을 세웁니다.
export const categoryItem = style({
  padding: "3px 8px",
  borderRadius: "4px",
  border: "1px solid rgba(255, 255, 255, 0.45)",
  backgroundColor: "rgba(255, 255, 255, 0.14)",
  fontSize: "14px",
  fontWeight: 700,
  lineHeight: 1.5,
  whiteSpace: "nowrap",
  "@media": {
    "(max-width: 768px)": {
      padding: "2px 6px",
      fontSize: "13px",
      fontWeight: 500,
    },
  },
});

export const postMetaRight = style({
  display: "flex",
  alignItems: "center",
  gap: "12px",
});

export const readingTime = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "16px",
  fontWeight: 500,
  opacity: 0.9,
});

export const postHeadInfoWrapper = style({
  display: "flex",
  flexDirection: "column",
  maxWidth: "1200px",
  width: "100%",
  height: "100%",
  margin: "0 auto",
  padding: "60px 24px",
  color: "#ffffff",
  "@media": {
    "(max-width: 768px)": {
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
