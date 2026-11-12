import { useEffect, useRef, useState } from "react";
import type { PostSummary } from "@/lib/posts";
import EmptyPostList from "./EmptyPostList";
import Pagination from "./Pagination";
import PostItem from "./PostItem";
import * as styles from "./PostList.css";

const PER_PAGE = 10;

interface PostListProps {
  selectedCategory: string;
  searchTerm?: string;
  posts: PostSummary[];
  filterKey?: string | null;
}

const readPageFromUrl = (totalPages: number): number => {
  const raw = new URLSearchParams(location.search).get("page");
  const n = Number(raw);
  if (!raw || !Number.isInteger(n) || n < 1 || n > totalPages) return 1;
  return n;
};

export default function PostList({
  selectedCategory,
  searchTerm = "",
  posts,
  filterKey,
}: PostListProps) {
  const [page, setPage] = useState(1);
  const prevFilterKeyRef = useRef<string | null>(null);
  const [currentSearch, setCurrentSearch] = useState("");

  const totalPages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  const effectivePage = Math.min(page, totalPages);

  // biome-ignore lint/correctness/useExhaustiveDependencies: 마운트 시점의 totalPages로 초기 페이지만 결정하면 됨
  useEffect(() => {
    setPage(readPageFromUrl(totalPages));
    setCurrentSearch(location.search);
  }, []);

  useEffect(() => {
    if (filterKey == null) return;
    if (prevFilterKeyRef.current === null) {
      prevFilterKeyRef.current = filterKey;
      return;
    }
    if (filterKey !== prevFilterKeyRef.current) {
      prevFilterKeyRef.current = filterKey;
      setPage(1);
      const sp = new URLSearchParams(location.search);
      sp.delete("page");
      const qs = sp.toString();
      history.replaceState(
        null,
        "",
        qs ? `${location.pathname}?${qs}` : location.pathname,
      );
      setCurrentSearch(qs ? `?${qs}` : "");
    }
  }, [filterKey]);

  const handlePageChange = (next: number) => {
    setPage(next);
    const sp = new URLSearchParams(location.search);
    if (next <= 1) sp.delete("page");
    else sp.set("page", String(next));
    const qs = sp.toString();
    history.pushState(null, "", qs ? `${location.pathname}?${qs}` : location.pathname);
    setCurrentSearch(qs ? `?${qs}` : "");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const hrefForPage = (target: number): string => {
    const sp = new URLSearchParams(currentSearch);
    if (target <= 1) sp.delete("page");
    else sp.set("page", String(target));
    const qs = sp.toString();
    return qs ? `?${qs}` : "?";
  };

  const visible = posts.slice((effectivePage - 1) * PER_PAGE, effectivePage * PER_PAGE);

  return (
    <>
      <div className={styles.postListWrapper}>
        {visible.length === 0 ? (
          <EmptyPostList searchTerm={searchTerm} selectedCategory={selectedCategory} />
        ) : (
          visible.map((post, index) => (
            <PostItem
              {...post}
              link={post.slug}
              key={post.id}
              index={index % 10}
              searchTerm={searchTerm}
            />
          ))
        )}
      </div>
      <Pagination
        currentPage={effectivePage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        hrefForPage={hrefForPage}
      />
    </>
  );
}
