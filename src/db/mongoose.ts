/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose from 'mongoose';
import { 
  Product, Service, Booking, Order, BlogPost, FAQ, 
  Testimonial, AuditLog, Message, Subscriber, StoreSettings, MediaPhoto 
} from '../types';

// Connection state helper
let isConnected = false;

export async function connectMongoDB(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri === 'MY_MONGODB_URI') {
    console.log('MongoDB URI is not set or using default placeholder. Falling back to local file-based database.');
    return false;
  }

  if (isConnected) {
    return true;
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('✅ Connected to MongoDB successfully.');
    return true;
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err);
    isConnected = false;
    return false;
  }
}

export function getIsConnected(): boolean {
  return isConnected;
}

// -------------------------------------------------------------
// SCHEMAS & MODELS
// -------------------------------------------------------------

// 1. Product Schema
const ProductSchema = new mongoose.Schema<Product>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  stock: { type: Number, required: true },
  image: { type: String, required: true },
  rating: { type: Number, required: true, default: 5 },
  tags: { type: [String], default: [] }
});

export const MongoProduct = mongoose.models.Product || mongoose.model<Product>('Product', ProductSchema);

// 2. Service Schema
const ServiceSchema = new mongoose.Schema<Service>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  priceRange: { type: String, required: true },
  estimatedTime: { type: String, required: true },
  icon: { type: String, required: true },
  keyBenefits: { type: [String], default: [] },
  process: { type: [String], default: [] },
  image: { type: String, required: true }
});

export const MongoService = mongoose.models.Service || mongoose.model<Service>('Service', ServiceSchema);

// 3. Booking Schema
const BookingSchema = new mongoose.Schema<Booking>({
  id: { type: String, required: true, unique: true },
  serviceId: { type: String, required: true },
  serviceName: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, default: '' },
  customerPhone: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  notes: { type: String },
  address: { type: String, required: true },
  status: { type: String, required: true, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  amount: { type: Number, required: true, default: 0 },
  paymentStatus: { type: String, required: true, enum: ['pending', 'paid'], default: 'pending' },
  createdAt: { type: String, required: true }
});

export const MongoBooking = mongoose.models.Booking || mongoose.model<Booking>('Booking', BookingSchema);

// 4. Order Schema
const OrderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }
});

const OrderSchema = new mongoose.Schema<Order>({
  id: { type: String, required: true, unique: true },
  items: { type: [OrderItemSchema], required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, default: '' },
  customerPhone: { type: String, required: true },
  address: { type: String, required: true },
  notes: { type: String },
  total: { type: Number, required: true },
  paymentMethod: { type: String, required: true, enum: ['mpesa', 'cash'] },
  paymentPhone: { type: String, required: true },
  mpesaCheckoutId: { type: String },
  status: { type: String, required: true, enum: ['pending', 'processing', 'shipped', 'completed'], default: 'pending' },
  paymentStatus: { type: String, required: true, enum: ['pending', 'paid'], default: 'pending' },
  createdAt: { type: String, required: true }
});

export const MongoOrder = mongoose.models.Order || mongoose.model<Order>('Order', OrderSchema);

// 5. BlogPost Schema
const BlogPostSchema = new mongoose.Schema<BlogPost>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: String, required: true },
  image: { type: String, required: true },
  readTime: { type: String, required: true }
});

export const MongoBlogPost = mongoose.models.BlogPost || mongoose.model<BlogPost>('BlogPost', BlogPostSchema);

// 6. FAQ Schema
const FAQSchema = new mongoose.Schema<FAQ>({
  id: { type: String, required: true, unique: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, required: true }
});

export const MongoFAQ = mongoose.models.FAQ || mongoose.model<FAQ>('FAQ', FAQSchema);

// 7. Testimonial Schema
const TestimonialSchema = new mongoose.Schema<Testimonial>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  content: { type: String, required: true },
  rating: { type: Number, required: true },
  avatar: { type: String, required: true }
});

export const MongoTestimonial = mongoose.models.Testimonial || mongoose.model<Testimonial>('Testimonial', TestimonialSchema);

// 8. AuditLog Schema
const AuditLogSchema = new mongoose.Schema<AuditLog>({
  id: { type: String, required: true, unique: true },
  action: { type: String, required: true },
  details: { type: String, required: true },
  user: { type: String, required: true, default: 'System' },
  timestamp: { type: String, required: true }
});

export const MongoAuditLog = mongoose.models.AuditLog || mongoose.model<AuditLog>('AuditLog', AuditLogSchema);

// 9. Message Schema
const MessageSchema = new mongoose.Schema<Message>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, default: '' },
  phone: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, required: true, enum: ['unread', 'read'], default: 'unread' },
  createdAt: { type: String, required: true }
});

export const MongoMessage = mongoose.models.Message || mongoose.model<Message>('Message', MessageSchema);

// 10. Subscriber Schema
const SubscriberSchema = new mongoose.Schema<Subscriber>({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  createdAt: { type: String, required: true }
});

export const MongoSubscriber = mongoose.models.Subscriber || mongoose.model<Subscriber>('Subscriber', SubscriberSchema);

// 11. StoreSettings Schema
const StoreSettingsSchema = new mongoose.Schema<StoreSettings>({
  shopName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  location: { type: String, required: true },
  mpesaTillNumber: { type: String, required: true },
  seoTitle: { type: String, required: true },
  seoDescription: { type: String, required: true },
  welcomeMessage: { type: String, required: true }
});

export const MongoStoreSettings = mongoose.models.StoreSettings || mongoose.model<StoreSettings>('StoreSettings', StoreSettingsSchema);

// 12. MediaPhoto Schema
const MediaPhotoSchema = new mongoose.Schema<MediaPhoto>({
  id: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  uploadedAt: { type: String, required: true }
});

export const MongoMediaPhoto = mongoose.models.MediaPhoto || mongoose.model<MediaPhoto>('MediaPhoto', MediaPhotoSchema);

