export type LocalData = {
  bookmarks?: Bookmarks;
};

export type Bookmarks = {
  [url: string]: Bookmark;
};

export interface Bookmark {
  title: string;
  url: string;
  content?: string;
  tags: Tag[];
}

export interface Tag {
  name: string;
}
