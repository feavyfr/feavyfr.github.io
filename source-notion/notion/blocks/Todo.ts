import Block from "./Block";
import {NotionBlock} from "../NotionTypes";
import {texts} from "../NotionUtils";

export type NotionParagraph = Extract<NotionBlock, { type: 'to_do' }>;

export default class Todo extends Block {
  constructor(private readonly block: NotionParagraph, children: Block[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    const checked = this.block.to_do.checked ? "x" : " ";
    return (`- [${checked}] ${texts(this.block.to_do.rich_text)}`);
  }
}