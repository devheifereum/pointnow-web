export const PAGINATION_PAGE = 1;
export const PAGINATION_LIMIT = 10;



export interface PaginationMetadata {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
}