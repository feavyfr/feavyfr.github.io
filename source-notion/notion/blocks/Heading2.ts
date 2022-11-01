import AbstractBlock from "./AbstractBlock";
import {NotionBlock} from "../NotionTypes";
import {texts} from "../NotionUtils";
import ArticleList from "../../articles/ArticleList";

export type NotionHeading1 = Extract<NotionBlock, { type: 'heading_2' }>;

export default class Heading2 extends AbstractBlock {
  constructor(private readonly block: NotionHeading1, children: AbstractBlock[]) {
    super(block, children);
  }

  public toMarkdown(articles: ArticleList): string {
    return `### ${texts(this.block.heading_2.rich_text, articles)}\n`;
  }
}