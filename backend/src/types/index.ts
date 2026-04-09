import { Request } from 'express';

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  cart: ICartItem[];
  wishlist: string[];
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface ICartItem {
  product: string;
  quantity: number;
}

export interface IProduct {
  _id: string;
  name: string;
  category: 'keyboard' | 'mouse' | 'headphone' | 'mousepad' | 'monitor' | 'accessories';
  price: number;
  image: string;
  badge?: 'hot' | 'new' | 'sale' | '';
  features: string[];
  rating: number;
  inStock: boolean;
  description?: string;
}

export interface IOrder {
  _id: string;
  user: string;
  items: IOrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  shippingAddress: IAddress;
  createdAt: Date;
}

export interface IOrderItem {
  product: string;
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

export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}
