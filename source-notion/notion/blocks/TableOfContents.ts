import Block from "./Block";
import {NotionBlock} from "../NotionTypes";

export type NotionTableOfContents = Extract<NotionBlock, { type: 'table_of_contents' }>;

export default class TableOfContents extends Block {
  constructor(private readonly block: NotionTableOfContents, children: Block[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    return `<TableOfContents data={props}/>\n`;
  }
}