import AbstractBlock from "./AbstractBlock";
import {NotionBlock} from "../NotionTypes";
import {texts} from "../NotionUtils";
import ArticleList from "../../articles/ArticleList";

export type NotionParagraph = Extract<NotionBlock, { type: 'to_do' }>;

export default class Todo extends AbstractBlock {
  constructor(private readonly block: NotionParagraph, children: AbstractBlock[]) {
    super(block, children);
  }

  public toMarkdown(articles: ArticleList): string {
    const checked = this.block.to_do.checked ? "x" : " ";
    return (`- [${checked}] ${texts(this.block.to_do.rich_text, articles)}`);
  }
}