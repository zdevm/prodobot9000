import { IsNumber } from "class-validator";

export class PaginateOptions {

    @IsNumber()
    page: number = 1;

    @IsNumber()
    limit: number = 15; // docs per page

}