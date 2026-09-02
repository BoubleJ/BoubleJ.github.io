// src/components/PostList/PostList.tsx
// v2-8: useInfiniteScroll → 페이지네이션(PER_PAGE=10, ?page= URL 동기화)으로 대체
// MPA 구조라 필터 변경(카테고리/검색)은 항상 location.assign 풀 리로드를 거치고,
// 그 새 URL에는 ?page=가 없으므로 "필터 변경 시 1페이지" 는 URL 라이프사이클이 이미 보장한다.
// 따라서 posts 참조 변화만으로 페이지를 리셋하는 effect는 두지 않는다(딥링크 ?page=N 보존을 위해).
// Task 10 후속: pushState(무리로드)로 필터가 바뀌는 소비자(태그 페이지)를 위해 optional filterKey prop으로
// 같은 리셋 로직을 opt-in 제공한다. filterKey를 넘기지 않는 소비자는 기존 동작 그대로다.
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
  // pushState(무리로드)로 필터가 바뀌는 페이지(예: 태그 페이지)를 위한 옵션.
  // 값이 이전 값과 달라지면 1페이지로 리셋한다. undefined면 이 로직 전체를 건너뛴다(기존 MPA 리로드 동작 그대로).
  // null은 "아직 추적 시작 전"을 의미 — 최초로 non-null 값이 들어와도 리셋하지 않고 기록만 해 딥링크(?page=N)를 보존한다.
  filterKey?: string | null;
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
  filterKey,
}: PostListProps) {
  const [page, setPage] = useState(1);
  const prevFilterKeyRef = useRef<string | null>(null);
  // 페이지 링크 href에 현재 쿼리(카테고리/검색어)를 보존하기 위한 값.
  // SSR에는 location이 없으므로 ""로 시작해 최초 클라이언트 렌더를 SSR과 일치시키고(하이드레이션 불일치 방지),
  // 마운트 후 실제 쿼리로 갱신한다. 정적 HTML에는 ?page=N 형태의 링크가 남아 크롤러가 따라갈 수 있다.
  const [currentSearch, setCurrentSearch] = useState("");

  const totalPages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  // totalPages가 줄어(필터/본문 인덱스 로딩 이후) page가 범위를 벗어나는 경우를 대비한 렌더 시점 clamp.
  // slice·Pagination 표시 모두 이 값을 기준으로 한다.
  const effectivePage = Math.min(page, totalPages);

  // 최초 마운트 시 URL의 ?page= 반영 (location은 클라이언트에서만 접근 가능) — 의도적으로 마운트 시 1회만 실행
  // biome-ignore lint/correctness/useExhaustiveDependencies: 마운트 시점의 totalPages로 초기 페이지만 결정하면 됨
  useEffect(() => {
    setPage(readPageFromUrl(totalPages));
    setCurrentSearch(location.search);
  }, []);

  // pushState 기반 필터(태그 페이지 등)가 값을 바꾸면 1페이지로 리셋 + URL의 ?page= 제거.
  // filterKey === undefined인 소비자(예: "/" 풀 리로드 목록)는 이 effect가 매 렌더 no-op으로 스킵된다.
  useEffect(() => {
    if (filterKey == null) return;
    if (prevFilterKeyRef.current === null) {
      // 최초 non-null 값 — 리셋하지 않고 기록만 해 딥링크의 ?page=를 보존
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
    // 다른 파라미터는 보존하며 ?page=만 갱신
    const sp = new URLSearchParams(location.search);
    if (next <= 1) sp.delete("page");
    else sp.set("page", String(next));
    const qs = sp.toString();
    history.pushState(null, "", qs ? `${location.pathname}?${qs}` : location.pathname);
    setCurrentSearch(qs ? `?${qs}` : "");
    // a태그 기본 이동을 preventDefault로 막고 pushState로 URL만 바꾸므로 브라우저가 스크롤을 올려주지 않는다.
    // 목록 교체와 동시에 스크롤이 일어나면 어지러우므로 smooth 대신 instant 사용(v2-11 무시)
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // 다른 파라미터는 보존하고 ?page=만 바꾼 링크. 1페이지는 ?page=를 제거한다.
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
