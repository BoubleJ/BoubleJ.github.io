import React from "react";
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image";
import PostHeadInfo, { PostHeadInfoProps } from "components/Post/PostHeadInfo";
import * as styles from "./PostHead.css";

interface PostHeadProps extends PostHeadInfoProps {
  thumbnail: IGatsbyImageData;
}

function PostHead({ title, date, categories, thumbnail }: PostHeadProps) {
  return (
    <div className={styles.postHeadWrapper}>
      <GatsbyImage
        image={thumbnail}
        alt="thumbnail"
        className={styles.backgroundImage}
        style={{ position: "absolute" }}
      />
      <PostHeadInfo title={title} date={date} categories={categories} />
    </div>
  );
}

export default PostHead;
