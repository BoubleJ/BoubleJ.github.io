import React from "react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import * as styles from "./PostContent.css";
import "../../styles/markdown.css";

interface PostContentProps {
  html?: string;
  body?: string;
}

function PostContent({ html, body }: PostContentProps) {
  if (body) {
    return (
      <div className={`${styles.markdownRenderer} markdown-content`}>
        <MDXRenderer>{body}</MDXRenderer>
      </div>
    );
  }

  return (
    <div
      className={`${styles.markdownRenderer} markdown-content`}
      dangerouslySetInnerHTML={{ __html: html || "" }}
    />
  );
}

export default PostContent;
