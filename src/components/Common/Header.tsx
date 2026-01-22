import React from "react";
import { Link } from "gatsby";
import * as styles from "./Header.css";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoText}>Tech Blog</span>
        </Link>
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>
            Home
          </Link>
          <Link to="/#posts" className={styles.navLink}>
            Posts
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
