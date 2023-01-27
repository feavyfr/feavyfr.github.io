import {NotionIcon, NotionImageFile, NotionRichText} from "./NotionTypes";
import ArticleList from "../articles/ArticleList";

function escape(str: string) {
  return str.replaceAll(/"/g, '\\"');
}

// TODO : remplacer par une classe TextFormatter, plus propre
function text(block: NotionRichText, articles: ArticleList): string {
  let text = block.plain_text;
  if (block.type === "equation")
    text = block.equation.expression;

  if (block.type === "mention" && block.mention.type === "page") {
    const page = articles.get(block.mention.page.id)
    if (page) {
      if (page.icon.type === "emoji" && page.icon.emoji) {
        text = `${icon(page.icon)} ${page.title}`;
      } else {
        text = page.title;
      }
      return `<PageMention caption="${escape(text)}" url="/articles/${page.slug}"/>`;
    }
  }

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
  if (block.href) {
    if (block.href.startsWith("https://www.notion.so/") || block.href.startsWith("/")) {
      const id = block.href.substring(block.href.length - 32, block.href.length);
      const page = articles.get(id);
      text = page ? `[${text}](/articles/${page.slug})` : `[${text}](${block.href})`;
    } else {
      text = `[${text}](${block.href})`;
    }
  }

  return text;
}

export function texts(blocks: NotionRichText[], articles: ArticleList): string {
  return `${blocks.map(block => text(block, articles)).join("")}`;
}

function plaintext(block: NotionRichText): string {
  return block.plain_text;
}

export function plaintexts(blocks: NotionRichText[], indent = ""): string {
  return `${indent}${blocks.map(plaintext).join("")}`;
}

export function imageUrl(image: NotionImageFile) {
  if (!image) return null;
  return image.type === "external" ? image.external.url : image.file.url;
}

export function icon(icon: NotionIcon) {
  if (!icon) return null;
  return icon.type === "emoji" ? icon.emoji : imageUrl({...icon, caption: null});
}