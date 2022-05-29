import * as React from 'react';
import { Helmet } from 'react-helmet';
import Layout from './layout';

export default (props: any) => {
    console.log(props);
    // props.pageContext.frontmatter
    return (
        <Layout>
            <Helmet>
                <title>Article</title>
            </Helmet>
            <h1>Article Layout:</h1>
            <div>{props.children}</div>
        </Layout>
    )
};