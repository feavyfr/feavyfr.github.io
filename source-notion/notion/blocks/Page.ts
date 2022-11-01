import {NotionIcon, NotionImage, NotionImageFile, NotionRichText} from "../NotionTypes";
import AbstractBlock from "./AbstractBlock";
import {plaintexts} from "../NotionUtils";
import {toSlug} from "../../articles/utils";
import ArticleList from "../../articles/ArticleList";

export default class Page extends AbstractBlock {
  created_time: string;
  last_edited_time: string;
  archived: boolean;
  properties: { [key: string]: any };
  slug: string;
  title: string;
  tags: string[];
  path: string;
  icon?: NotionIcon;
  cover?: NotionImageFile;

  public constructor(page: any) {
    super(page,  [])
    Object.assign(this, page);

    this.title = plaintexts(this.properties.Name.title);
    if (this.properties.slug?.rich_text.length > 0) {
      this.slug = plaintexts(this.properties.slug.rich_text);
    } else {
      this.slug = toSlug(this.title);
    }
    if (this.properties.tags?.multi_select) {
      this.tags = this.properties.tags.multi_select.map(select => select.name);
    } else {
      this.tags = [];
    }

    if(this.properties.created_date.date) {
      this.created_time = this.properties.created_date.date.start;
      this.last_edited_time = this.properties.created_date.date.start;
    }

    this.path = `./src/articles/${this.slug}`;
  }

  public set blocks(blocks: AbstractBlock[]) {
    this.children.push(...blocks);
  }

  public get blocks() {
    return this.children;
  }

  public toMarkdown(articles: ArticleList) {
    return this.childrenToMarkdown(articles);
  }
};