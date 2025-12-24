
export interface Seller {
  name: string;
  bio: string;
  avatar: string;
}

export interface FashionItem {
  id: string;
  title: string;
  price: number;
  currency: string;
  imageUrl: string;
  seller: Seller;
  details: string;
  isSold?: boolean;
}

export interface CanvasPosition {
  x: number;
  y: number;
}
