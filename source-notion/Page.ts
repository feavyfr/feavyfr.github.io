import { Block, NotionIcon, NotionImage, NotionProperties } from "./Types";
import { toSlug } from "./articles";
import { plaintexts } from "./notion-utils";

export default interface Page {
    id: string;
    created_time: string;
    last_edited_time: string;
    archived: boolean;
    properties: {[key: string]: any};
    blocks: Block[];
    slug: string;
    title: string;
    tags: string[];
    category: string;
    path: string;
    icon?: NotionIcon;
    cover?: NotionImage;
};

export const setPageProperties = (page: Page) => {
    page.title = plaintexts(page.properties.Name.title);
    if(page.properties.slug?.rich_text.length > 0) {
        page.slug = plaintexts(page.properties.slug.rich_text);
    } else {
        page.slug = toSlug(page.title);
    }
    if(page.properties.category?.select) {
        page.category = page.properties.category.select.name;
    }else{
        page.category = "Non classé";
    }
    if(page.properties.tags?.multi_select) {
        page.tags = page.properties.tags.multi_select.map(select => select.name);
    } else {
        page.tags = [];
    }
        
    page.path = `./src/pages/articles/${page.slug}`;
};