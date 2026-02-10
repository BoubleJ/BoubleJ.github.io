import { graphql, Link } from "gatsby";
import * as styles from "./404.css";

export default function NotFoundPage() {
  return (
    <div className={styles.notFoundPageWrapper}>
      <div className={styles.notFoundText}>404</div>
      <div className={styles.notFoundDescription}>
        찾을 수 없는 페이지입니다. <br />
        다른 콘텐츠를 보러 가보시겠어요?
      </div>
      <Link to="/" className={styles.goToMainButton}>
        메인으로
      </Link>
    </div>
  );
}

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
