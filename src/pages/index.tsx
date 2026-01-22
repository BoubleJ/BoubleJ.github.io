import { useMemo } from "react";
import CategoryList, { CategoryListProps } from "components/Main/CategoryList";
import Introduction from "components/Main/Introduction";
import PostList, { PostType } from "components/Main/PostList";
import SearchBox from "components/Main/SearchBox";
import Template from "components/Common/Template";
import { graphql } from "gatsby";
import { PostListItemType } from "types/PostItem.types";
import { IGatsbyImageData } from "gatsby-plugin-image";
import queryString, { ParsedQuery } from "query-string";

interface PageProps {
  location: {
    search: string;
  };
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
    };
  };
}

function Page({
  location: { search },
  data: {
    site: {
      siteMetadata: { title, description, siteUrl },
    },
    allMarkdownRemark: { edges: markdownEdges },
    allMdx: { edges: mdxEdges },
    file: { publicURL },
  },
}: PageProps) {
  const edges = [...markdownEdges, ...mdxEdges];
  const parsed: ParsedQuery<string> = queryString.parse(search);
  const selectedCategory: string =
    typeof parsed.category !== "string" || !parsed.category
      ? "All"
      : parsed.category;
  const searchTerm: string =
    typeof parsed.search === "string" ? parsed.search : "";

  type NewType = CategoryListProps;

  const categoryList = useMemo(
    () =>
      edges.reduce(
        (
          list: NewType["categoryList"],
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

          list["All"]++;

          return list;
        },
        { All: 0 }
      ),
    [edges]
  );

  return (
    <Template
      title={title}
      description={description}
      url={siteUrl}
      image={publicURL}
    >
      <Introduction />
      <SearchBox initialValue={searchTerm} />
      <CategoryList
        selectedCategory={selectedCategory}
        categoryList={categoryList}
      />
      <PostList
        selectedCategory={selectedCategory}
        searchTerm={searchTerm}
        posts={edges}
      />
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
            thumbnail {
              childImageSharp {
                gatsbyImageData(width: 768, height: 400)
              }
            }
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
            thumbnail {
              childImageSharp {
                gatsbyImageData(width: 768, height: 400)
              }
            }
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
