import { keyframes, style } from "@vanilla-extract/css";

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

const expandSearch = keyframes({
    "0%": {
        maxHeight: "0",
        opacity: 0,
        paddingTop: "0",
        paddingBottom: "0",
    },
    "100%": {
        maxHeight: "200px",
        opacity: 1,
        paddingTop: "16px",
        paddingBottom: "16px",
    },
});

const collapseSearch = keyframes({
    "0%": {
        maxHeight: "200px",
        opacity: 1,
        paddingTop: "16px",
        paddingBottom: "16px",
    },
    "100%": {
        maxHeight: "0",
        opacity: 0,
        paddingTop: "0",
        paddingBottom: "0",
    },
});

export const searchContainerOpen = style({
    animation: `${expandSearch} 0.3s ease-out forwards`,
});

export const searchContainerClosed = style({
    animation: `${collapseSearch} 0.3s ease-out forwards`,
});


export const searchInput = style({
    flex: 1,
    padding: "12px 16px",
    fontSize: "16px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    outline: "none",
    transition: "border-color 0.3s",
    ":focus": {
        borderColor: "#667eea",
    },
    "::placeholder": {
        color: "#999",
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
