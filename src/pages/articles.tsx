import * as React from "react"
import { Helmet } from "react-helmet"
import Layout from "../components/layout"

// markup
const ArticlesPage = () => {
    return (
        <Layout>
            <Helmet>
                <title>Articles</title>
            </Helmet>
            <h1>Articles</h1>
        </Layout>
    )
}

export default ArticlesPage
