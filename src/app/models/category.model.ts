import { ProductResponse } from "../services/product.service";

export interface CategoryResponse {
    name: string,
    parentId: number;
    img?: string,
    products: ProductResponse[],
    createdAt: string,
    updatedAt: string,
}

export interface CategoryRequest {
    id?: number,
    name: string,
    parentId: number,
    img?: File, 
}