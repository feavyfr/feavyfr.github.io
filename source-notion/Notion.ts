import { Client } from "@notionhq/client";
import Page, { setPageProperties } from "./Page";
import { Block, NotionBlock } from "./Types";

export default class Notion {
    private readonly notion: Client;

    public constructor(auth?: string) {
        this.notion = new Client({
            auth,
        });
    }

    public async getPages(database_id: string): Promise<Page[]> {
        const response = await this.notion.databases.query({database_id});
        const pages = response.results;
        const result = pages.map(data => {
            const page: any = {};
            Object.assign(page, data);
            setPageProperties(page);
            return page;
        })
        return result;
    }

    public async setPageBlocks(page: Page) {
        page.blocks = await this.getBlocks(page.id);
    }

    public async getBlocks(page_id: string): Promise<Block[]> {
        const response = await this.notion.blocks.children.list({block_id: page_id, page_size: 100});
        const blocks: NotionBlock[] = response.results.filter(block => "type" in block) as NotionBlock[];
        return Promise.all(
            blocks.map(
              async (block): Promise<Block> => ({
                ...block,
                ...(block.has_children
                    // Get nested blocks (thanks @alvis)
                  ? { has_children: true, children: await this.getBlocks(block.id) }
                  : { has_children: false }),
              }),
            ),
          );
    }
}