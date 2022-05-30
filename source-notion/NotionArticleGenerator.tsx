// from https://github.com/alvis/gatsby-source-notion/blob/master/source/markdown.ts

import download from './image';
import { texts, plaintexts, imageUrl, icon } from './notion-utils';
import Page from './Page';
import type { Block, NotionImage } from './Types';
import fs from "fs";

export default class NotionArticleGenerator {
  public constructor(private page: Page) { }

  /**
   * add children content to the parent text if present
   * @param parent first part of the content
   * @param block the content block which may contain children
   * @param indent space to be prefixed to the content per line
   * @returns content with children content if present
   */
  private appendChildren(parent: string, block: Block, indent: string): string {
    const supportedChildren = block.has_children
      ? block.children.filter((child) => child.type !== 'unsupported')
      : [];

    if (supportedChildren.length) {
      const content = this.markdown(supportedChildren, indent);

      // no extra line for list-like items
      const glue = [
        'bulleted_list_item',
        'numbered_list_item',
        'to_do',
        undefined,
      ].includes(supportedChildren[0].type)
        ? ''
        : '\n';

      // the ending \n will be attached to the parent block
      // so removing it from the children content to prevent extra lines
      return parent + '\n' + glue + content.trimRight();
    } else {
      return parent;
    }
  }

  /**
   * convert a Block to markdown format
   * @param block a Block to be parsed
   * @param indent space to be prefixed to the content per line
   * @returns text in markdown format
   */
  private parse(block: Block, indent = ''): string | null {
    const append = (text: string): string =>
      this.appendChildren(text, block, `${indent}  `);

    switch (block.type) {
      case 'heading_1':
        return `# ${texts(block.heading_1.rich_text)}\n`;
      case 'heading_2':
        return `## ${texts(block.heading_2.rich_text)}\n`;
      case 'heading_3':
        return `### ${texts(block.heading_3.rich_text)}\n`;
      case 'paragraph':
        return `${append(texts(block.paragraph.rich_text))}\n`;
      case 'bulleted_list_item':
        return indent + append(`* ${texts(block.bulleted_list_item.rich_text)}`);
      case 'numbered_list_item':
        return indent + append(`1. ${texts(block.numbered_list_item.rich_text)}`);
      case 'to_do': {
        const checked = block.to_do.checked ? 'x' : ' ';
        return indent + append(`- [${checked}] ${texts(block.to_do.rich_text)}`);
      }
      case 'toggle':
        return `${append(texts(block.toggle.rich_text))}\n`;
      case 'child_page':
        return `${append(block.child_page.title)}\n`;
      case 'image':
        let caption:string = undefined;
        if (block.image.caption) {
          caption = plaintexts(block.image.caption);
        }
        return `![${caption || "image"}](${imageUrl(block.image)}${caption ? ` "${caption}"` : ""})\n`;
      case 'unsupported':
        console.warn("Unsupported block type:", block.type);
      default:
        return null;
    }
  }

  /**
   * convert Blocks to markdown format
   * @param blocks Blocks to be parsed
   * @param indent space to be prefixed to the content per line
   * @returns text in markdown format
   */
  private markdown(blocks: Block[], indent = ''): string {
    return blocks
      .map((block) => this.parse(block, indent))
      .filter((text): text is string => text !== null)
      .join('\n');
  }

  private generateFrontMatter() {
    let frontMatter = "---\n";
    frontMatter += `created_time: ${this.page.created_time}\n`;
    frontMatter += `last_edited_time: ${this.page.last_edited_time}\n`;
    frontMatter += `title: ${this.page.title}\n`;
    frontMatter += `category: ${this.page.category}\n`;
    frontMatter += `tags: ${JSON.stringify(this.page.tags)}\n`;
    frontMatter += `cover: ${this.page.cover ? imageUrl(this.page.cover) : ""}\n`;
    frontMatter += `icon: ${this.page.icon ? icon(this.page.icon) : ""}\n`;
    frontMatter += "---\n";
    return frontMatter;
  }

  private async downloadImages() {
    const images: Promise<void>[] = [];
    for(const block of this.page.blocks) {
      if(block.type === "image") {
        images.push(this.downloadImage(block.id, block.image));
      }
    }
    await Promise.all(images);
  }

  private async downloadImage(name: string, block: NotionImage): Promise<void> {
    const image = block.type === "file" ? block.file : block.external;
    await download(image.url, `${this.page.path}/images`, name).then(path => {
      image.url = `./images/${path}`;
    });
  }

  public async generate() {
    fs.mkdirSync(`${this.page.path}/images`, { recursive: true });
    await this.downloadImages();
    if(this.page.cover) {
      await this.downloadImage("cover", this.page.cover);
    }
    if(this.page.icon && this.page.icon.type !== "emoji") {
      await this.downloadImage("icon", this.page.icon as NotionImage);
    }
    const markdown = this.generateFrontMatter() + this.markdown(this.page.blocks);
    fs.writeFileSync(`${this.page.path}/index.md`, markdown);
  }

}