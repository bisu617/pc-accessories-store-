export interface IProduct {
  _id: string;
  name: string;
  category: 'keyboard' | 'mouse' | 'headphone' | 'mousepad' | 'monitor';
  price: number;
  image: string;
  badge?: 'hot' | 'new' | 'sale' | '';
  features: string[];
  rating: number;
  inStock: boolean;
  description?: string;
}

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  cart: ICartItem[];
  wishlist: string[];
  createdAt: string;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
}

export interface ICartResponse {
  items: ICartItem[];
  total: number;
  itemCount: number;
  message?: string;
}

export interface IOrder {
  _id: string;
  user: string;
  items: IOrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: IAddress;
  createdAt: string;
}

export interface IOrderItem {
  product: string | IProduct;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: IUser;
}
