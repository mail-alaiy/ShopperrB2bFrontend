export interface ProductImage {
  position: number;
  src: string;
  varient_id: string;
}

export interface Product {
  _id: string;
  name: string;
  handle: string;
  price: number;
  mrp: number;
  sp: number;
  quantity: number;
  description: string;
  imgUrl: ProductImage[];
  brand?: string;
  category: string;
  code: string;
}

export interface ProductResponse {
  message: string;
  payload: Product[];
}
