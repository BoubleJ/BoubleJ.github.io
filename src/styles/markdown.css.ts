import { globalStyle } from "@vanilla-extract/css";

// 마크다운 전용 스타일 - 컴포넌트 스타일과 분리
// .markdown-content 클래스로 스코프를 제한하여 컴포넌트 스타일과 충돌 방지
globalStyle(".markdown-content h1, .markdown-h1", {
  marginTop: "60px",
  marginBottom: "30px",
  fontSize: "2em",
  fontWeight: "bold",
});

globalStyle(".markdown-content h2, .markdown-h2", {
  marginTop: "20px",
  marginBottom: "10px",
  fontSize: "1.5em",
  fontWeight: "bold",
});

globalStyle(".markdown-content h3, .markdown-h3", {
  marginTop: "10px",
  marginBottom: "5px",
  fontSize: "1.25em",
  fontWeight: "bold",
});

globalStyle(".markdown-content p, .markdown-p", {
  margin: "3px 0",
  lineHeight: 1.6,
});

globalStyle(".markdown-content blockquote, .markdown-blockquote", {
  margin: "10px 0px",
  padding: "15px",
  borderLeft: "3px solid #d2d7df",
  backgroundColor: "#f6f8fa",
  color: "#72757b",
});

globalStyle(".markdown-content ol, .markdown-content ul, .markdown-ol, .markdown-ul", {
  marginLeft: "20px",
  padding: "5px 0",
});

globalStyle(".markdown-content li, .markdown-li", {
  padding: "6px 0",
});

globalStyle(".markdown-content a, .markdown-a", {
  color: "#0366d6",
  textDecoration: "none",
});

globalStyle(".markdown-content a:hover, .markdown-a:hover", {
  textDecoration: "underline",
});

globalStyle(".markdown-content img", {
  maxWidth: "100%",
  height: "auto",
});

globalStyle(".markdown-content table", {
  borderCollapse: "collapse",
  width: "100%",
  margin: "16px 0",
});

globalStyle(".markdown-content table th, .markdown-content table td", {
  border: "1px solid #dfe2e5",
  padding: "6px 13px",
});

globalStyle(".markdown-content table th", {
  backgroundColor: "#f6f8fa",
  fontWeight: "bold",
});

// 코드블록은 Prism.js가 처리하므로 마크다운 스타일에서 제외
// .markdown-code는 인라인 코드만, .markdown-pre는 Prism이 처리
globalStyle(".markdown-code:not([class*='language-'])", {
  backgroundColor: "#f7f6f3",
  padding: "2px 6px",
  borderRadius: "3px",
  fontSize: "85%",
  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
  color: "#e83e8c",
});
