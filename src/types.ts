/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  image: string;
  rating: number;
  tags: string[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  priceRange: string;
  estimatedTime: string;
  icon: string;
  keyBenefits: string[];
  process: string[];
  image: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  notes?: string;
  address: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amount: number;
  paymentStatus: 'pending' | 'paid';
  createdAt: string;
}

export interface Order {
  id: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  notes?: string;
  total: number;
  paymentMethod: 'mpesa' | 'cash';
  paymentPhone: string;
  mpesaCheckoutId?: string;
  status: 'pending' | 'processing' | 'shipped' | 'completed';
  paymentStatus: 'pending' | 'paid';
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  image: string;
  readTime: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  user: string;
  timestamp: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'unread' | 'read';
  createdAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

export interface StoreSettings {
  shopName: string;
  phone: string;
  email: string;
  location: string;
  mpesaTillNumber: string;
  seoTitle: string;
  seoDescription: string;
  welcomeMessage: string;
}

export interface MediaPhoto {
  id: string;
  url: string;
  title: string;
  description: string;
  category: string;
  uploadedAt: string;
}

