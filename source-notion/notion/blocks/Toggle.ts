import Block from "./Block";
import {NotionBlock} from "../NotionTypes";
import {texts} from "../NotionUtils";

export type NotionParagraph = Extract<NotionBlock, { type: 'toggle' }>;

export default class Toggle extends Block {
  constructor(private readonly block: NotionParagraph, children: Block[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    return `${texts(this.block.toggle.rich_text)}\n`;
  }
}