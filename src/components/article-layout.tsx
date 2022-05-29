import * as React from 'react';

export default (props: any) => {
    console.log(props);
    // props.pageContext.frontmatter
    return (
        <div>
            <h1>Article Layout:</h1>
            <div>{props.children}</div>
        </div>
    )
};