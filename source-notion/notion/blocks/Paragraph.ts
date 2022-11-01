import AbstractBlock from "./AbstractBlock";
import {NotionBlock} from "../NotionTypes";
import {texts} from "../NotionUtils";
import articles from "../../../src/pages/articles";
import ArticleList from "../../articles/ArticleList";

export type NotionParagraph = Extract<NotionBlock, { type: 'paragraph' }>;

export default class Paragraph extends AbstractBlock {
  constructor(private readonly block: NotionParagraph, children: AbstractBlock[]) {
    super(block, children);
  }

  public toMarkdown(articles: ArticleList): string {
    return `${texts(this.block.paragraph.rich_text, articles)}\n`;
  }
}