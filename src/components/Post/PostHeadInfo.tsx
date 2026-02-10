import ArrowLeftIcon from "@/components/icon/ArrowLeftIcon";
import ReadingTimeIcon from "@/components/icon/ReadingTimeIcon";
import * as styles from "./PostHeadInfo.css";

export interface PostHeadInfoProps {
  title: string;
  date: string;
  categories: string[];
  readingTimeText?: string;
}

export default function PostHeadInfo({ title, date, categories, readingTimeText }: PostHeadInfoProps) {
  const goBackPage = () => window.history.back();

  return (
    <div className={styles.postHeadInfoWrapper}>
      <button className={styles.prevPageIcon} onClick={goBackPage}>
        <ArrowLeftIcon size={24} />
      </button>
      <div className={styles.title}>{title}</div>
      <div className={styles.postData}>
        <div>{categories.join(" / ")}</div>
        <div className={styles.postMetaRight}>
          <div>{date}</div>
          {readingTimeText && (
            <div className={styles.readingTime}>
              <ReadingTimeIcon size={16} />
              <span>{readingTimeText}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
