import { useEffect, useRef, useState } from "react";

export default function useHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  // v2-16 B6: 원본은 lastScrollY를 state로 두어 매 스크롤마다 effect가 재등록됐다(비효율).
  // 값을 판정에만 쓰고 리렌더를 유발할 필요가 없으므로 ref로 옮기고 리스너는 1회만 등록한다.
  // 임계값(10px/100px) 및 판정 로직 자체는 동일 — 동작 변화 없음.
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  const handleSearchIconClick = () => {
    setIsSearchOpen((prev) => !prev);
  };

  return {
    isSearchOpen,
    isVisible,
    handleSearchClose,
    handleSearchIconClick,
  };
}
