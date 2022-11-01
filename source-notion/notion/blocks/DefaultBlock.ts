import AbstractBlock from "./AbstractBlock";
import {NotionBlock} from "../NotionTypes";
import {texts} from "../NotionUtils";
import ArticleList from "../../articles/ArticleList";

export default class DefaultBlock extends AbstractBlock {
  constructor(private readonly block: NotionBlock, children: AbstractBlock[]) {
    super(block, children)
  }

  public toMarkdown(articles: ArticleList): string {
    if (this.block[this.block.type].rich_text) {
      return texts(this.block[this.block.type].rich_text, articles) + "\n";
    } else if (this.block[this.block.type].url) {
      return `[${this.block[this.block.type].url}](${this.block[this.block.type].url})\n`;
    }
    return this.childrenToMarkdown(articles);
  }
}