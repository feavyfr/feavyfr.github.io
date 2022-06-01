import { deleteArticle, generateArticle, getLocalArticles, getNotionArticles, hasUpdate } from "./articles";

(async () => {
    const [notionArticles, localArticles] = await Promise.all([getNotionArticles("80035349b4bb4c16b89af4f3db64f97e"), getLocalArticles()]);

    for (const [_, notion] of notionArticles) {
        if (!localArticles.has(notion.slug)) {
            generateArticle(notion);
            console.log("CREATE article: " + notion.slug);
            continue;
        }

        const local = localArticles.get(notion.slug)!;
        
        if (hasUpdate(local, notion)) {
            console.log("UPDATE article: " + notion.slug);
            deleteArticle(local)
                .then(() => generateArticle(notion));
            continue;
        }
        console.log("UNCHANGED article: " + notion.slug);
    }

    for (const [slug, local] of localArticles) {
        if (!notionArticles.has(slug)) {
            console.log("DELETE article: " + local.slug);
            deleteArticle(local)
        }
    }

})();
