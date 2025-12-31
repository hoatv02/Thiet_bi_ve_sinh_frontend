export interface CartModel {
    productId: number,
    variantId?: number,
    name: string,
    sku: string,
    mainImageUrl: string,
    price: number,
    salePrice: number,
    stockQuantity: number,
    isActive?: boolean
}