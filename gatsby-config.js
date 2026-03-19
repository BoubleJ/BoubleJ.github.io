/**
 * @type {import('gatsby').GatsbyConfig}
 */

module.exports = {
  siteMetadata: {
    title: `BoubleJ's Blog`,
    siteUrl: "https://boublej.github.io/",
    description: `개발하며 궁금한 점을 정리하는 블로그`,
    author: `BoubleJ`,
  },
  plugins: [
    {
      resolve: "gatsby-plugin-page-creator",
      options: {
        path: `${__dirname}/src/pages`,
        ignore: ["**/*.css.ts"],
      },
    },
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-plugin-sitemap",
    `gatsby-transformer-sharp`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          formats: ["auto", "webp"],
          quality: 100,
          placeholder: "blurred",
        },
      },
    },
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        policy: [{ userAgent: "*", allow: "/" }],
      },
    },
    {
      resolve: "gatsby-plugin-canonical-urls",
      options: {
        siteUrl: "https://boublej.github.io/",
        stripQueryString: true,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: `contents`,
        path: `${__dirname}/static/contents`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/static`,
      },
    },
    {
      resolve: "gatsby-plugin-typescript",
      options: {
        isTSX: true,
        allExtensions: true,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-smartypants",
            options: {
              dashes: "oldschool",
            },
          },
          {
            resolve: "gatsby-remark-prismjs",
            options: {
              classPrefix: "language-",
            },
          },
          {
            resolve: "gatsby-remark-classes",
            options: {
              classMap: {
                h1: "markdown-h1",
                h2: "markdown-h2",
                h3: "markdown-h3",
                p: "markdown-p",
                blockquote: "markdown-blockquote",
                ul: "markdown-ul",
                ol: "markdown-ol",
                li: "markdown-li",
                a: "markdown-a",
                code: "markdown-code",
                pre: "markdown-pre",
              },
            },
          },
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 768,
              quality: 100,
              withWebp: true,
            },
          },
          {
            resolve: "gatsby-remark-copy-linked-files",
            options: {},
          },
          {
            resolve: "gatsby-remark-external-links",
            options: {
              target: "_blank",
              rel: "nofollow",
            },
          },
          {
            resolve: "gatsby-remark-autolink-headers",
            options: {
              icon: '<svg viewBox="0 0 16 16" height="0.7em" width="0.7em"> <g stroke-width="1.2" fill="none" stroke="currentColor"> <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M8.995,7.005 L8.995,7.005c1.374,1.374,1.374,3.601,0,4.975l-1.99,1.99c-1.374,1.374-3.601,1.374-4.975,0l0,0c-1.374-1.374-1.374-3.601,0-4.975 l1.748-1.698"></path>  <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M7.005,8.995 L7.005,8.995c-1.374-1.374-1.374-3.601,0-4.975l1.99-1.99c1.374-1.374,3.601-1.374,4.975,0l0,0c1.374,1.374,1.374,3.601,0,4.975 l-1.748,1.698"></path></g></svg>',
              className: "autolink-header",
              offsetY: 80,
              maintainCase: false,
              removeAccents: true,
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        gatsbyRemarkPlugins: [
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 1200,
              quality: 100,
              withWebp: true,
            },
          },
          {
            resolve: "gatsby-remark-smartypants",
            options: {
              dashes: "oldschool",
            },
          },
          {
            resolve: "gatsby-remark-prismjs",
            options: {
              classPrefix: "language-",
            },
          },
          {
            resolve: "gatsby-remark-classes",
            options: {
              classMap: {
                h1: "markdown-h1",
                h2: "markdown-h2",
                h3: "markdown-h3",
                p: "markdown-p",
                blockquote: "markdown-blockquote",
                ul: "markdown-ul",
                ol: "markdown-ol",
                li: "markdown-li",
                a: "markdown-a",
                code: "markdown-code",
                pre: "markdown-pre",
              },
            },
          },
          {
            resolve: "gatsby-remark-autolink-headers",
            options: {
              icon: '<svg viewBox="0 0 16 16" height="0.7em" width="0.7em"> <g stroke-width="1.2" fill="none" stroke="currentColor"> <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M8.995,7.005 L8.995,7.005c1.374,1.374,1.374,3.601,0,4.975l-1.99,1.99c-1.374,1.374-3.601,1.374-4.975,0l0,0c-1.374-1.374-1.374-3.601,0-4.975 l1.748-1.698"></path>  <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M7.005,8.995 L7.005,8.995c-1.374-1.374-1.374-3.601,0-4.975l1.99-1.99c1.374-1.374,3.601-1.374,4.975,0l0,0c1.374,1.374,1.374,3.601,0,4.975 l-1.748,1.698"></path></g></svg>',
              className: "autolink-header",
              offsetY: 80,
              maintainCase: false,
              removeAccents: true,
            },
          },
        ],
      },
    },
  ],
};
