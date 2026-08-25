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

// #app에 확정 높이(height:100%)를 주면 main(height:100%)이 뷰포트 높이로 고정되어
// 본문이 넘쳐흐르고 Footer가 콘텐츠 중간에 겹침 — min-height + flex column으로
// 콘텐츠만큼 늘어나게 하고, 짧은 페이지에서는 Footer(margin-top:auto)가 하단 고정됨
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
