import * as React from "react"
import "../style/style.css";
import { Helmet } from 'react-helmet';
import "./style.css";
import icon from "../images/icon.png";
import {Link} from "gatsby";

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
          {children}
        </main>
    )
}

export default Layout
