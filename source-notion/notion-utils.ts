// from https://github.com/alvis/gatsby-source-notion/blob/master/source/markdown.ts
import type { NotionImage, NotionAPIRichText, NotionIcon } from './Types';

/**
 * convert a RichText block to markdown format
 * @param block a RichText block to be parsed
 * @returns text in markdown format
 */
function text(block: NotionAPIRichText): string {
    let text = block.plain_text;
    if (block.type === "equation") {
        text = block.equation.expression;
    }
    if (block.annotations.bold) {
        text = `**${text}**`;
    }
    if (block.annotations.italic) {
        text = `*${text}*`;
    }
    if (block.annotations.code) {
        text = `\`${text}\``;
    }
    if (block.annotations.strikethrough) {
        text = `~~${text}~~`;
    }
    if (block.type === "equation") {
        text = `$${text}$`;
    }

    return block.href ? `[${text}](${block.href})` : text;
}

/**
 * convert RichText blocks to markdown format
 * @param blocks RichText blocks to be parsed
 * @param indent space to be prefixed to the content per line
 * @returns text in markdown format
 */
export function texts(blocks: NotionAPIRichText[], indent = ''): string {
    return `${indent}${blocks.map(text).join('')}`;
}


/**
 * convert a RichText block to plain text
 * @param block a RichText block to be parsed
 * @returns text in plain text
 */
function plaintext(block: NotionAPIRichText): string {
    return block.plain_text;
}

/**
 * convert RichText blocks to plaintext
 * @param blocks RichText blocks to be parsed
 * @param indent space to be prefixed to the content per line
 * @returns text in markdown format
 */
export function plaintexts(blocks: NotionAPIRichText[], indent = ''): string {
    return `${indent}${blocks.map(plaintext).join('')}`;
}

export function imageUrl(image: NotionImage) {
    return image.type === "external" ? image.external.url : image.file.url;
}

export function icon(icon: NotionIcon) {
    return icon.type === "emoji" ? icon.emoji : imageUrl(icon as NotionImage);
}