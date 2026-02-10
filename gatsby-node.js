const path = require("path");
const fs = require("fs");
const { createFilePath } = require(`gatsby-source-filesystem`);
const { VanillaExtractPlugin } = require("@vanilla-extract/webpack-plugin");
const readingTime = require("reading-time");

// Enable new JSX Transform (React 17+)
exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPlugin({
    name: "@babel/plugin-transform-react-jsx",
    options: {
      runtime: "automatic",
    },
  });
};

// Setup Import Alias and Vanilla Extract
exports.onCreateWebpackConfig = ({ getConfig, actions, stage }) => {
  const output = getConfig().output || {};

  actions.setWebpackConfig({
    output,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "static": path.resolve(__dirname, "static"),
      },
    },
    plugins: [
      new VanillaExtractPlugin({
        identifiers: stage === "develop" ? "debug" : "short",
      }),
    ],
  });
};

// Generate a Slug & Reading Time for Each Post
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark` || node.internal.type === `Mdx`) {
    const slug = createFilePath({ node, getNode });
    createNodeField({ node, name: "slug", value: slug });

    // 읽기 시간 계산: MarkdownRemark는 부모 File에서 원문 읽기, Mdx는 rawBody 사용
    let rawContent = null;
    if (node.internal.type === `Mdx` && node.rawBody) {
      rawContent = node.rawBody;
    } else if (node.internal.type === `MarkdownRemark`) {
      const fileNode = getNode(node.parent);
      if (fileNode?.internal?.type === `File` && fileNode.absolutePath) {
        try {
          rawContent = fs.readFileSync(fileNode.absolutePath, "utf-8");
        } catch {
          rawContent = null;
        }
      }
    }

    if (rawContent) {
      const stats = readingTime(rawContent);
      createNodeField({
        node,
        name: "readingTime",
        value: {
          text: stats.text,
          minutes: stats.minutes,
          time: stats.time,
          words: stats.words,
        },
      });
    }
  }
};

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;

  const queryAllMarkdownData = await graphql(
    `
      {
        allMarkdownRemark(
          sort: {
            order: DESC
            fields: [frontmatter___date, frontmatter___title]
          }
        ) {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
        allMdx(
          sort: {
            order: DESC
            fields: [frontmatter___date, frontmatter___title]
          }
        ) {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
    `
  );

  // Handling GraphQL Query Error
  if (queryAllMarkdownData.errors) {
    reporter.panicOnBuild(`Error while running query`);
    return;
  }

  // Import Post Template Component
  const PostTemplateComponent = path.resolve(
    __dirname,
    "src/templates/post_template.tsx"
  );

  // Page Generating Function
  const generatePostPage = ({
    node: {
      fields: { slug },
    },
  }) => {
    const pageOptions = {
      path: slug,
      component: PostTemplateComponent,
      context: { slug },
    };

    createPage(pageOptions);
  };

  // Generate Post Page And Passing Slug Props for Query
  queryAllMarkdownData.data.allMarkdownRemark.edges.forEach(generatePostPage);
  queryAllMarkdownData.data.allMdx.edges.forEach(generatePostPage);
};
