import { Pagination } from "@classes/pagination";
import { PaginateResult } from "mongoose";

export class RepositoryHelperService {

  static fromPaginatedResponse(response: PaginateResult<any>) {
    const pagination = new Pagination<any>();
    pagination.offset = response.offset;
    pagination.total = response.totalDocs;
    pagination.totalPages = response.totalPages;
    pagination.page = response.page;
    pagination.docs = response.docs;
    pagination.limit = response.limit;
    return pagination;
  }

}