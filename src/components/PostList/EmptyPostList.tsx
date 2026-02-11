import * as styles from "./EmptyPostList.css";

interface EmptyPostListProps {
  searchTerm?: string;
  selectedCategory: string;
}

export default function EmptyPostList({
  searchTerm,
  selectedCategory,
}: EmptyPostListProps) {
  return (
    <div className={styles.emptyMessage}>
      {searchTerm
        ? "검색된 포스팅이 없습니다."
        : selectedCategory
          ? `"${selectedCategory}" 카테고리에 포스트가 없습니다.`
          : "포스트가 없습니다."}
    </div>
  );
}
