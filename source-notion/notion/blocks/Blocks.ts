import Block from "./Block";
import Heading1 from "./Heading1";
import {NotionBlock} from "../NotionTypes";
import Heading2 from "./Heading2";
import Heading3 from "./Heading3";
import Paragraph from "./Paragraph";
import BulletedListItem from "./BulletedListItem";
import NumberedListItem from "./NumberedListItem";
import Todo from "./Todo";
import Toggle from "./Toggle";
import ChildPage from "./ChildPage";
import Image from "./Image";
import Code from "./Code";

type BlockConstructor<T extends Block, B extends NotionBlock> = new (block: B, children: Block[]) => T;

export default class Blocks {
  private static readonly blocks = new Map<string, BlockConstructor<any, any>>();

  static {
    Blocks.register("heading_1", Heading1);
    Blocks.register("heading_2", Heading2);
    Blocks.register("heading_3", Heading3);
    Blocks.register("paragraph", Paragraph);
    Blocks.register("bulleted_list_item", BulletedListItem);
    Blocks.register("numbered_list_item", NumberedListItem);
    Blocks.register("to_do", Todo);
    Blocks.register("toggle", Toggle);
    Blocks.register("child_page", ChildPage);
    Blocks.register("image", Image);
    Blocks.register("code", Code);
  }

  private static register(type: string, block: BlockConstructor<any, any>) {
    Blocks.blocks.set(type, block);
  }

  public static create(block: NotionBlock, children: Block[]): Block {
    const ctor = Blocks.blocks.get(block.type);
    if(!ctor) {
      return null;
    }
    return new ctor(block, children);
  }

}