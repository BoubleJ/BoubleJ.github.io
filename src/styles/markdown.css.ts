import { globalStyle } from "@vanilla-extract/css";
import { darkTheme, vars } from "./theme.css";

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
  margin: "20px 0", // 인용문과 동일한 간격 — 앞뒤 문단에 붙어 보이지 않도록
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

// 세로로 긴 이미지는 본문 폭을 그대로 채우면 화면 몇 개 분량으로 늘어난다.
// 원본은 그대로 두고 표시 크기만 줄여 고해상도 화면의 선명함을 지킨다.
// img-sm: 모바일·태블릿 스크린샷. 실제 기기로 보는 비율에 가깝게.
globalStyle(".markdown-content .img-sm img", {
  maxWidth: "360px",
});

// img-md: 세로로 긴 데스크톱 화면. 글자가 읽힐 만큼은 남긴다.
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

// 코드블록은 Prism.js가 처리하므로 마크다운 스타일에서 제외
// 인라인 코드만 대상 — 클래스 부착 없이 래퍼 후손 셀렉터로 커버 (v2-16 A4)
globalStyle(".markdown-content code:not([class*='language-'])", {
  backgroundColor: vars.color.codeBg,
  padding: "2px 6px",
  borderRadius: "3px",
  fontSize: "85%",
  overflowWrap: "anywhere", // 긴 Tailwind 클래스가 본문에 들어와도 가로 스크롤이 생기지 않도록
  fontFamily:
    'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
  color: vars.color.codeColor,
});

// 코드블록 복사 버튼 스타일
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

// PrismJS Code Block Theme Overrides for Dark Mode
// 다크모드(darkTheme 클래스가 body에 적용됨)일 때 Prism 스타일을 재정의합니다.

globalStyle(
  `body.${darkTheme} :not(pre) > code[class*="language-"], body.${darkTheme} pre[class*="language-"]`,
  {
    backgroundColor: "#161b22", // GitHub Dark Dimmed background
    color: "#adbac7",
    textShadow: "none",
  },
);

globalStyle(
  `body.${darkTheme} .token.comment, body.${darkTheme} .token.prolog, body.${darkTheme} .token.doctype, body.${darkTheme} .token.cdata`,
  {
    color: "#768390",
  },
);

globalStyle(`body.${darkTheme} .token.punctuation`, {
  color: "#adbac7",
});

globalStyle(
  `body.${darkTheme} .token.delimiter.important, body.${darkTheme} .token.selector, body.${darkTheme} .token.tag, body.${darkTheme} .token.operator, body.${darkTheme} .token.keyword`,
  {
    color: "#f47067",
  },
);

globalStyle(
  `body.${darkTheme} .token.string, body.${darkTheme} .token.char, body.${darkTheme} .token.attr-value, body.${darkTheme} .token.regex, body.${darkTheme} .token.variable`,
  {
    color: "#96d0ff",
  },
);

globalStyle(
  `body.${darkTheme} .token.atrule, body.${darkTheme} .token.attr-value, body.${darkTheme} .token.function, body.${darkTheme} .token.class-name`,
  {
    color: "#dcbdfb",
  },
);

globalStyle(`body.${darkTheme} .token.constant`, {
  color: "#6cb6ff",
});
