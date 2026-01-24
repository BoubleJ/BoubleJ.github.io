import { useMemo, useState, useCallback, useEffect } from "react";
import { graphql, navigate } from "gatsby";
import { GraphqlDataType } from "@/types";
import { PostType } from "@/types";
import Template from "@/components/Template";
import PostList from "@/components/PostList/PostList";
import * as styles from "./tag.css";

interface TagPageProps extends GraphqlDataType {
  location: {
    search: string;
  };
}

export default function TagPage({
  data: {
    site: {
      siteMetadata: { title, description, siteUrl },
    },
    allMarkdownRemark: { edges: markdownEdges },
    allMdx: { edges: mdxEdges },
    file,
  },
  location,
}: TagPageProps) {
  const publicURL = file?.publicURL || "";
  
  const edges = useMemo(() => {
      const markdownPosts = markdownEdges || [];
      
      return [...markdownPosts].sort((a, b) => {
        const dateA = new Date(a.node.frontmatter.date).getTime();
        const dateB = new Date(b.node.frontmatter.date).getTime();
        return dateB - dateA;
      });
  }, [markdownEdges, mdxEdges]);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tagsParam = params.get("tags");
    if (tagsParam) {
      setSelectedTags(tagsParam.split(","));
    } else {
      setSelectedTags([]);
    }
  }, [location.search]);

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
          if (categories) {
              categories.forEach((category) => {
                if (list[category] === undefined) list[category] = 1;
                else list[category]++;
              });
          }
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

  const handleTagClick = useCallback((tag: string) => {
    let newTags: string[];
    if (selectedTags.includes(tag)) {
      newTags = selectedTags.filter((t) => t !== tag);
    } else {
      newTags = [...selectedTags, tag];
    }

    const searchParams = new URLSearchParams();
    if (newTags.length > 0) {
      searchParams.set("tags", newTags.join(","));
      navigate(`/tag?${searchParams.toString()}`);
    } else {
      navigate("/tag");
    }
  }, [selectedTags]);

  const filteredPosts = useMemo(() => {
    if (selectedTags.length === 0) {
      return edges;
    }

    return edges.filter(({ node: { frontmatter: { categories } } }: PostType) => {
      if (!categories) return false;
      return selectedTags.some(tag => categories.includes(tag));
    });
  }, [edges, selectedTags]);

  return (
    <Template
      title={`${title} - Tags`}
      description={description}
      url={siteUrl}
      image={publicURL}
    >
      <div className={styles.tagPage}>
        <h1 className={styles.pageTitle}>태그 목록</h1>
        <div className={styles.tagListWrapper}>
          {sortedCategories.map(([name, count]) => {
            const isActive = selectedTags.includes(name);
            return (
                <div
                key={name}
                className={`${styles.tagItem} ${isActive ? styles.tagItemActive : ""}`}
                onClick={() => handleTagClick(name)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        handleTagClick(name);
                    }
                }}
                >
                <span className={styles.tagName}>#{name}</span>
                <span className={styles.tagCount}>({count})</span>
                </div>
            )
          })}
        </div>

        <PostList 
            posts={filteredPosts} 
            selectedCategory="All" 
            searchTerm="" 
        />
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
