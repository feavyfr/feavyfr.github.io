import AbstractBlock from "./AbstractBlock";
import {NotionBlock} from "../NotionTypes";
import {texts} from "../NotionUtils";

export type NotionParagraph = Extract<NotionBlock, { type: 'code' }>;

export default class Code extends AbstractBlock {
  constructor(private readonly block: NotionParagraph, children: AbstractBlock[]) {
    super(block, children);
  }

  public toMarkdown(a): string {
    return `\`\`\`${this.block.code.language.replace("plain text", "")}\n${texts(this.block.code.rich_text, null)}\n\`\`\`\n`;
  }
}