import { Client } from "@notionhq/client";
import Page, { setPageProperties } from "./Page";
import { NotionBlock } from "./Types";

export default class Notion {
    private readonly notion: Client;

    public constructor(auth?: string) {
        this.notion = new Client({
            auth,
        });
    }

    public async getBlocks(page_id: string): Promise<NotionBlock[]> {
        const response = await this.notion.blocks.children.list({block_id: page_id, page_size: 100});
        const blocks: NotionBlock[] = response.results.filter(block => "created_time" in block) as NotionBlock[];
        return blocks;
    }

    public async setPageBlocks(page: Page) {
        const blocks = await this.getBlocks(page.id);
        (page as any).blocks = blocks;
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
}