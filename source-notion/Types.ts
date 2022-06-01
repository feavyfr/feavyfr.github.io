import { Client } from "@notionhq/client";

export type NotionProperties = Extract<Awaited<ReturnType<Client['databases']['query']>>['results'][number], {properties}>['properties'];
export type NotionBlock = Extract<Awaited<ReturnType<Client['blocks']['retrieve']>>, { type: string }>;
export type NotionImage = Extract<Awaited<ReturnType<Client['blocks']['retrieve']>>, { type: "image" }>["image"];
export type NotionIcon = Extract<Awaited<ReturnType<Client['databases']['query']>>['results'][number], {properties}>['icon'];

export type NotionRichText = Extract<NotionBlock, { type: 'paragraph' }>['paragraph']['rich_text'][number];

export type Block = NotionBlock & ({ has_children: false } | { has_children: true; children: Block[] });