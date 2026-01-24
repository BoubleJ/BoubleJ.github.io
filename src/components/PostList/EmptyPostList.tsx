import * as styles from "./EmptyPostList.css";


interface EmptyPostListProps {
  searchTerm?: string;
  selectedCategory: string;
}

export default function EmptyPostList({ searchTerm, selectedCategory }: EmptyPostListProps) {
  return (
  
    <div className={styles.emptyMessage}>
      {searchTerm
        ? `"${searchTerm}"에 대한 검색 결과가 없습니다.`
        : selectedCategory !== "All"
        ? `"${selectedCategory}" 카테고리에 포스트가 없습니다.`
        : "포스트가 없습니다."}
    </div>
 
  )
}
