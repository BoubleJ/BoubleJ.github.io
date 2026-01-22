import React from "react";
import { Link } from "gatsby";
import { PostFrontmatterType } from "types/PostItem.types";
import * as styles from "./PostItem.css";

type PostItemProps = PostFrontmatterType & { link: string };
function PostItem({
  title,
  date,
  categories,
  summary,
  thumbnail,
  link,
}: PostItemProps) {
  return (
    <Link to={link} className={styles.postItemWrapper}>
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

export default PostItem;
