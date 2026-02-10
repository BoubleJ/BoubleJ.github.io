import PostHeadInfo, { PostHeadInfoProps } from "./PostHeadInfo";
import * as styles from "./PostHead.css";

interface PostHeadProps extends PostHeadInfoProps {
  thumbnail: string;
}

export default function PostHead({
  title,
  date,
  categories,
  readingTimeText,
  thumbnail,
}: PostHeadProps) {
  return (
    <div className={styles.postHeadWrapper}>
      <img
        src={thumbnail}
        alt="thumbnail"
        className={styles.backgroundImage}
        style={{ position: "absolute" }}
      />
      <PostHeadInfo
        title={title}
        date={date}
        categories={categories}
        readingTimeText={readingTimeText}
      />
    </div>
  );
}
