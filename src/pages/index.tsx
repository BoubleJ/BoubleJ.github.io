import { graphql, Link } from "gatsby";
import PostList from "@/components/PostList/PostList";
import Template from "@/components/Template";
import type { GraphqlDataType } from "@/types";
import * as styles from "./index.css";

interface PageProps extends GraphqlDataType {}

export default function Page({
  data: {
    site: {
      siteMetadata: { title, description, siteUrl },
    },
    allMarkdownRemark: { edges: markdownEdges },
    // allMdx: { edges: mdxEdges }, mdx로 변환 시 사용할 props
    file,
  },
}: PageProps) {
  const publicURL = file?.publicURL || "";
  const edges = [...markdownEdges];
  const latestPosts = edges.slice(0, 8);

  return (
    <Template title={title} description={description} url={siteUrl} image={publicURL}>
      <div className={styles.postsSection}>
        <h2 className={styles.sectionTitle}>최신 글</h2>
        <PostList selectedCategory="" searchTerm="" posts={latestPosts} />
        <Link to="/post" className={styles.moreButton}>
          더 보기
        </Link>
      </div>
    </Template>
  );
}

export const getPostList = graphql`
  query getPostList {
    site {
      siteMetadata {
        title
        description
        siteUrl
      }
    }
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date, frontmatter___title] }
    ) {
      edges {
        node {
          id
          fields {
            slug
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
    allMdx(
      sort: { order: DESC, fields: [frontmatter___date, frontmatter___title] }
    ) {
      edges {
        node {
          id
          fields {
            slug
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
    file(name: { eq: "profile-image" }) {
      childImageSharp {
        gatsbyImageData(width: 120, height: 120)
      }
      publicURL
    }
  }
`;
