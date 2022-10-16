import type { GatsbyConfig } from "gatsby";
import templates from "./templates";

const templateSources = Object.entries(templates).map(([name, template]) => ({
  resolve: "gatsby-source-filesystem",
  options: {
    "name": name,
    "path": `./src/${name}/`
  }
}));

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Gatsby Notion`,
    siteUrl: `https://www.yourdomain.tld`
  },
  plugins: ["gatsby-plugin-image", "gatsby-plugin-react-helmet", "gatsby-plugin-sitemap", "gatsby-plugin-sharp", "gatsby-transformer-sharp",
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        "icon": "src/images/icon.png"
      }
    }, {
      resolve: "gatsby-plugin-mdx",
      options: {
        extensions: [".mdx", ".md"],
        gatsbyRemarkPlugins: ["gatsby-remark-unwrap-images", "gatsby-remark-autolink-headers",
          {
            resolve: "gatsby-remark-highlight-code",
            options: {
              lineNumbers: true
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1200,
              showCaptions: ['title']
            },
          },
        ]
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        "name": "pages",
        "path": "./src/pages/"
      },
      __key: "pages"
    }
  ].concat(templateSources as any)
};

export default config;
