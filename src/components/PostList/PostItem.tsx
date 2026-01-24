import { Link } from "gatsby";
import { PostFrontmatterType } from "@/types";
import * as styles from "./PostItem.css";

type PostItemProps = PostFrontmatterType & { link: string; index?: number };
export default function PostItem({
  title,
  date,
  categories,
  summary,
  thumbnail,
  link,
  index = 0,
}: PostItemProps) {
  return (
    <Link
      to={link}
      className={styles.postItemWrapper}
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <img
        src={thumbnail}
        alt="Post Item Image"
        className={styles.thumbnailImage}
      />

      <div className={styles.postItemContent}>
        <div className={styles.title}>{title}</div>
        <div className={styles.date}>{date}</div>
        <div className={styles.category}>
          {categories.map((category) => (
            <div key={category} className={styles.categoryItem}>
              {category}
            </div>
          ))}
        </div>
        <div className={styles.summary}>{summary}</div>
      </div>
    </Link>
  );
}

