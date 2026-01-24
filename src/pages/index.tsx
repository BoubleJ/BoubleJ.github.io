import { Link } from "gatsby";
import PostItem from "components/Main/PostItem";
import Template from "components/Common/Template";
import { graphql } from "gatsby";
import { PostListItemType } from "types/PostItem.types";
import { IGatsbyImageData } from "gatsby-plugin-image";
import * as styles from "./index.css";

interface PageProps {
  data: {
    site: {
      siteMetadata: {
        title: string;
        description: string;
        siteUrl: string;
      };
    };
    allMarkdownRemark: {
      edges: PostListItemType[];
    };
    allMdx: {
      edges: PostListItemType[];
    };
    file: {
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData;
      };
      publicURL: string;
    } | null;
  };
}

function Page({
  data: {
    site: {
      siteMetadata: { title, description, siteUrl },
    },
    allMarkdownRemark: { edges: markdownEdges },
    allMdx: { edges: mdxEdges },
    file,
  },
}: PageProps) {
  const publicURL = file?.publicURL || "";
  const edges = [...markdownEdges, ...mdxEdges];
  const latestPosts = edges.slice(0, 8);

  return (
    <Template
      title={title}
      description={description}
      url={siteUrl}
      image={publicURL}
    >
      <div className={styles.postsSection}>
        <h2 className={styles.sectionTitle}>최신 글</h2>
        <div className={styles.postListWrapper}>
          {latestPosts.map(
            (
              {
                node: {
                  id,
                  fields: { slug },
                  frontmatter,
                },
              }: PostListItemType,
              index: number
            ) => (
              <PostItem {...frontmatter} link={slug} key={id} index={index} />
            )
          )}
        </div>
        <Link to="/post" className={styles.moreButton}>
          더 보기
        </Link>
      </div>
    </Template>
  );
}

export default Page;

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
