import { Expose } from "class-transformer";

export class File {

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

}