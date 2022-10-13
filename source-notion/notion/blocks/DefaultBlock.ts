import Block from "./Block";
import {NotionBlock} from "../NotionTypes";

export default class DefaultBlock extends Block {
  constructor(private readonly block: NotionBlock, children: Block[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    return this.childrenToMarkdown();
  }
}