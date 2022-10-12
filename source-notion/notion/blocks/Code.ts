import Block from "./Block";
import {NotionBlock} from "../NotionTypes";
import {texts} from "../NotionUtils";

export type NotionParagraph = Extract<NotionBlock, { type: 'code' }>;

export default class Code extends Block {
  constructor(private readonly block: NotionParagraph, children: Block[]) {
    super(block, children);
  }

  public toMarkdown(): string {

    return `\`\`\`${this.block.code.language}\n${texts(this.block.code.rich_text)}\n\`\`\`\n`;
  }
}