export interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    imageCover: string;
    images?: string[];
    category: {
      _id: string;
      name: string;
      slug?: string;
    };
    brand?: {
      _id: string;
      name: string;
      slug?: string;
    };
    ratingsAverage?: number;
    ratingsQuantity?: number;
    quantity?: number;
    sold?: number;
    createdAt?: string;
    updatedAt?: string;
    slug?: string;
    priceAfterDiscount?: number;
  }
  
  export interface WishlistItem extends Product {
    addedAt: string;
  }