import { useEffect, useState } from "react";
import PostList from "@/components/PostList/PostList";
import type { PostSummary } from "@/lib/posts";
import { postCount } from "@/pages-styles/post.css";
import * as styles from "@/pages-styles/tag.css";

export default function TagPageClient({ posts }: { posts: PostSummary[] }) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const read = () =>
      setSelectedTags(new URLSearchParams(location.search).get("tags")?.split(",") ?? []);
    read();
    setInitialized(true);
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

      <p className={postCount}>총 {filteredPosts.length}개의 포스트</p>

      <PostList
        posts={filteredPosts}
        selectedCategory=""
        searchTerm=""
        filterKey={initialized ? selectedTags.join(",") : null}
      />
    </div>
  );
}
