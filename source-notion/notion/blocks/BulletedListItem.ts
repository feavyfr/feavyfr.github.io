import AbstractBlock from "./AbstractBlock";
import {NotionBlock} from "../NotionTypes";
import {texts} from "../NotionUtils";
import ArticleList from "../../articles/ArticleList";

export type NotionParagraph = Extract<NotionBlock, { type: 'bulleted_list_item' }>;

export default class BulletedListItem extends AbstractBlock {
  constructor(private readonly block: NotionParagraph, children: AbstractBlock[]) {
    super(block, children);
  }

  public toMarkdown(articles: ArticleList): string {
    let result = `* ${texts(this.block.bulleted_list_item.rich_text, articles)}\n`;
    for(let i = 0; i < this.children.length; i++) {
      result += `    `+this.children[i].toMarkdown(articles);
    }
    return result;
  }
}