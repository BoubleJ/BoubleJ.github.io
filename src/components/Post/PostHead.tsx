import React from "react";
import PostHeadInfo, { PostHeadInfoProps } from "components/Post/PostHeadInfo";
import * as styles from "./PostHead.css";

interface PostHeadProps extends PostHeadInfoProps {
  thumbnail: string;
}

function PostHead({ title, date, categories, thumbnail }: PostHeadProps) {
  return (
    <div className={styles.postHeadWrapper}>
      <img
        src={thumbnail}
        alt="thumbnail"
        className={styles.backgroundImage}
        style={{ position: "absolute" }}
      />
      <PostHeadInfo title={title} date={date} categories={categories} />
    </div>
  );
}

export default PostHead;
