import downloadImage from './image';
import { blocksToMarkdown, imageUrl, icon } from './notion-to-markdown';
import Page from './Page';
import type { NotionImage } from './Types';
import fs from "fs";

export default class NotionArticleGenerator {
  public constructor(private page: Page) { }

  private generateFrontMatter() {
    let frontMatter = "---\n";
    frontMatter += `created_time: ${this.page.created_time}\n`;
    frontMatter += `last_edited_time: ${this.page.last_edited_time}\n`;
    frontMatter += `title: ${this.page.title}\n`;
    frontMatter += `category: ${this.page.category}\n`;
    frontMatter += `tags: ${JSON.stringify(this.page.tags)}\n`;
    frontMatter += `cover: ${imageUrl(this.page.cover) || ""}\n`;
    frontMatter += `icon: ${icon(this.page.icon) || ""}\n`;
    frontMatter += "---\n";
    return frontMatter;
  }

  private generateContent() {
    return blocksToMarkdown(this.page.blocks);
  }

  private async generateImages() {
    const images: Promise<void>[] = [];
    for (const block of this.page.blocks) {
      if (block.type === "image") {
        images.push(this.generateImage(block.id, block.image));
      }
    }
    await Promise.all(images);
  }

  private async generateImage(name: string, block: NotionImage): Promise<void> {
    const image = block.type === "file" ? block.file : block.external;
    await downloadImage(image.url, `${this.page.path}/images`, name).then(path => {
      image.url = `./images/${path}`;
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