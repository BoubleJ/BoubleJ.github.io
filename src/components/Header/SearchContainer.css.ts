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
  gap: "8px",
  width: "100%",
  "@media": {
    "(max-width: 768px)": {
      flexDirection: "column",
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

export const searchInput = style({
  flex: 1,
  padding: "12px 16px",
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
      padding: "12px 20px",
    },
  },
});
