import { useEffect, useRef, useState } from "react";

export default function useHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
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
