import { globalStyle } from "@vanilla-extract/css";
import { vars } from "./theme.css";

globalStyle("*", {
  padding: 0,
  margin: 0,
  boxSizing: "border-box",
});

globalStyle("html, body, #app", {
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

globalStyle(".autolink-header", {
  opacity: 0,
  transition: "opacity 0.15s ease",
});

globalStyle(
  "h1:hover .autolink-header, h2:hover .autolink-header, h3:hover .autolink-header, .autolink-header:focus-visible",
  {
    opacity: 1,
  },
);

globalStyle("h1[id], h2[id], h3[id]", {
  scrollMarginTop: "80px", // gatsby-remark-autolink-headers offsetY: 80 대응
});
// v2-11: TOC/앵커 클릭 시 부드러운 스크롤 이동 (reduced-motion 사용자는 즉시 이동)
globalStyle("html", { scrollBehavior: "smooth" });
globalStyle("html", {
  "@media": { "(prefers-reduced-motion: reduce)": { scrollBehavior: "auto" } },
});
