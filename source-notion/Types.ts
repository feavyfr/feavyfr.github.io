import { Client } from "@notionhq/client";

export type NotionProperties = Extract<Awaited<ReturnType<Client['databases']['query']>>['results'][0], {properties}>['properties'];
export type NotionBlock = Extract<Awaited<ReturnType<Client['blocks']['retrieve']>>, { type: string }>;
export type NotionImage = Extract<Awaited<ReturnType<Client['blocks']['retrieve']>>, { type: "image" }>["image"];
export type NotionIcon = Extract<Awaited<ReturnType<Client['databases']['query']>>['results'][0], {properties}>['icon'];

export type NotionAPIRichText = Extract<
  NotionAPIBlock,
  {
    type: 'paragraph';
  }
>['paragraph']['rich_text'][number];

export type NotionAPIBlock = Extract<
  Awaited<ReturnType<Client['blocks']['retrieve']>>,
  { type: string }
>;

export type Block = NotionAPIBlock &
  ({ has_children: false } | { has_children: true; children: Block[] });