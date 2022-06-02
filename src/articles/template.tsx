import { graphql } from "gatsby";
import { Helmet } from 'react-helmet';
import { MDXRenderer } from "gatsby-plugin-mdx";
import React from "react";

import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader";
import Layout from "../components/layout";
deckDeckGoHighlightElement();

export default function ArticlePage({ data }) {
  const { body } = data.mdx;
  return (
    <Layout>
      <Helmet>
        <title>Article</title>
      </Helmet>
      <h1>{data.mdx.frontmatter.title}</h1>
      <MDXRenderer>{body}</MDXRenderer>
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
      }
    }
  }
`;