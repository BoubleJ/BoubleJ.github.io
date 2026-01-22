import React from "react";
import styled from "@emotion/styled";
import PostItem from "components/Main/PostItem";
import { PostListItemType } from "types/PostItem.types";
import useInfiniteScroll, {
  useInfiniteScrollType,
} from "hooks/useInfiniteScroll";

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

const PostListWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  width: 768px;
  margin: 0 auto;
  padding: 50px 0 100px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    width: 100%;
    padding: 50px 20px;
  }
`;

const EmptyMessage = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 20px;
  color: #666;
  font-size: 18px;

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 60px 20px;
  }
`;
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
      <PostListWrapper>
        <EmptyMessage>
          {searchTerm
            ? `"${searchTerm}"에 대한 검색 결과가 없습니다.`
            : selectedCategory !== "All"
            ? `"${selectedCategory}" 카테고리에 포스트가 없습니다.`
            : "포스트가 없습니다."}
        </EmptyMessage>
      </PostListWrapper>
    );
  }

  return (
    <PostListWrapper ref={containerRef}>
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
    </PostListWrapper>
  );
};

export default PostList;
