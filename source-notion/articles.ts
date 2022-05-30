import fs from "fs";
import Notion from "./Notion";
import NotionArticleGenerator from "./NotionArticleGenerator";
import Page from "./Page";

export const listDirectories = (source: string) =>
fs.readdirSync(source, { withFileTypes: true })
.filter(dirent => dirent.isDirectory())
.map(dirent => dirent.name);

export function toSlug(text: string) {
    return text.normalize('NFKD')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/\-$/g, '');
}

export const notion = new Notion(process.env.GATSBY_NOTION_TOKEN);

export interface LocalArticle {
    slug: string;
    last_edited_time: string;
}

export async function getLocalArticles() {
    const slugs = listDirectories("./src/pages/articles");
    const pages: Map<string, LocalArticle> = new Map();
    const promises: Promise<void>[] = [];
    for (const slug of slugs) {
        promises.push(new Promise(resolve => {
            const stream = fs.createReadStream(`./src/pages/articles/${slug}/index.md`, { encoding: "utf-8", start: 0, end: 200 });
            stream.on("data", (data: string) => {
                const last_edited_time = data.split("last_edited_time: ")[1].split(/\r?\n/)[0];
                pages.set(slug, { slug, last_edited_time });
                resolve();
            });
        }));
    }
    await Promise.all(promises);
    return pages;
}

export async function getNotionArticles() {
    const pages = await notion.getPages("80035349b4bb4c16b89af4f3db64f97e");
    return new Map(pages.filter(page => !page.slug.toLowerCase().startsWith("draft"))
                    .map(page => [page.slug, page])
                );
}

export function hasUpdate(local: LocalArticle, notion: Page) {
    return local.last_edited_time !== notion.last_edited_time;
}

export async function deleteArticle(article: LocalArticle) {
    return new Promise(resolve => fs.rm(`./src/pages/articles/${article.slug}/`, { recursive: true, force: true }, resolve));
}

export async function generateArticle(article: Page) {
    await notion.setPageBlocks(article);
    await new NotionArticleGenerator(article).generate();
}