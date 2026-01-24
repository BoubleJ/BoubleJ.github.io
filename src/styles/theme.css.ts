import { createTheme, createThemeContract } from "@vanilla-extract/css";

export const vars = createThemeContract({
  color: {
    background: null,
    text: null,
    primary: null,
    secondary: null,
    link: null,
    linkHover: null,
    border: null,

    codeBg: null,
    codeColor: null,
    blockquoteBg: null,
    blockquoteBorder: null,
    blockquoteText: null,
    tableBorder: null,
    tableHeaderBg: null,

    buttonHoverBg: null,
    inputBorder: null,
    placeholder: null,
  },
});

export const lightTheme = createTheme(vars, {
  color: {
    background: "#ffffff",
    text: "#24292e",
    primary: "#0969D9",
    secondary: "#586069",
    link: "#0366d6",
    linkHover: "#0969D9",
    border: "#e1e4e8",

    codeBg: "#f7f6f3",
    codeColor: "#e83e8c",
    blockquoteBg: "#f6f8fa",
    blockquoteBorder: "#d2d7df",
    blockquoteText: "#6a737d",
    tableBorder: "#dfe2e5",
    tableHeaderBg: "#f6f8fa",

    buttonHoverBg: "#f3f4f6",
    inputBorder: "#e0e0e0",
    placeholder: "#999999",
  },
});

export const darkTheme = createTheme(vars, {
  color: {
    background: "#0d1117",
    text: "#c9d1d9",
    primary: "#58a6ff",
    secondary: "#8b949e",
    link: "#58a6ff",
    linkHover: "#79c0ff",
    border: "#30363d",

    codeBg: "rgba(110, 118, 129, 0.4)",
    codeColor: "#ff7b72",
    blockquoteBg: "#161b22",
    blockquoteBorder: "#30363d",
    blockquoteText: "#8b949e",
    tableBorder: "#30363d",
    tableHeaderBg: "#161b22",

    buttonHoverBg: "#21262d",
    inputBorder: "#30363d",
    placeholder: "#484f58",
  },
});
