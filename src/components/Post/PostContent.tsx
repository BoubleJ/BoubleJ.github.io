import React from "react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import * as styles from "./PostContent.css";

interface PostContentProps {
  html?: string;
  body?: string;
}

function PostContent({ html, body }: PostContentProps) {
  if (body) {
    return (
      <div className={styles.markdownRenderer}>
        <MDXRenderer>{body}</MDXRenderer>
      </div>
    );
  }

  return (
    <div
      className={styles.markdownRenderer}
      dangerouslySetInnerHTML={{ __html: html || "" }}
    />
  );
}

export default PostContent;
