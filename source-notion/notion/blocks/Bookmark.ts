import Block from "./Block";
import {NotionBlock} from "../NotionTypes";
import {plaintexts} from "../NotionUtils";

export type NotionBookmark = Extract<NotionBlock, { type: 'bookmark' }>;

export default class Bookmark extends Block {
  constructor(private readonly block: NotionBookmark, children: Block[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    return `<LinkPreview caption="${plaintexts(this.block.bookmark.caption)}" url="${this.block.bookmark.url}"/>\n`;
  }

}