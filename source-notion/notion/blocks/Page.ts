import {NotionIcon, NotionImage, NotionImageFile} from "../NotionTypes";
import {toSlug} from "../../utils/articles";
import Block from "./Block";
import {plaintexts} from "../NotionUtils";

export default class Page extends Block {
  created_time: string;
  last_edited_time: string;
  archived: boolean;
  properties: { [key: string]: any };
  slug: string;
  title: string;
  tags: string[];
  category: string;
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
    if (this.properties.category?.select) {
      this.category = this.properties.category.select.name;
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

  public set blocks(blocks: Block[]) {
    this.children.push(...blocks);
  }

  public get blocks() {
    return this.children;
  }

  public toMarkdown() {
    return this.childrenToMarkdown();
  }
};