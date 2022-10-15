import { graphql } from "gatsby";
import { Helmet } from 'react-helmet';
import { MDXRenderer } from "gatsby-plugin-mdx";
import React from "react";

import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader";
import Layout from "../components/layout";
import "./style.css";

deckDeckGoHighlightElement();

export default function ArticlePage({ data }) {
  const { body } = data.mdx;

  const edited = data.mdx.frontmatter.created_time !== data.mdx.frontmatter.last_edited_time.split(" à")[0];

  return (
    <Layout>
      <Helmet>
        <title>Feavy • {data.mdx.frontmatter.title}</title>
      </Helmet>
      <article>
        <div className="head">
          <span className="date">{data.mdx.frontmatter.created_time}{edited && <span className="edited"> modifié le {data.mdx.frontmatter.last_edited_time}</span>}</span>
          <div className="tags">
            {data.mdx.frontmatter.tags.map((tag) => (
                // <Link to={`/tags/${tag}`} key={tag}>
                <span className="tag">{tag}</span>
                // </Link>
            ))}
          </div>
        </div>
        <h2>{data.mdx.frontmatter.title}</h2>
        <div className="content">
          <MDXRenderer>{body}</MDXRenderer>
        </div>
      </article>
    </Layout>
  );
}

export const query = graphql`
  query ArticleRequest($id: String) {
    mdx(id: {eq: $id}) {
      id
      slug
      body
      frontmatter {
        title
        tags
        created_time(formatString: "DD MMMM YYYY", locale: "fr")
        last_edited_time(formatString: "DD MMMM YYYY à HH:mm", locale: "fr")
      }
    }
  }
`;