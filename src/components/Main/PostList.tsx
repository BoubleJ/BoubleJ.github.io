import React from "react";
import PostItem from "components/Main/PostItem";
import { PostListItemType } from "types/PostItem.types";
import useInfiniteScroll, {
  useInfiniteScrollType,
} from "hooks/useInfiniteScroll";
import * as styles from "./PostList.css";

export interface PostType {
  node: {
    id: string;
    frontmatter: {
      title: string;
      summary: string;
      date: string;
      categories: string[];
      thumbnail: {
        publicURL: string;
      };
    };
  };
};

type PostListProps = {
  selectedCategory: string;
  searchTerm?: string;
  posts: PostListItemType[];
};
function PostList({
  selectedCategory,
  searchTerm = "",
  posts,
}: PostListProps) {
  const { containerRef, postList }: useInfiniteScrollType = useInfiniteScroll(
    selectedCategory,
    searchTerm,
    posts
  );
  if (postList.length === 0) {
    return (
      <div className={styles.postListWrapper}>
        <div className={styles.emptyMessage}>
          {searchTerm
            ? `"${searchTerm}"에 대한 검색 결과가 없습니다.`
            : selectedCategory !== "All"
            ? `"${selectedCategory}" 카테고리에 포스트가 없습니다.`
            : "포스트가 없습니다."}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.postListWrapper} ref={containerRef}>
      {postList.map(
        ({
          node: {
            id,
            fields: { slug },
            frontmatter,
          },
        }: PostListItemType) => (
          <PostItem {...frontmatter} link={slug} key={id} />
        )
      )}
    </div>
  );
};

export default PostList;
