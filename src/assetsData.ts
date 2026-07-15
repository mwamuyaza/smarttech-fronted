/**
 * SMARTTECH ELECTRONICS - PHOTO & ASSET CONFIGURATION FILE
 * 
 * Use this file to easily manage, add, or edit photos, project highlights,
 * and marketing graphics used throughout the website gallery and the hero slideshow.
 * 
 * Each photo object must follow this schema:
 * {
 *   id: string;          // Unique identifier (e.g. 'photo-1', 'photo-custom-abc')
 *   url: string;         // Public image URL or relative path (e.g. '/uploads/image.png')
 *   title: string;       // Public-facing title/name of the photo
 *   description: string; // Detail caption describing the product, installation, or deal
 *   category: string;    // Category filtering tag: 'CCTV Security', 'Structured Cabling', 'Network Routing', 'Power Backup', 'Access Control', 'Custom Gallery'
 *   uploadedAt: string;  // ISO timestamp (e.g. new Date().toISOString())
 * }
 */

import { MediaPhoto } from './types';

export const ecommerceAssets: MediaPhoto[] = [
  {
    id: 'photo-1',
    url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800',
    title: 'SmartTech 4K Ultra-HD Security Camera',
    description: 'Weatherproof IP67 security camera set with night vision, motion alerts, and two-way audio.',
    category: 'CCTV',
    uploadedAt: '2026-07-01T10:00:00.000Z'
  },
  {
    id: 'photo-2',
    url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=800',
    title: 'Vitron Smart 4K UHD LED TV Display',
    description: 'Crisp frameless UHD television running Android TV OS with Dolby Surround Audio.',
    category: 'TV',
    uploadedAt: '2026-07-02T11:30:00.000Z'
  },
  {
    id: 'photo-3',
    url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800',
    title: 'Monocrystalline Solar Panel Series',
    description: 'High-power output premium solar array installations for uninterrupted house or business electricity.',
    category: 'Solar',
    uploadedAt: '2026-07-03T09:15:00.000Z'
  },
  {
    id: 'photo-4',
    url: 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&q=80&w=800',
    title: 'Premium Split Air Conditioning Unit',
    description: 'Eco-friendly fast-cooling split AC with active air filtration and silent night operation mode.',
    category: 'Air Condition',
    uploadedAt: '2026-07-04T15:45:00.000Z'
  },
  {
    id: 'photo-5',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    title: 'Digital Inverter Refrigerator Unit',
    description: 'Frost-free double-door deep freezer with precise thermostat control and multi-air cooling vents.',
    category: 'Fridge',
    uploadedAt: '2026-07-10T12:00:00.000Z'
  },
  {
    id: 'photo-6',
    url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
    title: 'Samsung Galaxy Flagship Smartphone',
    description: 'Premium titanium build, high-refresh AMOLED screen display, and pro-grade multi-sensor cameras.',
    category: 'Phone',
    uploadedAt: '2026-07-12T14:20:00.000Z'
  }
];

// Fallback assets config
export default ecommerceAssets;
