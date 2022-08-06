import { Expose } from "class-transformer";
import { readFileSync } from "fs";

export class File {
  private buffer?: Buffer;

  @Expose()
  public id: string;
  @Expose()
  public filename: string; // without ext
  @Expose()
  public fullPath: string;
  @Expose()
  public ext: string;
  @Expose()
  public mimeType: string | null = null;
  @Expose()
  public storage: 'local';

  get content(): Buffer {
    if (!this.buffer) {
      this.buffer = readFileSync(this.fullPath)
    }
    return this.buffer;
  }

}