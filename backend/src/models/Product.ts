import mongoose, { Schema, Document } from 'mongoose';

export interface IProductDocument extends Document {
  name: string;
  category: string;
  price: number;
  image: string;
  badge?: string;
  features: string[];
  rating: number;
  inStock: boolean;
  description?: string;
}

const productSchema = new Schema<IProductDocument>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['keyboard', 'mouse', 'headphone', 'mousepad', 'monitor', 'accessories'],
      lowercase: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      required: [true, 'Image path is required'],
    },
    badge: {
      type: String,
      enum: ['hot', 'new', 'sale', ''],
      default: '',
    },
    features: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for filtering and sorting
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

const Product = mongoose.model<IProductDocument>('Product', productSchema);
export default Product;
