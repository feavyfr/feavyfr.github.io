import Block from "./Block";
import {NotionBlock} from "../NotionTypes";

export type NotionColumnList = Extract<NotionBlock, { type: 'column_list' }>;

export default class ColumnList extends Block {
  constructor(private readonly block: NotionColumnList, children: Block[]) {
    super(block, children);
  }

  public toMarkdown(): string {
    let ret = "<div class=\"columns\">\n";
    for(const column of this.children) {
      ret += `<div class="column">\n\n${column.toMarkdown()}\n</div>\n`;
    }
    ret += "</div>\n";
    return ret;
  }
}