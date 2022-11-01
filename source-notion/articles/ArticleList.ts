import Page from "../notion/blocks/Page";

export default class ArticleList {
  private readonly articlesById: Map<string, Page>;

  constructor(articles: Page[]) {
    this.articlesById = new Map(articles.map(article => [article.id, article]));
  }

  public get(id: string): Page | undefined {
    return this.articlesById.get(id);
  }
}