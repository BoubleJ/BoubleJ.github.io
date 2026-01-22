import * as styles from "./Introduction.css";

function Introduction() {
  return (
    <div className={styles.background}>
      <div className={styles.wrapper}>
        <img src="/image/profile-image.png" alt="Profile" style={{ maxWidth: "200px", borderRadius: "50%" }} />
      </div>
    </div>
  );
}

export default Introduction;
