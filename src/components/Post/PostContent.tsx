import { forwardRef } from "react";
import { MDXProvider } from "@mdx-js/react";
import * as styles from "./PostContent.css";
import "@/styles/markdown.css";

interface PostContentProps {
  html?: string;
  body?: string;
}

const PostContent = forwardRef<HTMLDivElement, PostContentProps>(
  function PostContent({ html, body }, ref) {
    if (body) {
      return (
        <div
          ref={ref}
          className={`${styles.markdownRenderer} markdown-content`}
        >
          <MDXProvider>{body}</MDXProvider>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`${styles.markdownRenderer} markdown-content`}
        dangerouslySetInnerHTML={{ __html: html || "" }}
      />
    );
  }
);

export default PostContent;
