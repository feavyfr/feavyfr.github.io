import * as React from "react"
import "../style/style.css";
import { Helmet } from 'react-helmet';

// markup
const Layout: React.FC<{}> = ({ children }) => {
    return (
        <main>
            <Helmet htmlAttributes={{lang: "en"}}>
                <meta charSet="utf-8" />
                <meta name="description" content="Gatsby NotionAPI" />
                <title>Home PageGatsby NotionAPI</title>
            </Helmet>
            {children}
        </main>
    )
}

export default Layout
