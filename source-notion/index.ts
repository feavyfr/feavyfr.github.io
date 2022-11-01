import * as dotenv from "dotenv"
dotenv.config()

import { deleteArticle, generateArticle, getLocalArticles, getNotionArticles, hasUpdate } from "./utils/articles";

(async () => {
    const [notionArticles, localArticles] = await Promise.all([getNotionArticles("80035349b4bb4c16b89af4f3db64f97e"), getLocalArticles()]);

    const promises: Promise<any>[] = [];

    for (const [_, notion] of notionArticles) {
        if (!localArticles.has(notion.slug)) {
            const p = generateArticle(notion);
            promises.push(p);
            console.log("CREATE article: " + notion.slug);
            continue;
        }

        const local = localArticles.get(notion.slug)!;
        
        if (hasUpdate(local, notion)) {
            console.log("UPDATE article: " + notion.slug);
            const p = deleteArticle(local)
                        .then(() => generateArticle(notion));
            promises.push(p);
            continue;
        }
        console.log("UNCHANGED article: " + notion.slug);
    }

    for (const [slug, local] of localArticles) {
        if (!notionArticles.has(slug)) {
            console.log("DELETE article: " + local.slug);
            const p = deleteArticle(local);
            promises.push(p);
        }
    }

    await Promise.all(promises);

    console.log("DONE");
})();
