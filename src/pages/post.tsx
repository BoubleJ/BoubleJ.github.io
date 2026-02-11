import { graphql } from "gatsby";
import queryString, { type ParsedQuery } from "query-string";
import { useMemo } from "react";
import PostList from "@/components/PostList/PostList";
import Template from "@/components/Template";
import type { GraphqlDataType, PostListItemType } from "@/types";
import * as styles from "./post.css";

function filterPostsBySearchTerm(
  edges: PostListItemType[],
  searchTerm: string,
): PostListItemType[] {
  if (!searchTerm.trim()) return edges;
  const lower = searchTerm.trim().toLowerCase();
  return edges.filter(({ node: { frontmatter } }) => {
    const title = (frontmatter.title ?? "").toLowerCase();
    const summary = (frontmatter.summary ?? "").toLowerCase();
    return title.includes(lower) || summary.includes(lower);
  });
}

interface PostPageProps extends GraphqlDataType {
  location: {
    search: string;
  };
}

export default function PostPage({
  location: { search },
  data: {
    site: {
      siteMetadata: { title, description, siteUrl },
    },
    allMarkdownRemark: { edges: markdownEdges },
    // allMdx: { edges: mdxEdges }, mdx로 변환 시 사용할 props
    file,
  },
}: PostPageProps) {
  const publicURL = file?.publicURL || "";
  const edges = [...markdownEdges];
  const parsed: ParsedQuery<string> = queryString.parse(search);
  const selectedCategory: string =
    typeof parsed.category === "string" && parsed.category ? parsed.category : "";
  const searchTerm: string = typeof parsed.search === "string" ? parsed.search : "";

  const filteredPosts = useMemo(
    () => filterPostsBySearchTerm(edges, searchTerm),
    [edges, searchTerm],
  );

  return (
    <Template
      title={`${title} - Posts`}
      description={description}
      url={siteUrl}
      image={publicURL}
    >
      <div className={styles.postsPage}>
        <h1 className={styles.pageTitle}>모든 포스트</h1>
        <PostList
          selectedCategory={selectedCategory}
          searchTerm={searchTerm}
          posts={filteredPosts}
        />
      </div>
    </Template>
  );
}

export const getPostList = graphql`
  query getAllPosts {
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
