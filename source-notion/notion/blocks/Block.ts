import {NotionBlock} from "../NotionTypes";
import ArticleList from "../../articles/ArticleList";

export default abstract class Block {
  public type: string;
  public id: string;
  public readonly internal: NotionBlock;

  protected constructor(block: NotionBlock, public readonly children: Block[]) {
    Object.assign(this, block);
    this.internal = block;
  }

  public childrenToMarkdown(articles: ArticleList): string {
    return this.children.filter(block => block != null).map(block => block.toMarkdown(articles)).join("\n");
  }

  public abstract toMarkdown(articles?: ArticleList): string;

  public visitDeep(visitor: (block) => void) {
    visitor(this);
    this.children.forEach(child => child.visitDeep(visitor));
  }

}