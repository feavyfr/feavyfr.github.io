import * as React from "react"
import "../style/style.css";
import { Helmet } from 'react-helmet';

// markup
const Layout: React.FC<{}> = ({ children }) => {
    return (
        <main>
            <Helmet htmlAttributes={{lang: "en"}}>
                <meta charSet="utf-8" />
                <meta name="description" content="Gatsby Notion" />
                <title>Home PageGatsby Notion</title>
            </Helmet>
            {children}
        </main>
    )
}

export default Layout
