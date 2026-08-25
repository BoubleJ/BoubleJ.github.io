import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { darkTheme, lightTheme } from "@/styles/theme.css";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// v2-16 A1: Layout.astro의 인라인 스크립트가 첫 페인트 전에 body 클래스를 이미 dark/light로 확정해 둔다.
// 마운트 시 같은 판정 로직을 다시 타면 하이드레이션 이후 테마가 뒤집힐 수 있으므로,
// 초기 state는 인라인 스크립트가 남긴 body.className을 그대로 읽어 결정한다.
const getInitialTheme = (): Theme => {
  if (typeof document === "undefined") return "light";
  return document.body.className === darkTheme ? "dark" : "light";
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setThemeState(savedTheme);
      document.body.className = savedTheme === "dark" ? darkTheme : lightTheme;
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = prefersDark ? "dark" : "light";
      setThemeState(initialTheme);
      document.body.className = initialTheme === "dark" ? darkTheme : lightTheme;
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme === "dark" ? darkTheme : lightTheme;
    // v2-13 C3: utterances(댓글 iframe) 테마 동기화용 — 수신부는 Task 11에서 구현
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: newTheme } }));
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
