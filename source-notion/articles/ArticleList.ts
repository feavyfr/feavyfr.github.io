import Page from "../notion/blocks/Page";

export default class ArticleList {
  private readonly articlesById: Map<string, Page>;

  constructor(articles: Page[]) {
    this.articlesById = new Map(articles.map(article => [article.id, article]));
  }

  public get(id: string): Page | undefined {
    let page = this.articlesById.get(id);
    if(!page) {
      // add dashes to id to make it in uuid format
      id = id.slice(0, 8) + "-" + id.slice(8, 12) + "-" + id.slice(12, 16) + "-" + id.slice(16, 20) + "-" + id.slice(20);
      page = this.articlesById.get(id);
    }
    return page;
  }
}