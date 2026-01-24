import { globalStyle } from "@vanilla-extract/css";

globalStyle("*", {
  padding: 0,
  margin: 0,
  boxSizing: "border-box",
});

globalStyle("html, body, #___gatsby", {
  height: "100%",
});

globalStyle("a", {
  color: "black",
  textDecoration: "none",
});

globalStyle("a:hover", {
  color: "#0969D9",
  cursor: "pointer",
});
