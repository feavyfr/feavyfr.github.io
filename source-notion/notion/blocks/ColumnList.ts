import Block from "./Block";
import {NotionBlock} from "../NotionTypes";
import Image from "./Image";

export type NotionColumnList = Extract<NotionBlock, { type: 'column_list' }>;

export default class ColumnList extends Block {
  constructor(private readonly block: NotionColumnList, children: Block[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    const onlyImages = this.children.every(column => column.children.some(block => block instanceof Image));

    let ret = "<div class=\"columns\">\n";
    for(const column of this.children) {
      if(onlyImages) {
        ret += `<div class="column" style="flex-grow: 1">\n\n${column.toMarkdown()}\n</div>\n`;
      }else{
        ret += `<div class="column">\n\n${column.toMarkdown()}\n</div>\n`;
      }
    }
    ret += "</div>\n";
    return ret;
  }
}