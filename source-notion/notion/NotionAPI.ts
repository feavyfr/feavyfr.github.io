import {Client} from "@notionhq/client";
import Page from "./blocks/Page";
import {NotionBlock} from "./NotionTypes";
import Block from "./blocks/Block";
import Blocks from "./blocks/Blocks";

export default class NotionAPI {
  private readonly notion: Client;

  public constructor(auth?: string) {
    this.notion = new Client({
      auth
    });
  }

  public async getPages(database_id: string): Promise<Page[]> {
    const response = await this.notion.databases.query({database_id});
    const pages = response.results;
    return pages.map(data => new Page(data));
  }

  public async setPageBlocks(page: Page) {
    page.blocks = await this.getBlocks(page.id);
  }

  public async getBlocks(block_id: string): Promise<Block[]> {
    let response = await this.notion.blocks.children.list({block_id: block_id, page_size: 100});
    const blocks: NotionBlock[] = response.results.filter(block => "type" in block) as NotionBlock[];
    while(response.has_more) {
      response = await this.notion.blocks.children.list({block_id: block_id, page_size: 100, start_cursor: response.next_cursor});
      blocks.push(...response.results.filter(block => "type" in block) as NotionBlock[]);
    }
    return Promise.all(
        blocks.map(
            async (block): Promise<Block> => Blocks.create(block, block.has_children ? await this.getBlocks(block.id) : [])
        )
    );
  }
}