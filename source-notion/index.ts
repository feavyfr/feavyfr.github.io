import { deleteArticle, generateArticle, getLocalArticles, getNotionArticles, hasUpdate } from "./articles";

(async () => {
    const [notionArticles, localArticles] = await Promise.all([getNotionArticles(), getLocalArticles()]);

    for (const [_, notion] of notionArticles) {
        if (!localArticles.has(notion.slug)) {
            // console.dir(notion);
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
