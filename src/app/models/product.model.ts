export interface PagedProductRequest {
    pageNumber: number,
    pageSize: number,
    cateId?: number | null;
    searchText?: string,
    filter?: string,
    sort?: string,
    typeId?: number | null;
    priceFrom?: number,
    priceTo?: number,
    brandId?: number,
    isActive?: number,
    stockQuantityValue?: number | null;            // số lượng để so sánh
    stockQuantityOp?: 'gt' | 'lt' | 'eq' | '>' | '<' | '=' | null; // toán tử
}

export interface ExportProductRequest {
    productId: number[]
}