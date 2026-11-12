import { globalStyle } from "@vanilla-extract/css";
import { vars } from "./theme.css";

globalStyle(".markdown-content h1, .markdown-h1", {
  marginTop: "60px",
  marginBottom: "30px",
  fontSize: "2em",
  fontWeight: "bold",
  color: vars.color.text,
});

globalStyle(".markdown-content h2, .markdown-h2", {
  marginTop: "40px",
  marginBottom: "20px",
  fontSize: "1.5em",
  fontWeight: "bold",
  color: vars.color.text,
});

globalStyle(".markdown-content h3, .markdown-h3", {
  marginTop: "20px",
  marginBottom: "10px",
  fontSize: "1.25em",
  fontWeight: "bold",
  color: vars.color.text,
});

globalStyle(".markdown-content p, .markdown-p", {
  margin: "3px 0",
  lineHeight: 1.6,
  color: vars.color.text,
});

globalStyle(".markdown-content blockquote, .markdown-blockquote", {
  margin: "20px 0px",
  padding: "15px",
  borderLeft: `3px solid ${vars.color.blockquoteBorder}`,
  backgroundColor: vars.color.blockquoteBg,
  color: vars.color.blockquoteText,
});

globalStyle(".markdown-content details", {
  margin: "20px 0",
});

globalStyle(".markdown-content ol, .markdown-content ul, .markdown-ol, .markdown-ul", {
  marginLeft: "20px",
  padding: "5px 0",
  color: vars.color.text,
});

globalStyle(".markdown-content li, .markdown-li", {
  padding: "6px 0",
});

globalStyle(".markdown-content a, .markdown-a", {
  color: vars.color.link,
  textDecoration: "none",
});

globalStyle(".markdown-content a:hover, .markdown-a:hover", {
  textDecoration: "underline",
  color: vars.color.linkHover,
});

globalStyle(".markdown-content img", {
  maxWidth: "100%",
  height: "auto",
  margin: "12px 0 6px 0",
});

globalStyle(".markdown-content .img-sm img", {
  maxWidth: "360px",
});

globalStyle(".markdown-content .img-md img", {
  maxWidth: "560px",
});

globalStyle(".markdown-content table", {
  borderCollapse: "collapse",
  width: "100%",
  margin: "16px 0",
});

globalStyle(".markdown-content table th, .markdown-content table td", {
  border: `1px solid ${vars.color.tableBorder}`,
  padding: "6px 13px",
  color: vars.color.text,
});

globalStyle(".markdown-content table th", {
  backgroundColor: vars.color.tableHeaderBg,
  fontWeight: "bold",
});

globalStyle(".markdown-content code:not([class*='language-'])", {
  backgroundColor: vars.color.codeBg,
  padding: "2px 6px",
  borderRadius: "3px",
  fontSize: "85%",
  overflowWrap: "anywhere",
  fontFamily:
    'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
  color: vars.color.codeColor,
});

globalStyle(".markdown-content pre[class*='language-'], .markdown-content pre", {
  position: "relative",
  margin: "28px 0 10px 0",
});

globalStyle(".markdown-content .code-copy-button", {
  position: "absolute",
  top: "8px",
  right: "8px",
  zIndex: 1,
  padding: "4px 6px",
  borderRadius: "4px",
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.background,
  color: vars.color.secondary,
  fontSize: "11px",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
  opacity: 0,
  transform: "translateY(-4px)",
  transition:
    "opacity 0.15s ease, transform 0.15s ease, background-color 0.15s ease, color 0.15s ease",
  pointerEvents: "none",
});

globalStyle(".markdown-content pre:hover .code-copy-button", {
  opacity: 1,
  transform: "translateY(0)",
  pointerEvents: "auto",
});

globalStyle(".markdown-content .code-copy-button.copied", {
  backgroundColor: vars.color.primary,
  color: "#ffffff",
  borderColor: vars.color.primary,
});

globalStyle(".markdown-content .code-copy-button .code-copy-icon", {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: 1,
});

globalStyle(
  `:root[data-theme="dark"] :not(pre) > code[class*="language-"], :root[data-theme="dark"] pre[class*="language-"]`,
  {
    backgroundColor: "#161b22",
    color: "#adbac7",
    textShadow: "none",
  },
);

globalStyle(
  `:root[data-theme="dark"] .token.comment, :root[data-theme="dark"] .token.prolog, :root[data-theme="dark"] .token.doctype, :root[data-theme="dark"] .token.cdata`,
  {
    color: "#768390",
  },
);

globalStyle(`:root[data-theme="dark"] .token.punctuation`, {
  color: "#adbac7",
});

globalStyle(
  `:root[data-theme="dark"] .token.delimiter.important, :root[data-theme="dark"] .token.selector, :root[data-theme="dark"] .token.tag, :root[data-theme="dark"] .token.operator, :root[data-theme="dark"] .token.keyword`,
  {
    color: "#f47067",
  },
);

globalStyle(
  `:root[data-theme="dark"] .token.string, :root[data-theme="dark"] .token.char, :root[data-theme="dark"] .token.attr-value, :root[data-theme="dark"] .token.regex, :root[data-theme="dark"] .token.variable`,
  {
    color: "#96d0ff",
  },
);

globalStyle(
  `:root[data-theme="dark"] .token.atrule, :root[data-theme="dark"] .token.attr-value, :root[data-theme="dark"] .token.function, :root[data-theme="dark"] .token.class-name`,
  {
    color: "#dcbdfb",
  },
);

globalStyle(`:root[data-theme="dark"] .token.constant`, {
  color: "#6cb6ff",
});

globalStyle(".markdown-content .mermaid-diagram", {
  margin: "20px 0",
  overflowX: "auto",
  textAlign: "center",
});

globalStyle(".markdown-content .mermaid-diagram svg", {
  maxWidth: "100%",
  height: "auto",
});
