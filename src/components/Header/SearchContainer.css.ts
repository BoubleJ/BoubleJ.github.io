import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

// 검색 영역 루트: 드롭다운 오버레이의 기준점 (아코디언 밖에 두어 overflow에 안 잘리게)
export const searchPositioner = style({
  position: "relative",
  width: "100%",
});

// 기존 Gatsby 방식의 아코디언: max-height + opacity 슬라이드 (0↔200px).
// 드롭다운은 오버레이로 분리됐으므로 고정 max-height로 충분하다.
export const searchContainer = style({
  overflow: "hidden",
  maxHeight: 0,
  opacity: 0,
  transition: "max-height 0.3s ease-out, opacity 0.3s ease-out",
});

export const searchContainerOpen = style({ maxHeight: "200px", opacity: 1 });
export const searchContainerClosed = style({ maxHeight: 0, opacity: 0 });

// 펼침 애니메이션(0.3s)이 끝난 뒤에만 적용 — 스코프 셀렉트 드롭다운처럼
// 아코디언 높이를 넘는 오버레이가 잘리지 않도록 클리핑 해제
export const searchContainerSettled = style({ overflow: "visible" });

export const searchInner = style({
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 24px 16px",
  "@media": {
    "(max-width: 768px)": {
      padding: "0 16px 16px",
    },
  },
});

// 드롭다운 오버레이: 문서 흐름 밖(absolute)이라 열려도 레이아웃/스크롤바가 변하지 않는다
// → 검색어 입력 시 input 너비가 흔들리던 문제 해결
export const dropdownOverlay = style({
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  zIndex: 1000,
});

export const dropdownOverlayInner = style({
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 24px",
  "@media": {
    "(max-width: 768px)": {
      padding: "0 16px",
    },
  },
});

export const searchForm = style({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  width: "100%",
  // 모바일에서도 스코프 셀렉트 · 입력창 · 검색 버튼을 한 줄에 유지한다
  "@media": {
    "(max-width: 768px)": {
      gap: "6px",
    },
  },
});

export const scopeSelect = style({
  padding: "12px 8px",
  fontSize: "16px",
  border: `2px solid ${vars.color.inputBorder}`,
  borderRadius: "8px",
  outline: "none",
  backgroundColor: vars.color.background,
  color: vars.color.text,
  cursor: "pointer",
  transition: "border-color 0.3s, background-color 0.2s, color 0.2s",
  ":focus": {
    borderColor: vars.color.primary,
  },
  "@media": {
    "(max-width: 768px)": {
      fontSize: "14px",
    },
  },
});

// input 안에 x 버튼을 얹기 위한 래퍼. flex 폭 계산은 여기서 받는다
export const searchInputWrapper = style({
  position: "relative",
  flex: 1,
  minWidth: 0,
  display: "flex",
});

// x 는 input 오른쪽 안쪽에 겹쳐 둔다
export const clearTermButton = style({
  position: "absolute",
  top: "50%",
  right: "10px",
  transform: "translateY(-50%)",
  display: "grid",
  placeItems: "center",
  width: "22px",
  height: "22px",
  padding: 0,
  border: "none",
  borderRadius: "50%",
  background: "transparent",
  color: vars.color.secondary,
  cursor: "pointer",
  transition: "color 0.15s ease, background-color 0.15s ease",
  ":hover": {
    color: vars.color.text,
    backgroundColor: vars.color.buttonHoverBg,
  },
  ":focus-visible": {
    outline: `2px solid ${vars.color.primary}`,
    outlineOffset: "1px",
  },
});

export const searchInput = style({
  width: "100%",
  minWidth: 0,
  // 오른쪽은 x 버튼 자리를 비워둔다
  padding: "12px 38px 12px 16px",
  fontSize: "16px",
  border: `2px solid ${vars.color.inputBorder}`,
  borderRadius: "8px",
  outline: "none",
  backgroundColor: vars.color.background,
  color: vars.color.text,
  transition: "border-color 0.3s, background-color 0.2s, color 0.2s",
  ":focus": {
    borderColor: vars.color.primary,
  },
  "::placeholder": {
    color: vars.color.placeholder,
  },
  "@media": {
    "(max-width: 768px)": {
      fontSize: "14px",
    },
  },
});

export const searchButton = style({
  flexShrink: 0,
  whiteSpace: "nowrap",
  padding: "12px 24px",
  fontSize: "16px",
  fontWeight: 600,
  color: "#ffffff",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "opacity 0.3s, transform 0.2s",
  ":hover": {
    opacity: 0.9,
  },
  ":active": {
    transform: "scale(0.98)",
  },
  "@media": {
    "(max-width: 768px)": {
      fontSize: "14px",
      padding: "12px 14px",
    },
  },
});
