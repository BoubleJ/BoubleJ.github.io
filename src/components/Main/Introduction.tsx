import * as styles from "./Introduction.css";

function Introduction() {
  return (
    <div className={styles.background}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Tech Blog</h1>
        <p className={styles.description}>기술과 개발에 대한 이야기를 공유합니다</p>
      </div>
    </div>
  );
}

export default Introduction;
