import { globalStyle } from "@vanilla-extract/css";
import { vars } from "./theme.css";

globalStyle("*", {
  padding: 0,
  margin: 0,
  boxSizing: "border-box",
});

globalStyle("html, body, #app", {
  backgroundColor: vars.color.background,
  color: vars.color.text,
  transition: "background-color 0.2s ease, color 0.2s ease",
});

globalStyle("html, body", {
  height: "100%",
});

globalStyle("html", {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", sans-serif',
});

globalStyle("#app", {
  display: "flex",
  flexDirection: "column",
  minHeight: "100%",
});

globalStyle("a", {
  color: "inherit",
  textDecoration: "none",
});

globalStyle("a:hover", {
  color: vars.color.linkHover,
  cursor: "pointer",
});

globalStyle(".autolink-header", {
  opacity: 0,
  transition: "opacity 0.15s ease",
});

globalStyle(".autolink-header.before", {
  position: "absolute",
  left: 0,
  top: 0,
  bottom: 0,
  transform: "translateX(-100%)",
  paddingRight: "4px",
  display: "inline-flex",
  alignItems: "center",
  "@media": {
    "(max-width: 768px)": {
      display: "none",
    },
  },
});

globalStyle(
  "h1:hover .autolink-header, h2:hover .autolink-header, h3:hover .autolink-header, .autolink-header:focus-visible",
  {
    opacity: 1,
  },
);

globalStyle("h1[id], h2[id], h3[id]", {
  scrollMarginTop: "80px",
});
globalStyle("html", { scrollBehavior: "smooth" });
globalStyle("html", {
  "@media": { "(prefers-reduced-motion: reduce)": { scrollBehavior: "auto" } },
});
