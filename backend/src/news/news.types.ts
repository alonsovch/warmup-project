export interface NewsItem {
    title: string | null;
    url: string | null;
    author: string;
    createdAt: Date;
}
  
export interface NewsHit {
    story_title?: string;
    title?: string;
    story_url?: string;
    url?: string;
    author?: string;
    created_at: string;
}