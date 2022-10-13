import fs from "fs";
import NotionAPI from "../notion/NotionAPI";
import NotionMarkdownGenerator from "../notion/NotionMarkdownGenerator";
import Page from "../notion/blocks/Page";

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
        .replace(/--+/g, '-')
        .replace(/-$/g, '');
}

export const notion = new NotionAPI(process.env.GATSBY_NOTION_TOKEN);

export interface LocalArticle {
    slug: string;
    last_edited_time: string;
}

export async function getLocalArticles() {
    const slugs = listDirectories("./src/articles");
    const articles: Map<string, LocalArticle> = new Map();
    const promises: Promise<void>[] = [];
    for (const slug of slugs) {
        promises.push(new Promise(resolve => {
            if(!fs.existsSync(`./src/articles/${slug}/index.md`)) {
                resolve();
                return;
            }
            const stream = fs.createReadStream(`./src/articles/${slug}/index.md`, { encoding: "utf-8", start: 0, end: 200 });
            stream.on("data", (data: string) => {
                const last_edited_time = data.split("last_edited_time: ")[1].split(/\r?\n/)[0];
                articles.set(slug, { slug, last_edited_time });
                resolve();
            });
        }));
    }
    await Promise.all(promises);
    return articles;
}

export async function getNotionArticles(database_id: string) {
    const pages = await notion.getPages(database_id);
    return new Map(pages.filter(page => !page.slug.toLowerCase().startsWith("draft"))
        .map(page => [page.slug, page])
    );
}

export function hasUpdate(local: LocalArticle, notion: Page) {
    return local.last_edited_time !== notion.last_edited_time;
}

export async function generateArticle(article: Page) {
    await notion.setPageBlocks(article);
    await new NotionMarkdownGenerator(article).generate();
}

export async function deleteArticle(article: LocalArticle) {
    return new Promise(resolve => fs.rm(`./src/articles/${article.slug}/`, { recursive: true, force: true }, resolve));
}