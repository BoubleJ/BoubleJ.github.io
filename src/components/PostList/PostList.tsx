import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import type { PostListItemType } from "@/types";
import EmptyPostList from "./EmptyPostList";
import PostItem from "./PostItem";
import * as styles from "./PostList.css";

interface PostListProps {
  selectedCategory: string;
  searchTerm?: string;
  posts: PostListItemType[];
}

export default function PostList({
  selectedCategory,
  searchTerm = "",
  posts,
}: PostListProps) {
  const { containerRef, postList } = useInfiniteScroll(posts);

  return (
    <div className={styles.postListWrapper} ref={containerRef}>
      {postList.length === 0 ? (
        <EmptyPostList searchTerm={searchTerm} selectedCategory={selectedCategory} />
      ) : (
        postList.map(
          (
            {
              node: {
                id,
                fields: { slug },
                frontmatter,
              },
            }: PostListItemType,
            index: number,
          ) => <PostItem {...frontmatter} link={slug} key={id} index={index % 10} />,
        )
      )}
    </div>
  );
}
