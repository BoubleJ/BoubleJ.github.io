import PostItem from "./PostItem";
import { PostListItemType } from "@/types";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import * as styles from "./PostList.css";
import EmptyPostList from "./EmptyPostList";

interface PostListProps {
  selectedCategory: string;
  searchTerm?: string;
  posts: PostListItemType[];
};


export default function PostList({
  selectedCategory,
  searchTerm = "",
  posts,
}: PostListProps) {
  const { containerRef, postList } = useInfiniteScroll(
    selectedCategory,
    searchTerm,
    posts
  );
  
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
            index: number
          ) => (
            <PostItem {...frontmatter} link={slug} key={id} index={index} />
          )
        )
      )}
    </div>
  );
};

