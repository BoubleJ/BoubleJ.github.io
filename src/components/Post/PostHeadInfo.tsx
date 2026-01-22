import * as styles from "./PostHeadInfo.css";

export type PostHeadInfoProps = {
  title: string;
  date: string;
  categories: string[];
};

function PostHeadInfo({ title, date, categories }: PostHeadInfoProps) {
  const goBackPage = () => window.history.back();

  return (
    <div className={styles.postHeadInfoWrapper}>
      <div className={styles.prevPageIcon} onClick={goBackPage}>
      </div>
      <div className={styles.title}>{title}</div>
      <div className={styles.postData}>
        <div>{categories.join(" / ")}</div>
        <div>{date}</div>
      </div>
    </div>
  );
}

export default PostHeadInfo;
