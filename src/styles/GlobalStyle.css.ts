import { globalStyle } from "@vanilla-extract/css";
import { vars } from "./theme.css";

globalStyle("*", {
  padding: 0,
  margin: 0,
  boxSizing: "border-box",
});

globalStyle("html, body, #___gatsby", {
  height: "100%",
  backgroundColor: vars.color.background,
  color: vars.color.text,
  transition: "background-color 0.2s ease, color 0.2s ease",
});

globalStyle("a", {
  color: "inherit",
  textDecoration: "none",
});

globalStyle("a:hover", {
  color: vars.color.linkHover,
  cursor: "pointer",
});
