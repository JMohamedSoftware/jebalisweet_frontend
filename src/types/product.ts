export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    originalPrice?: number;
    image: string;
    images?: string[];
    alt: string;
    category: string;
    inStock: boolean;
    stockQuantity?: number;
    rating?: number;
    reviewCount?: number;
    brand?: string;
    priceUnit?: string;
    createdAt?: string;
    approxPieces?: string;
    onOrderOnly?: boolean;
    leadTime?: string;
    sku?: string;
    conservation?: string;
    ingredients?: string;
    variants?: { name: string; options: string[] }[];
}

export interface ProductResponse {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
}
