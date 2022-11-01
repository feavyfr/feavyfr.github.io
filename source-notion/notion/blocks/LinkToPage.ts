import AbstractBlock from "./AbstractBlock";
import {NotionBlock} from "../NotionTypes";
import ArticleList from "../../articles/ArticleList";

export type NotionLinkToPage = Extract<NotionBlock, { type: 'link_to_page' }>;

export default class LinkToPage extends AbstractBlock {
  public readonly page_id;

  constructor(private readonly block: NotionLinkToPage, children: AbstractBlock[]) {
    super(block, children);
    if ("page_id" in block.link_to_page) {
      this.page_id = block.link_to_page.page_id;
    }
  }

  public toMarkdown(articles: ArticleList): string {
    if (this.page_id) {
      const article = articles.get(this.page_id);
      if (article) {
        return `[${article.title}](/articles/${article.slug})\n`;
      }else{
        return `Page not found ${this.page_id}\n`;
      }
    }
  }
}