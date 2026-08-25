// src/components/PostList/PostItem.tsx
import * as styles from "./PostItem.css";

interface PostItemProps {
  title: string;
  date: string;
  categories: string[];
  summary: string;
  thumbnail: string;
  link: string;
  index?: number;
  searchTerm?: string;
}

// 대소문자 무시 전체 매칭 <mark> 래핑 (스펙 v2-6)
const highlight = (text: string, term: string) => {
  const t = term.trim();
  if (!t) return text;
  const parts = text.split(
    new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"),
  );
  return parts.map((part, i) => {
    if (part.toLowerCase() !== t.toLowerCase()) return part;
    // biome-ignore lint/suspicious/noArrayIndexKey: 정적으로 한 번 split된 텍스트 조각이라 순서가 바뀌지 않음
    return <mark key={i}>{part}</mark>;
  });
};

export default function PostItem({
  title,
  date,
  categories,
  summary,
  thumbnail,
  link,
  index = 0,
  searchTerm = "",
}: PostItemProps) {
  const normalizedLink = link.trim().replace(/\s+/g, "-");
  return (
    <a
      href={normalizedLink}
      className={styles.postItemWrapper}
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <img
        src={thumbnail}
        alt={`${title} 썸네일 이미지`}
        className={styles.thumbnailImage}
      />

      <div className={styles.postItemContent}>
        <div className={styles.title}>{highlight(title, searchTerm)}</div>
        <div className={styles.date}>{date}</div>
        <div className={styles.category}>
          {categories.map((category) => (
            <div key={category} className={styles.categoryItem}>
              {category}
            </div>
          ))}
        </div>
        <div className={styles.summary}>{highlight(summary, searchTerm)}</div>
      </div>
    </a>
  );
}
