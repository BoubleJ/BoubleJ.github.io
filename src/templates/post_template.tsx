import { graphql } from "gatsby";
import { PostFrontmatterType } from "types/PostItem.types"; // 바로 아래에서 정의할 것입니다
import Template from "components/Common/Template";
import PostHead from "components/Post/PostHead";
import PostContent from "components/Post/PostContent";
import CommentWidget from "components/Post/CommentWidget";

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
function PostTemplate({
  data: {
    allMarkdownRemark: { edges: markdownEdges },
    allMdx: { edges: mdxEdges },
  },
  location: { href },
}: PostTemplateProps) {
  const edges = [...markdownEdges, ...mdxEdges];
  const {
    node: {
      html,
      body,
      frontmatter: {
        title,
        summary,
        date,
        categories,
        thumbnail,
      },
    },
  } = edges[0];

  return (
    <Template title={title} description={summary} url={href} image={thumbnail}>
      <PostHead
        title={title}
        date={date}
        categories={categories}
        thumbnail={thumbnail}
      />
      <PostContent html={html} body={body} />
      <CommentWidget />
    </Template>
  );
}

export default PostTemplate;

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
