import { PaginateDocument, PaginateResult } from "mongoose";

export class Pagination<T> {

  public docs: T[];
  public total: number;
  public limit: number = 20;
  public offset: number = 0;

  public totalPages: number;
  public page: number; // current page

  constructor() {}



}