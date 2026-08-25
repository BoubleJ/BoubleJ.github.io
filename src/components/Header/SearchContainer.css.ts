import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

// v2-6: 고정 max-height keyframes(0→200px)를 grid-template-rows(0fr↔1fr) transition으로 교체.
// 콘텐츠(드롭다운 포함) 기반 높이라 200px을 넘는 결과 목록도 잘리지 않는다.
export const searchContainer = style({
  display: "grid",
  gridTemplateRows: "0fr",
  transition: "grid-template-rows 0.3s ease-out",
});

export const searchContainerOpen = style({ gridTemplateRows: "1fr" });
export const searchContainerClosed = style({ gridTemplateRows: "0fr" });

// grid-template-rows 트릭의 필수 자식: overflow hidden + minHeight 0 이어야 0fr일 때 완전히 접힘.
// 주의: 0fr은 콘텐츠만 접고 padding은 못 접으므로, 세로 padding은 열림 상태에서만 부여한다
// (안 그러면 닫힘 상태에서 padding 높이만큼 헤더 아래로 삐져나옴).
export const searchInner = style({
  overflow: "hidden",
  minHeight: 0,
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 24px",
  paddingBottom: 0,
  transition: "padding-bottom 0.3s ease-out",
  selectors: {
    [`${searchContainerOpen} &`]: {
      paddingBottom: "16px",
    },
  },
  "@media": {
    "(max-width: 768px)": {
      padding: "0 16px",
      paddingBottom: 0,
      selectors: {
        [`${searchContainerOpen} &`]: {
          paddingBottom: "16px",
        },
      },
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
