/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  Product, Service, Booking, Order, BlogPost, FAQ, 
  Testimonial, StoreSettings, Message, Subscriber, AuditLog, MediaPhoto 
} from '../types';
import { 
  initialProducts, initialServices, initialBlogPosts, 
  initialFAQs, initialTestimonials, initialSettings, initialPhotos 
} from './seedData';
import {
  connectMongoDB, getIsConnected,
  MongoProduct, MongoService, MongoBooking, MongoOrder, 
  MongoBlogPost, MongoFAQ, MongoTestimonial, MongoStoreSettings, 
  MongoMessage, MongoSubscriber, MongoAuditLog, MongoMediaPhoto
} from './mongoose';

// Resolve directory pathing
const DATA_DIR = path.join(process.cwd(), 'data');

// Create the data directory if it doesn't exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Collection file paths
const PATHS = {
  products: path.join(DATA_DIR, 'products.json'),
  services: path.join(DATA_DIR, 'services.json'),
  bookings: path.join(DATA_DIR, 'bookings.json'),
  orders: path.join(DATA_DIR, 'orders.json'),
  blogs: path.join(DATA_DIR, 'blogs.json'),
  faqs: path.join(DATA_DIR, 'faqs.json'),
  testimonials: path.join(DATA_DIR, 'testimonials.json'),
  settings: path.join(DATA_DIR, 'settings.json'),
  messages: path.join(DATA_DIR, 'messages.json'),
  subscribers: path.join(DATA_DIR, 'subscribers.json'),
  auditLogs: path.join(DATA_DIR, 'auditlogs.json'),
  photos: path.join(DATA_DIR, 'photos.json'),
};

// Local JSON File helper reads
function readJSONFile<T>(filePath: string, defaultValue: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      writeJSONFile(filePath, defaultValue);
      return defaultValue;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`Error reading database file: ${filePath}`, error);
    return defaultValue;
  }
}

function writeJSONFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing database file: ${filePath}`, error);
  }
}

// Runtime memory cache for instantaneous reads
let cache = {
  products: [] as Product[],
  services: [] as Service[],
  bookings: [] as Booking[],
  orders: [] as Order[],
  blogs: [] as BlogPost[],
  faqs: [] as FAQ[],
  testimonials: [] as Testimonial[],
  settings: initialSettings as StoreSettings,
  messages: [] as Message[],
  subscribers: [] as Subscriber[],
  auditLogs: [] as AuditLog[],
  photos: [] as MediaPhoto[],
};

// Database wrapper and state manager
export const db = {
  /**
   * Initializes connection and loads collections into runtime cache
   */
  init: async () => {
    const connected = await connectMongoDB();

    if (connected) {
      try {
        console.log('Loading database records from MongoDB...');
        
        // 1. Products
        const dbProducts = await MongoProduct.find().lean();
        if (dbProducts.length === 0) {
          console.log('Seeding initial products into MongoDB...');
          await MongoProduct.insertMany(initialProducts);
          cache.products = [...initialProducts];
        } else {
          cache.products = dbProducts as any;
        }

        // 2. Services
        const dbServices = await MongoService.find().lean();
        if (dbServices.length === 0) {
          console.log('Seeding initial services into MongoDB...');
          await MongoService.insertMany(initialServices);
          cache.services = [...initialServices];
        } else {
          cache.services = dbServices as any;
        }

        // 3. Bookings
        cache.bookings = (await MongoBooking.find().lean()) as any;

        // 4. Orders
        cache.orders = (await MongoOrder.find().lean()) as any;

        // 5. Blogs
        const dbBlogs = await MongoBlogPost.find().lean();
        if (dbBlogs.length === 0) {
          console.log('Seeding initial blogs into MongoDB...');
          await MongoBlogPost.insertMany(initialBlogPosts);
          cache.blogs = [...initialBlogPosts];
        } else {
          cache.blogs = dbBlogs as any;
        }

        // 6. FAQs
        const dbFAQs = await MongoFAQ.find().lean();
        if (dbFAQs.length === 0) {
          console.log('Seeding initial FAQs into MongoDB...');
          await MongoFAQ.insertMany(initialFAQs);
          cache.faqs = [...initialFAQs];
        } else {
          cache.faqs = dbFAQs as any;
        }

        // 7. Testimonials
        const dbTestimonials = await MongoTestimonial.find().lean();
        if (dbTestimonials.length === 0) {
          console.log('Seeding initial testimonials into MongoDB...');
          await MongoTestimonial.insertMany(initialTestimonials);
          cache.testimonials = [...initialTestimonials];
        } else {
          cache.testimonials = dbTestimonials as any;
        }

        // 8. Settings
        const dbSettings = await MongoStoreSettings.findOne().lean();
        if (!dbSettings) {
          console.log('Seeding initial store settings into MongoDB...');
          await MongoStoreSettings.create(initialSettings);
          cache.settings = { ...initialSettings };
        } else {
          cache.settings = dbSettings as any;
        }

        // 9. Messages
        cache.messages = (await MongoMessage.find().lean()) as any;

        // 10. Subscribers
        cache.subscribers = (await MongoSubscriber.find().lean()) as any;

        // 11. Audit Logs
        cache.auditLogs = (await MongoAuditLog.find().sort({ timestamp: -1 }).limit(500).lean()) as any;

        // 12. Media Photos
        const dbPhotos = await MongoMediaPhoto.find().lean();
        if (dbPhotos.length === 0) {
          console.log('Seeding initial photos into MongoDB...');
          await MongoMediaPhoto.insertMany(initialPhotos);
          cache.photos = [...initialPhotos];
        } else {
          cache.photos = dbPhotos as any;
        }

        console.log('✅ Database state successfully loaded and cached from MongoDB.');
        
        // Write a copy to local JSON files to keep local fallback in sync
        db.saveAllToLocalFiles();
      } catch (err) {
        console.error('❌ Failed to fetch documents from MongoDB. Falling back to local JSON cache.', err);
        db.loadFromLocalFiles();
      }
    } else {
      console.log('MongoDB connection skipped/unavailable. Loading standard file database.');
      db.loadFromLocalFiles();
    }
  },

  /**
   * Safe fallback load from local JSON collections
   */
  loadFromLocalFiles: () => {
    cache.products = readJSONFile<Product[]>(PATHS.products, initialProducts);
    cache.services = readJSONFile<Service[]>(PATHS.services, initialServices);
    cache.bookings = readJSONFile<Booking[]>(PATHS.bookings, []);
    cache.orders = readJSONFile<Order[]>(PATHS.orders, []);
    cache.blogs = readJSONFile<BlogPost[]>(PATHS.blogs, initialBlogPosts);
    cache.faqs = readJSONFile<FAQ[]>(PATHS.faqs, initialFAQs);
    cache.testimonials = readJSONFile<Testimonial[]>(PATHS.testimonials, initialTestimonials);
    cache.settings = readJSONFile<StoreSettings>(PATHS.settings, initialSettings);
    cache.messages = readJSONFile<Message[]>(PATHS.messages, []);
    cache.subscribers = readJSONFile<Subscriber[]>(PATHS.subscribers, []);
    cache.auditLogs = readJSONFile<AuditLog[]>(PATHS.auditLogs, []);
    cache.photos = readJSONFile<MediaPhoto[]>(PATHS.photos, initialPhotos);
    console.log('🏠 Loaded all collections from local filesystem storage.');
  },

  /**
   * Keeps local filesystem backup updated
   */
  saveAllToLocalFiles: () => {
    writeJSONFile(PATHS.products, cache.products);
    writeJSONFile(PATHS.services, cache.services);
    writeJSONFile(PATHS.bookings, cache.bookings);
    writeJSONFile(PATHS.orders, cache.orders);
    writeJSONFile(PATHS.blogs, cache.blogs);
    writeJSONFile(PATHS.faqs, cache.faqs);
    writeJSONFile(PATHS.testimonials, cache.testimonials);
    writeJSONFile(PATHS.settings, cache.settings);
    writeJSONFile(PATHS.messages, cache.messages);
    writeJSONFile(PATHS.subscribers, cache.subscribers);
    writeJSONFile(PATHS.auditLogs, cache.auditLogs);
    writeJSONFile(PATHS.photos, cache.photos);
  },

  // Products
  getProducts: () => cache.products,
  saveProducts: (products: Product[]) => {
    cache.products = products;
    writeJSONFile(PATHS.products, products);
    if (getIsConnected()) {
      (async () => {
        try {
          await MongoProduct.deleteMany({});
          if (products.length > 0) {
            await MongoProduct.insertMany(products);
          }
        } catch (err) {
          console.error('MERN DB Sync Error [Products]:', err);
        }
      })();
    }
  },

  // Services
  getServices: () => cache.services,
  saveServices: (services: Service[]) => {
    cache.services = services;
    writeJSONFile(PATHS.services, services);
    if (getIsConnected()) {
      (async () => {
        try {
          await MongoService.deleteMany({});
          if (services.length > 0) {
            await MongoService.insertMany(services);
          }
        } catch (err) {
          console.error('MERN DB Sync Error [Services]:', err);
        }
      })();
    }
  },

  // Bookings
  getBookings: () => cache.bookings,
  saveBookings: (bookings: Booking[]) => {
    cache.bookings = bookings;
    writeJSONFile(PATHS.bookings, bookings);
    if (getIsConnected()) {
      (async () => {
        try {
          await MongoBooking.deleteMany({});
          if (bookings.length > 0) {
            await MongoBooking.insertMany(bookings);
          }
        } catch (err) {
          console.error('MERN DB Sync Error [Bookings]:', err);
        }
      })();
    }
  },

  // Orders
  getOrders: () => cache.orders,
  saveOrders: (orders: Order[]) => {
    cache.orders = orders;
    writeJSONFile(PATHS.orders, orders);
    if (getIsConnected()) {
      (async () => {
        try {
          await MongoOrder.deleteMany({});
          if (orders.length > 0) {
            await MongoOrder.insertMany(orders);
          }
        } catch (err) {
          console.error('MERN DB Sync Error [Orders]:', err);
        }
      })();
    }
  },

  // Blog Posts
  getBlogs: () => cache.blogs,
  saveBlogs: (blogs: BlogPost[]) => {
    cache.blogs = blogs;
    writeJSONFile(PATHS.blogs, blogs);
    if (getIsConnected()) {
      (async () => {
        try {
          await MongoBlogPost.deleteMany({});
          if (blogs.length > 0) {
            await MongoBlogPost.insertMany(blogs);
          }
        } catch (err) {
          console.error('MERN DB Sync Error [Blogs]:', err);
        }
      })();
    }
  },

  // FAQs
  getFAQs: () => cache.faqs,
  saveFAQs: (faqs: FAQ[]) => {
    cache.faqs = faqs;
    writeJSONFile(PATHS.faqs, faqs);
    if (getIsConnected()) {
      (async () => {
        try {
          await MongoFAQ.deleteMany({});
          if (faqs.length > 0) {
            await MongoFAQ.insertMany(faqs);
          }
        } catch (err) {
          console.error('MERN DB Sync Error [FAQs]:', err);
        }
      })();
    }
  },

  // Testimonials
  getTestimonials: () => cache.testimonials,
  saveTestimonials: (testimonials: Testimonial[]) => {
    cache.testimonials = testimonials;
    writeJSONFile(PATHS.testimonials, testimonials);
    if (getIsConnected()) {
      (async () => {
        try {
          await MongoTestimonial.deleteMany({});
          if (testimonials.length > 0) {
            await MongoTestimonial.insertMany(testimonials);
          }
        } catch (err) {
          console.error('MERN DB Sync Error [Testimonials]:', err);
        }
      })();
    }
  },

  // Settings
  getSettings: () => cache.settings,
  saveSettings: (settings: StoreSettings) => {
    cache.settings = settings;
    writeJSONFile(PATHS.settings, settings);
    if (getIsConnected()) {
      (async () => {
        try {
          await MongoStoreSettings.deleteMany({});
          await MongoStoreSettings.create(settings);
        } catch (err) {
          console.error('MERN DB Sync Error [Settings]:', err);
        }
      })();
    }
  },

  // Contact Messages
  getMessages: () => cache.messages,
  saveMessages: (messages: Message[]) => {
    cache.messages = messages;
    writeJSONFile(PATHS.messages, messages);
    if (getIsConnected()) {
      (async () => {
        try {
          await MongoMessage.deleteMany({});
          if (messages.length > 0) {
            await MongoMessage.insertMany(messages);
          }
        } catch (err) {
          console.error('MERN DB Sync Error [Messages]:', err);
        }
      })();
    }
  },

  // Newsletter Subscribers
  getSubscribers: () => cache.subscribers,
  saveSubscribers: (subscribers: Subscriber[]) => {
    cache.subscribers = subscribers;
    writeJSONFile(PATHS.subscribers, subscribers);
    if (getIsConnected()) {
      (async () => {
        try {
          await MongoSubscriber.deleteMany({});
          if (subscribers.length > 0) {
            await MongoSubscriber.insertMany(subscribers);
          }
        } catch (err) {
          console.error('MERN DB Sync Error [Subscribers]:', err);
        }
      })();
    }
  },

  // Audit Logs
  getAuditLogs: () => cache.auditLogs,
  saveAuditLogs: (logs: AuditLog[]) => {
    cache.auditLogs = logs;
    writeJSONFile(PATHS.auditLogs, logs);
    if (getIsConnected()) {
      (async () => {
        try {
          await MongoAuditLog.deleteMany({});
          if (logs.length > 0) {
            await MongoAuditLog.insertMany(logs);
          }
        } catch (err) {
          console.error('MERN DB Sync Error [AuditLogs]:', err);
        }
      })();
    }
  },

  // Helper to add an audit log
  addAuditLog: (action: string, details: string, user: string = 'System') => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      action,
      details,
      user,
      timestamp: new Date().toISOString()
    };
    
    cache.auditLogs.unshift(newLog); // prepend to show latest first
    cache.auditLogs = cache.auditLogs.slice(0, 500); // limit cache to 500 logs
    
    // Write local backup
    writeJSONFile(PATHS.auditLogs, cache.auditLogs);
    
    if (getIsConnected()) {
      (async () => {
        try {
          // Add log item to MongoDB
          await MongoAuditLog.create(newLog);
          // Keep database table size under 500 logs
          const count = await MongoAuditLog.countDocuments();
          if (count > 500) {
            const oldestToKeep = await MongoAuditLog.find()
              .sort({ timestamp: -1 })
              .skip(500)
              .limit(1)
              .lean();
            if (oldestToKeep.length > 0) {
              await MongoAuditLog.deleteMany({ timestamp: { $lte: oldestToKeep[0].timestamp } });
            }
          }
        } catch (err) {
          console.error('MERN DB Sync Error [addAuditLog]:', err);
        }
      })();
    }
    
    return newLog;
  },

  // Media Photos
  getPhotos: () => cache.photos,
  savePhotos: (photos: MediaPhoto[]) => {
    cache.photos = photos;
    writeJSONFile(PATHS.photos, photos);
    if (getIsConnected()) {
      (async () => {
        try {
          await MongoMediaPhoto.deleteMany({});
          if (photos.length > 0) {
            await MongoMediaPhoto.insertMany(photos);
          }
        } catch (err) {
          console.error('MERN DB Sync Error [MediaPhotos]:', err);
        }
      })();
    }
  }
};
