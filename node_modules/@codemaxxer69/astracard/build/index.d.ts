export declare class mewcard {
  constructor(options?: {
    name?: string;
    author?: string;
    color?: string;
    theme?: "theme1" | "theme2" | "theme3" | "theme4" ;
    brightness?: number;
    thumbnail?: string;
    requester?: string;
  });

  public setName(name: string): this;
  public setAuthor(author: string): this;
  public setColor(color: string): this;
  public setTheme(theme: string | "theme1" | "theme2" | "theme3" | "theme4"): this;
  public setBrightness(brightness: number): this;
  public setThumbnail(thumbnail: string): this;
  public setRequester(requester: string): this;

  public build(): Promise<Buffer>;
}