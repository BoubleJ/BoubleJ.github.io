import { useEffect, useState } from "react";
import ArrowUpIcon from "@/components/icon/ArrowUpIcon";
import * as styles from "./ScrollToTop.css";

const SCROLL_THRESHOLD = 400;

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      type="button"
      className={`${styles.button} ${!isVisible ? styles.buttonHidden : ""}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label="맨 위로 이동"
      tabIndex={isVisible ? 0 : -1}
    >
      <ArrowUpIcon size={20} />
    </button>
  );
}
