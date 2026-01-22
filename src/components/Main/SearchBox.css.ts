import { style } from "@vanilla-extract/css";

export const searchBoxWrapper = style({
  display: "flex",
  width: "768px",
  margin: "50px auto 0",
  "@media": {
    "(max-width: 768px)": {
      width: "100%",
      padding: "0 20px",
    },
  },
});

export const searchInput = style({
  flex: 1,
  padding: "12px 16px",
  fontSize: "16px",
  border: "2px solid #e0e0e0",
  borderRadius: "8px 0 0 8px",
  outline: "none",
  transition: "border-color 0.3s",
  ":focus": {
    borderColor: "#485563",
  },
  "::placeholder": {
    color: "#999",
  },
});

export const searchButton = style({
  padding: "12px 24px",
  fontSize: "16px",
  fontWeight: 600,
  color: "#ffffff",
  backgroundColor: "#485563",
  border: "2px solid #485563",
  borderRadius: "0 8px 8px 0",
  cursor: "pointer",
  transition: "background-color 0.3s",
  ":hover": {
    backgroundColor: "#29323c",
  },
  ":active": {
    transform: "scale(0.98)",
  },
});
