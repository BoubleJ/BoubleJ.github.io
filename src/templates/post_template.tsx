import { graphql } from "gatsby";
import CommentWidget from "@/components/Post/CommentWidget";
import PostContent from "@/components/Post/PostContent";
import PostHead from "@/components/Post/PostHead";
import TableOfContents from "@/components/Post/TableOfContents";
import Template from "@/components/Template";
import type { PostFrontmatterType } from "@/types";
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
    tableOfContents?: string | null;
    fields?: {
      readingTime?: {
        text: string;
        minutes: number;
        time: number;
        words: number;
      };
    };
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
      tableOfContents,
      fields,
      frontmatter: { title, summary, date, categories, thumbnail },
    },
  } = edges[0];

  return (
    <Template title={title} description={summary} url={href} image={thumbnail}>
      <PostHead
        title={title}
        date={date}
        categories={categories}
        readingTimeText={fields?.readingTime?.text}
        thumbnail={thumbnail}
      />
      <div className={styles.postBody}>
        <div className={styles.postBodyContent}>
          <PostContent html={html} body={body} />
        </div>
        <aside className={styles.postBodyToc}>
          <TableOfContents tocHtml={tableOfContents} />
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
          tableOfContents(maxDepth: 3)
          fields {
            readingTime {
              text
              minutes
              time
              words
            }
          }
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
