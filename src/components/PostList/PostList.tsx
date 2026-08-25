// src/components/PostList/PostList.tsx
// v2-8: useInfiniteScroll → 페이지네이션(PER_PAGE=10, ?page= URL 동기화)으로 대체
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
}

// URL의 ?page= 파싱: 1 미만/범위 밖/비숫자 → 1
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
}: PostListProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const isFirstPostsChange = useRef(true);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  // 렌더 시점의 안전 clamp(state 반영 전 한 프레임 대비) — 실제 state 동기화는 아래 effect들이 담당
  const currentPage = Math.min(page, totalPages);

  // 최초 마운트 시 URL의 ?page= 반영 (location은 클라이언트에서만 접근 가능) — 의도적으로 마운트 시 1회만 실행
  // biome-ignore lint/correctness/useExhaustiveDependencies: 마운트 시점의 totalPages로 초기 페이지만 결정하면 됨
  useEffect(() => {
    setPage(readPageFromUrl(totalPages));
  }, []);

  // posts(필터 결과)가 바뀌면 1페이지로 리셋 (최초 마운트 시에는 건너뜀)
  // biome-ignore lint/correctness/useExhaustiveDependencies: posts는 본문에서 참조하지 않고 참조 변경 트리거로만 사용
  useEffect(() => {
    if (isFirstPostsChange.current) {
      isFirstPostsChange.current = false;
      return;
    }
    setPage(1);
    const sp = new URLSearchParams(location.search);
    if (sp.has("page")) {
      sp.delete("page");
      const qs = sp.toString();
      history.replaceState(
        null,
        "",
        qs ? `${location.pathname}?${qs}` : location.pathname,
      );
    }
  }, [posts]);

  const handlePageChange = (next: number) => {
    setPage(next);
    // 다른 파라미터는 보존하며 ?page=만 갱신
    const sp = new URLSearchParams(location.search);
    if (next <= 1) sp.delete("page");
    else sp.set("page", String(next));
    const qs = sp.toString();
    history.pushState(null, "", qs ? `${location.pathname}?${qs}` : location.pathname);
    // 목록 교체와 동시에 스크롤이 일어나면 어지러우므로 smooth 대신 instant 사용(v2-11 무시)
    const top = (wrapperRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY;
    window.scrollTo({ top, behavior: "instant" });
  };

  const visible = posts.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <>
      <div className={styles.postListWrapper} ref={wrapperRef}>
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
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}
