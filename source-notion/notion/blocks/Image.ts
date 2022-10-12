import Block from "./Block";
import {NotionBlock} from "../NotionTypes";
import {imageUrl, plaintexts} from "../NotionUtils";

export type NotionImage = Extract<NotionBlock, { type: 'image' }>;

export default class Image extends Block {
  public declare image: NotionImage["image"];

  constructor(private readonly block: NotionImage, children: Block[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    let caption: string = undefined;
    if (this.block.image.caption) {
      caption = plaintexts(this.block.image.caption);
    }
    return `![${caption || "image"}](${imageUrl(this.block.image)}${caption ? ` "${caption}"` : ""})\n`;
  }
}