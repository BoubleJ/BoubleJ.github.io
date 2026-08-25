import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const root = style({
  position: "relative",
  flexShrink: 0,
});

// 기존 네이티브 select와 같은 외형의 트리거 버튼
export const trigger = style({
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "12px 12px",
  fontSize: "16px",
  fontFamily: "inherit",
  border: `2px solid ${vars.color.inputBorder}`,
  borderRadius: "8px",
  backgroundColor: vars.color.background,
  color: vars.color.text,
  cursor: "pointer",
  transition: "border-color 0.3s, background-color 0.2s, color 0.2s",
  ":focus-visible": {
    outline: "none",
    borderColor: vars.color.primary,
  },
  "@media": {
    "(max-width: 768px)": {
      fontSize: "14px",
    },
  },
});

export const triggerOpen = style({
  borderColor: vars.color.primary,
});

export const chevron = style({
  transition: "transform 0.2s ease-out",
  color: vars.color.secondary,
});

export const chevronOpen = style({
  transform: "rotate(180deg)",
});

// 옵션 목록: 오버레이(레이아웃 영향 없음), 검색 결과 드롭다운(z 1000)보다 위
export const list = style({
  position: "absolute",
  top: "calc(100% + 4px)",
  left: 0,
  minWidth: "100%",
  margin: 0,
  padding: "4px",
  listStyle: "none",
  border: `1px solid ${vars.color.border}`,
  borderRadius: "8px",
  backgroundColor: vars.color.background,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  zIndex: 1001,
});

export const option = style({
  display: "block",
  width: "100%",
  padding: "10px 14px",
  border: "none",
  borderRadius: "6px",
  background: "none",
  fontSize: "15px",
  fontFamily: "inherit",
  textAlign: "left",
  color: vars.color.text,
  cursor: "pointer",
  transition: "background-color 0.15s",
  ":hover": {
    backgroundColor: vars.color.buttonHoverBg,
  },
  "@media": {
    "(max-width: 768px)": {
      fontSize: "14px",
    },
  },
});

export const optionActive = style({
  color: vars.color.primary,
  fontWeight: 600,
});
