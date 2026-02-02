import { graphql } from "gatsby";
import { useRef } from "react";
import { PostFrontmatterType } from "@/types";
import Template from "@/components/Template";
import PostHead from "@/components/Post/PostHead";
import PostContent from "@/components/Post/PostContent";
import TableOfContents from "@/components/Post/TableOfContents";
import CommentWidget from "@/components/Post/CommentWidget";
import * as styles from "./post_template.css";

interface PostTemplateProps {
  data: {
    allMarkdownRemark: {
      edges: PostPageItemType[];
    };
    allMdx: {
      edges: PostPageItemType[];
    };
  };
  location: {
    href: string;
  };
}

export type PostPageItemType = {
  node: {
    html?: string;
    body?: string;
    frontmatter: PostFrontmatterType;
  };
};
export default function PostTemplate({
  data: {
    allMarkdownRemark: { edges: markdownEdges },
    // allMdx: { edges: mdxEdges }, mdx로 변환 시 사용할 props
  },
  location: { href },
}: PostTemplateProps) {
  const edges = [...markdownEdges];
  const {
    node: {
      html,
      body,
      frontmatter: { title, summary, date, categories, thumbnail },
    },
  } = edges[0];

  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <Template title={title} description={summary} url={href} image={thumbnail}>
      <PostHead
        title={title}
        date={date}
        categories={categories}
        thumbnail={thumbnail}
      />
      <div className={styles.postBody}>
        <div className={styles.postBodyContent}>
          <PostContent ref={contentRef} html={html} body={body} />
        </div>
        <aside className={styles.postBodyToc}>
          <TableOfContents contentRef={contentRef} />
        </aside>
      </div>
      <CommentWidget />
    </Template>
  );
}

export const queryMarkdownDataBySlug = graphql`
  query queryMarkdownDataBySlug($slug: String) {
    allMarkdownRemark(filter: { fields: { slug: { eq: $slug } } }) {
      edges {
        node {
          html
          frontmatter {
            title
            summary
            date(formatString: "YYYY.MM.DD.")
            categories
            thumbnail
          }
        }
      }
    }
    allMdx(filter: { fields: { slug: { eq: $slug } } }) {
      edges {
        node {
          body
          frontmatter {
            title
            summary
            date(formatString: "YYYY.MM.DD.")
            categories
            thumbnail
          }
        }
      }
    }
  }
`;
