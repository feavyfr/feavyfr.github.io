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

  const edited = data.mdx.frontmatter.created_time !== data.mdx.frontmatter.last_edited_time;

  return (
    <Layout>
      <Helmet>
        <title>Article</title>
      </Helmet>
      <article>
        <span className="date">Créé le {data.mdx.frontmatter.created_time}{edited && `, dernière modification le ${data.mdx.frontmatter.last_edited_time}`}</span>
        <h2>{data.mdx.frontmatter.title}</h2>
        <MDXRenderer>{body}</MDXRenderer>
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
        created_time(formatString: "DD MMMM YYYY", locale: "fr")
        last_edited_time(formatString: "DD MMMM YYYY à HH:mm", locale: "fr")
      }
    }
  }
`;