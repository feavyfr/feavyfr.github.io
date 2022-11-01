import * as React from "react"
import "../style/style.css";
import { Helmet } from 'react-helmet';
import "./style.css";
import icon from "../images/icon.png";
import {Link} from "gatsby";
import {MDXProvider} from "@mdx-js/react";
import TableOfContents from "./TableOfContents";
import LinkPreview from "./LinkPreview";

const shortcodes = { TableOfContents, LinkPreview };

// markup
const Layout: React.FC<{}> = ({ children }) => {
    return (
        <main id="main">
          <Helmet htmlAttributes={{lang: "fr"}}>
              <meta charSet="utf-8" />
              <meta name="description" content="Blog personnel, Informatique, multimédia" />
              <title>Feavy</title>
          </Helmet>
          <Link to="/" style={{textDecoration: "none"}}>
            <header>
              <img src={icon} alt="icon" id="icon"/>
              <h1>Feavy</h1>
            </header>
          </Link>
          <MDXProvider components={shortcodes}>
            {children}
          </MDXProvider>
        </main>
    )
}

export default Layout
