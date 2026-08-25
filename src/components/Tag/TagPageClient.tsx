// src/components/Tag/TagPageClient.tsx — 기존 tag.tsx 로직 이식 (Task 10)
// 변경점: navigate(풀 리로드) → history.pushState + 상태 갱신, popstate 리스너로 뒤로가기 재파싱
import { useEffect, useState } from "react";
import PostList from "@/components/PostList/PostList";
import type { PostSummary } from "@/lib/posts";
// v2-14: 필터된 포스트 개수 표시 — PostPageClient와 동일한 공용 스타일(post.css.ts) 재사용
import { postCount } from "@/pages-styles/post.css";
import * as styles from "@/pages-styles/tag.css";

export default function TagPageClient({ posts }: { posts: PostSummary[] }) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const read = () =>
      setSelectedTags(new URLSearchParams(location.search).get("tags")?.split(",") ?? []);
    read();
    addEventListener("popstate", read);
    return () => removeEventListener("popstate", read);
  }, []);

  const categoryList = () =>
    posts.reduce((list: { [key: string]: number }, { categories }) => {
      if (categories) {
        categories.forEach((category) => {
          if (list[category] === undefined) list[category] = 1;
          else list[category]++;
        });
      }
      return list;
    }, {});

  const sortedCategories = Object.entries(categoryList()).sort((a, b) => b[1] - a[1]);

  const applyTags = (tags: string[]) => {
    const url = tags.length
      ? (() => {
          const sp = new URLSearchParams();
          sp.set("tags", tags.join(","));
          return `/tag?${sp}`;
        })()
      : "/tag";
    history.pushState(null, "", url);
    setSelectedTags(tags);
  };

  function handleTagClick(tag: string) {
    let newTags: string[];
    if (selectedTags.includes(tag)) {
      newTags = selectedTags.filter((t) => t !== tag);
    } else {
      newTags = [...selectedTags, tag];
    }
    applyTags(newTags);
  }

  const filteredPosts =
    selectedTags.length === 0
      ? posts
      : posts.filter(({ categories }) => {
          if (!categories) return false;
          return selectedTags.some((tag) => categories.includes(tag));
        });

  return (
    <div className={styles.tagPage}>
      <h1 className={styles.pageTitle}>태그 목록</h1>
      <div className={styles.tagListWrapper}>
        {sortedCategories.map(([name, count]) => {
          const isActive = selectedTags.includes(name);
          return (
            <button
              key={name}
              type="button"
              className={`${styles.tagItem} ${isActive ? styles.tagItemActive : ""}`}
              onClick={() => handleTagClick(name)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleTagClick(name);
                }
              }}
            >
              <span className={styles.tagName}>#{name}</span>
              <span className={styles.tagCount}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* v2-14: 현재 조건의 포스트 개수 — 필터된 전체 기준(페이지 슬라이스 아님) */}
      <p className={postCount}>총 {filteredPosts.length}개의 포스트</p>
      <PostList posts={filteredPosts} selectedCategory="" searchTerm="" />
    </div>
  );
}
