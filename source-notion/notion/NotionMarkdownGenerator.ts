import downloadImage from '../utils/image';
import Page from './blocks/Page';
import fs from "fs";
import {icon, imageUrl} from "./NotionUtils";
import Image from "./blocks/Image";
import {NotionImageFile, NotionRichText} from "./NotionTypes";
import ArticleList from "../articles/ArticleList";

export default class NotionMarkdownGenerator {
  public constructor(private page: Page, private articles: ArticleList) { }

  private generateFrontMatter() {
    let frontMatter = "---\n";
    frontMatter += `created_time: ${this.page.created_time}\n`;
    frontMatter += `last_edited_time: ${this.page.last_edited_time}\n`;
    frontMatter += `slug: ${this.page.slug}\n`;
    frontMatter += `title: "${this.page.title.replace('"', '\\"')}"\n`;

    frontMatter += `tags: ${JSON.stringify(this.page.tags)}\n`;

    if(this.page.cover)
      frontMatter += `cover: ${imageUrl(this.page.cover) || ""}\n`;

    if(this.page.icon) {
      const type = this.page.icon.type === "emoji" ? "emoji" : "image";
      frontMatter += `icon_${type}: ${icon(this.page.icon)}\n`;
    }

    frontMatter += "---\n";
    return frontMatter;
  }

  private generateContent() {
    return this.page.toMarkdown(this.articles);
  }

  private async generateImages() {
    const images: Promise<void>[] = [];
    this.page.visitDeep(block => {
      if (block instanceof Image) {
        images.push(this.generateImage(block.id, block.image));
      }
    });
    await Promise.all(images);
  }

  private async generateImage(name: string, block: NotionImageFile): Promise<void> {
    const image = block.type === "file" ? block.file : block.external;
    await downloadImage(image.url, `${this.page.path}/images`, name).then(data => {
      image.url = `./images/${data.path}`;
      block.width = data.width;
      block.height = data.height;
    });
  }

  public async generate() {
    fs.mkdirSync(`${this.page.path}/images`, { recursive: true });
    await this.generateImages();
    if (this.page.cover) {
      await this.generateImage("cover", this.page.cover);
    }
    if (this.page.icon && this.page.icon.type !== "emoji") {
      await this.generateImage("icon", { ...this.page.icon, caption: null });
    }

    const content = this.generateFrontMatter() + this.generateContent();
    fs.writeFileSync(`${this.page.path}/index.md`, content);
  }

}