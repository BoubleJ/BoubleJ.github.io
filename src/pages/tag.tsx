import { useMemo } from "react";
import { Link, graphql } from "gatsby";
import { GraphqlDataType } from "@/types";
import { PostType } from "@/types";
import Template from "@/components/Template";
import * as styles from "./tag.css";

interface TagPageProps extends GraphqlDataType {
}

export default function TagPage({
  data: {
    site: {
      siteMetadata: { title, description, siteUrl },
    },
    allMarkdownRemark: { edges: markdownEdges },
    // allMdx: { edges: mdxEdges }, mdx로 변환 시 사용할 props
    file,
  },
}: TagPageProps) {
  const publicURL = file?.publicURL || "";
  const edges = [...markdownEdges];

  const categoryList = useMemo(
    () =>
      edges.reduce(
        (
          list: { [key: string]: number },
          {
            node: {
              frontmatter: { categories },
            },
          }: PostType
        ) => {
          categories.forEach((category) => {
            if (list[category] === undefined) list[category] = 1;
            else list[category]++;
          });

          return list;
        },
        {}
      ),
    [edges]
  );

  const sortedCategories = useMemo(
    () =>
      Object.entries(categoryList).sort((a, b) => b[1] - a[1]),
    [categoryList]
  );

  return (
    <Template
      title={`${title} - Tags`}
      description={description}
      url={siteUrl}
      image={publicURL}
    >
      <div className={styles.tagPage}>
        <h1 className={styles.pageTitle}>모든 태그</h1>
        <div className={styles.tagListWrapper}>
          {sortedCategories.map(([name, count]) => (
            <Link
              to={`/post?category=${encodeURIComponent(name)}`}
              className={styles.tagItem}
              key={name}
            >
              <span className={styles.tagName}>#{name}</span>
              <span className={styles.tagCount}>({count})</span>
            </Link>
          ))}
        </div>
      </div>
    </Template>
  );
}


export const getAllTags = graphql`
  query getAllTags {
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
