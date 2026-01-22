import React from "react";
import * as styles from "./PostContent.css";

interface PostContentProps {
  html: string;
}

function PostContent({ html }: PostContentProps) {
  return (
    <div
      className={styles.markdownRenderer}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default PostContent;
