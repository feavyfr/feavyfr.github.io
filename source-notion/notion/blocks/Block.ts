import {NotionBlock} from "../NotionTypes";

export default abstract class Block {
  public type: string;
  public id: string;

  protected constructor(block: NotionBlock, public readonly children: Block[]) {
    Object.assign(this, block);
  }

  public childrenToMarkdown(): string {
    return this.children.filter(block => block != null).map(block => block.toMarkdown()).join("\n");
  }

  public abstract toMarkdown(): string;

  public visitDeep(visitor: (block) => void) {
    visitor(this);
    this.children.forEach(child => child.visitDeep(visitor));
  }

}