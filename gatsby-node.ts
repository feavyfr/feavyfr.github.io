import { GatsbyNode } from "gatsby";
import { resolve } from "path";

import templates from "./templates";

export const createPages: GatsbyNode['createPages'] = async ({ actions: { createPage }, graphql }) => {

    const { errors, data } = await graphql(`
      query MyQuery {
        allMdx {
          nodes {
            slug
            id
            fileAbsolutePath
          }
        }
      }
    `);

    if (errors) {
        console.error(errors);
        return;
    }

    const nodes = (data as any).allMdx.nodes;
    for (const node of nodes) {
        for (const [name, template] of Object.entries(templates)) {
            if (node.fileAbsolutePath.includes(`src/${name}`)) {
                createPage({
                    path: `/${name}/${node.slug}`,
                    component: resolve(__dirname, template),
                    context: {
                        id: node.id,
                        custom: true
                    }
                });
                console.info(`[source-notion] created page: /${name}/${node.slug}`);
                break;
            }
        }
    }
};
