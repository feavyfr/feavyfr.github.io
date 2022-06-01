// From https://github.com/alvis/gatsby-source-notion/blob/master/source/markdown.ts
// Refactored
import type { NotionImage, NotionRichText, NotionIcon, Block } from "./Types";

/**
 * convert a RichText block to markdown format
 * @param block a RichText block to be parsed
 * @returns text in markdown format
 */
function text(block: NotionRichText): string {
    let text = block.plain_text;
    if (block.type === "equation")
        text = block.equation.expression;

    if (block.annotations.bold)
        text = `**${text}**`;
    if (block.annotations.italic)
        text = `*${text}*`;
    if (block.annotations.code)
        text = `\`${text}\``;
    if (block.annotations.strikethrough)
        text = `~~${text}~~`;
    if (block.type === "equation")
        text = `$${text}$`;
    if (block.href)
        text = `[${text}](${block.href})`;

    return text;
}

/**
 * convert RichText blocks to markdown format
 * @param blocks RichText blocks to be parsed
 * @param indent space to be prefixed to the content per line
 * @returns text in markdown format
 */
export function texts(blocks: NotionRichText[], indent = ""): string {
    return `${indent}${blocks.map(text).join("")}`;
}


/**
 * convert a RichText block to plain text
 * @param block a RichText block to be parsed
 * @returns text in plain text
 */
function plaintext(block: NotionRichText): string {
    return block.plain_text;
}

/**
 * convert RichText blocks to plaintext
 * @param blocks RichText blocks to be parsed
 * @param indent space to be prefixed to the content per line
 * @returns text in markdown format
 */
export function plaintexts(blocks: NotionRichText[], indent = ""): string {
    return `${indent}${blocks.map(plaintext).join("")}`;
}

export function imageUrl(image: NotionImage) {
    if(!image) return null;
    return image.type === "external" ? image.external.url : image.file.url;
}

export function icon(icon: NotionIcon) {
    if(!icon) return null;
    return icon.type === "emoji" ? icon.emoji : imageUrl({ ...icon, caption: null });
}

/**
 * add children content to the parent text if present
 * @param parent first part of the content
 * @param block the content block which may contain children
 * @param indent space to be prefixed to the content per line
 * @returns content with children content if present
 */
export function appendChildren(parent: string, block: Block, indent: string): string {
    const supportedChildren = block.has_children
        ? block.children.filter((child) => child.type !== "unsupported")
        : [];

    if (supportedChildren.length) {
        const content = blocksToMarkdown(supportedChildren, indent);

        // no extra line for list-like items
        const glue = [
            "bulleted_list_item",
            "numbered_list_item",
            "to_do",
            undefined,
        ].includes(supportedChildren[0].type)
            ? ""
            : "\n";

        // the ending \n will be attached to the parent block
        // so removing it from the children content to prevent extra lines
        return parent + "\n" + glue + content.trimEnd();
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
export function blockToMarkdown(block: Block, indent = ""): string | null {
    const append = (text: string): string =>
        appendChildren(text, block, `${indent}  `);

    switch (block.type) {
        case "heading_1":
            return `# ${texts(block.heading_1.rich_text)}\n`;
        case "heading_2":
            return `## ${texts(block.heading_2.rich_text)}\n`;
        case "heading_3":
            return `### ${texts(block.heading_3.rich_text)}\n`;
        case "paragraph":
            return `${append(texts(block.paragraph.rich_text))}\n`;
        case "bulleted_list_item":
            return indent + append(`* ${texts(block.bulleted_list_item.rich_text)}`);
        case "numbered_list_item":
            return indent + append(`1. ${texts(block.numbered_list_item.rich_text)}`);
        case "to_do": {
            const checked = block.to_do.checked ? "x" : " ";
            return indent + append(`- [${checked}] ${texts(block.to_do.rich_text)}`);
        }
        case "toggle":
            return `${append(texts(block.toggle.rich_text))}\n`;
        case "child_page":
            return `${append(block.child_page.title)}\n`;
        case "image":
            let caption: string = undefined;
            if (block.image.caption) {
                caption = plaintexts(block.image.caption);
            }
            return `![${caption || "image"}](${imageUrl(block.image)}${caption ? ` "${caption}"` : ""})\n`;
        case "unsupported":
            return null;
        default:
            console.warn("Unsupported block type:", block.type);
            return null;
    }
}

/**
 * convert Blocks to markdown format
 * @param blocks Blocks to be parsed
 * @param indent space to be prefixed to the content per line
 * @returns text in markdown format
 */
export function blocksToMarkdown(blocks: Block[], indent = ""): string {
    return blocks
        .map((block) => blockToMarkdown(block, indent))
        .filter((text): text is string => text !== null)
        .join("\n");
}