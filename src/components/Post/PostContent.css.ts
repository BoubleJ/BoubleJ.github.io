import { style, globalStyle } from "@vanilla-extract/css";

export const markdownRenderer = style({
  display: "flex",
  flexDirection: "column",
  maxWidth: "1200px",
  width: "100%",
  margin: "0 auto",
  padding: "100px 24px",
  wordBreak: "break-all",
  "@media": {
    "(max-width: 768px)": {
      padding: "100px 20px",
    },
  },
});

globalStyle(`${markdownRenderer} h1`, {
  marginTop: "60px",
  marginBottom: "30px",
});

globalStyle(`${markdownRenderer} h2`, {
  marginTop: "20px",
  marginBottom: "10px",
});

globalStyle(`${markdownRenderer} h3`, {
  marginTop: "10px",
  marginBottom: "5px",
});

globalStyle(`${markdownRenderer} p`, {
  margin: "3px 0",
  lineHeight: 1.4,
});

globalStyle(`${markdownRenderer} blockquote`, {
  margin: "10px 0px",
  padding: "15px",
  borderLeft: "3px solid #d2d7df",
  backgroundColor: "#f6f8fa",
  color: "#72757b",
});

globalStyle(`${markdownRenderer} ol, ${markdownRenderer} ul`, {
  marginLeft: "20px",
  padding: "5px 0",
});

globalStyle(`${markdownRenderer} li`, {
  padding: "6px 0",
});
