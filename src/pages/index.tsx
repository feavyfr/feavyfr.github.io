import * as React from "react"
import { Helmet } from "react-helmet";
import Layout from "../components/layout";
import {graphql, Link} from "gatsby";
import "./style.css";

interface Article {
  id: string;
  slug: string;
  frontmatter: {
    title: string;
    created_time: string;
    tags: string[];
  }
  excerpt: string;
}

// markup
const IndexPage = ({data}) => {
  const articles: Article[] = data.allMdx.nodes;
  return (
    <Layout>
      <div id="articles">
        {articles.map((article) => (
            <article key={article.id}>
              <div className="head">
                <span className="date">{article.frontmatter.created_time}</span>
                <div className="tags">
                  {article.frontmatter.tags.map((tag) => (
                    // <Link to={`/tags/${tag}`} key={tag}>
                      <span className="tag">{tag}</span>
                    // </Link>
                  ))}
                </div>
              </div>
              <Link to={`/articles/${article.slug}`}><h2>{article.frontmatter.title}</h2></Link>
              <p className="excerpt">{article.excerpt}</p>
              <Link to={`/articles/${article.slug}`} className="read-more">Lire la suite</Link>
            </article>
        ))}
      </div>
    </Layout>
  )
}


export const query = graphql`
  query AllArticleRequest {
    allMdx(sort: {fields: frontmatter___created_time, order: DESC}) {
      nodes {
        id
        excerpt
        slug
        frontmatter {
          title
          tags
          created_time(formatString: "DD MMMM YYYY", locale: "fr")
        }
      }
    }
  }
`;

export default IndexPage
