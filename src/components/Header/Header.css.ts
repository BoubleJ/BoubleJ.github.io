import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

// v2-2 버그 수정: headerVisible/headerHidden에 keyframes(slideDown/slideUp)를 병용하면
// (a) 최초 렌더에서 isVisible=true로 인해 slideDown이 재생되고
// (b) 빠른 방향 전환 시 keyframe이 고정 시작값에서 재시작해 점프/깜빡임이 발생했다.
// transform만 선언하고, 전환은 아래 header의 transition("transform 0.3s ease-in-out, ...")이
// 현재 계산값에서 목표값으로 보간하도록 위임한다 — 초기 애니메이션 없음 + 연속적인 전환.
export const header = style({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  backgroundColor: vars.color.background,
  borderBottom: `1px solid ${vars.color.border}`,
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  transition:
    "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, background-color 0.2s, border-color 0.2s",
});

export const headerVisible = style({ transform: "translateY(0)" });
export const headerHidden = style({ transform: "translateY(-100%)" });

export const headerContainer = style({
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: "70px",
  "@media": {
    "(max-width: 768px)": {
      padding: "0 16px",
      height: "60px",
    },
  },
});

export const logo = style({
  textDecoration: "none",
  color: "inherit",
  transition: "opacity 0.2s",
  ":hover": {
    opacity: 0.8,
  },
});

export const logoText = style({
  fontSize: "24px",
  fontWeight: 700,
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  letterSpacing: "-0.5px",
  "@media": {
    "(max-width: 768px)": {
      fontSize: "20px",
    },
  },
});

export const nav = style({
  display: "flex",
  gap: "24px",
  alignItems: "center",
  "@media": {
    "(max-width: 768px)": {
      gap: "16px",
    },
  },
});

export const navLink = style({
  textDecoration: "none",
  color: vars.color.secondary,
  fontSize: "16px",
  fontWeight: 500,
  transition: "color 0.2s",
  ":hover": {
    color: vars.color.primary,
  },
  "@media": {
    "(max-width: 768px)": {
      fontSize: "14px",
    },
  },
});

export const navLinkActive = style({
  color: vars.color.primary,
  fontWeight: 600,
  position: "relative",
  "::after": {
    content: '""',
    position: "absolute",
    bottom: "-4px",
    left: 0,
    right: 0,
    height: "2px",
    backgroundColor: vars.color.primary,
    borderRadius: "1px",
  },
});

export const searchIconButton = style({
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "8px",
  transition: "background-color 0.2s",
  ":hover": {
    backgroundColor: vars.color.buttonHoverBg,
  },
  ":active": {
    transform: "scale(0.95)",
  },
});

export const searchIcon = style({
  width: "20px",
  height: "20px",
  color: vars.color.secondary,
  transition: "color 0.2s",
  selectors: {
    [`${searchIconButton}:hover &`]: {
      color: vars.color.primary,
    },
  },
});

export const searchContainer = style({
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 24px",
  overflow: "hidden",
  "@media": {
    "(max-width: 768px)": {
      padding: "0 16px",
    },
  },
});

export const searchForm = style({
  display: "flex",
  gap: "8px",
  width: "100%",
  "@media": {
    "(max-width: 768px)": {
      flexDirection: "column",
    },
  },
});
