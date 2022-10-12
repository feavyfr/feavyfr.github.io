import {NotionIcon, NotionImage} from "./NotionTypes";
import {toSlug} from "../articles";
import Block from "./blocks/Block";
import {plaintexts} from "./NotionUtils";

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
  cover?: NotionImage;

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