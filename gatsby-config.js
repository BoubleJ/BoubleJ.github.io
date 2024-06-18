/**
 * @type {import('gatsby').GatsbyConfig}
 */

module.exports = {
  siteMetadata: {
    title: `프론트엔드 개발자 꿈나무의 개발 블로그`,
    siteUrl: `https://d7zyusgbyb73k.cloudfront.net/`,
    description: `누구나 쉽게 이해할 수 있는 블로그가 되기를 지향합니다.`,
    author: `Epik`,
  },
  plugins: [
    `gatsby-plugin-emotion`,
    "gatsby-plugin-postcss",
    "gatsby-plugin-gatsby-cloud",
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    'gatsby-plugin-sitemap',
    `gatsby-transformer-sharp`,
    `gatsby-plugin-resolve-src`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          formats: ['auto', 'webp'],
          quality: 100,
          placeholder: 'blurred',
        }
      }
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        policy: [{ userAgent: '*', allow: '/' }],
      },
    },
    {
      resolve: 'gatsby-plugin-canonical-urls',
      options: {
        siteUrl: 'https://d7zyusgbyb73k.cloudfront.net/',
        stripQueryString: true,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: `contents`,
        path: `${__dirname}/contents`,
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
        ],
      },
    },
    "gatsby-plugin-mdx",
  ],
};
