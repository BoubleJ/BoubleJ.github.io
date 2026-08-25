// src/components/PostList/PostList.tsx
// v2-8: useInfiniteScroll → 페이지네이션(PER_PAGE=10, ?page= URL 동기화)으로 대체
// MPA 구조라 필터 변경(카테고리/검색)은 항상 location.assign 풀 리로드를 거치고,
// 그 새 URL에는 ?page=가 없으므로 "필터 변경 시 1페이지" 는 URL 라이프사이클이 이미 보장한다.
// 따라서 posts 참조 변화를 감지해 페이지를 리셋하는 effect는 두지 않는다(딥링크 ?page=N 보존을 위해).
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
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  // totalPages가 줄어(필터/본문 인덱스 로딩 이후) page가 범위를 벗어나는 경우를 대비한 렌더 시점 clamp.
  // slice·Pagination 표시 모두 이 값을 기준으로 한다.
  const effectivePage = Math.min(page, totalPages);

  // 최초 마운트 시 URL의 ?page= 반영 (location은 클라이언트에서만 접근 가능) — 의도적으로 마운트 시 1회만 실행
  // biome-ignore lint/correctness/useExhaustiveDependencies: 마운트 시점의 totalPages로 초기 페이지만 결정하면 됨
  useEffect(() => {
    setPage(readPageFromUrl(totalPages));
  }, []);

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

  const visible = posts.slice((effectivePage - 1) * PER_PAGE, effectivePage * PER_PAGE);

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
        currentPage={effectivePage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}
