import { useEffect, useRef, useState } from "react";
import type { PostListItemType } from "@/types";

const NUMBER_OF_ITEMS_PER_PAGE = 10;

const useInfiniteScroll = (posts: PostListItemType[]) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [count, setCount] = useState(1);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setCount((prev) => prev + 1);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    observerRef.current?.disconnect();
    setCount(1);
  }, [posts]);

  useEffect(() => {
    const container = containerRef.current;
    const observer = observerRef.current;

    if (!container || !observer || container.children.length === 0) return;

    const hasMore = count * NUMBER_OF_ITEMS_PER_PAGE < posts.length;
    if (!hasMore) return;

    const lastChild = container.children[container.children.length - 1];
    observer.observe(lastChild);

    return () => {
      observer.unobserve(lastChild);
    };
  }, [count, posts.length]);

  return {
    containerRef,
    postList: posts.slice(0, count * NUMBER_OF_ITEMS_PER_PAGE),
  };
};

export default useInfiniteScroll;
