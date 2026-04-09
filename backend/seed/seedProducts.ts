import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

import Product from '../src/models/Product.js';

const products = [
  {
    name: 'Yuki Aim - Polar75 - 8k Dragon Edition',
    category: 'keyboard',
    price: 190,
    image: '/images/yuki aim 1.png',
    badge: 'hot',
    features: ['8000Hz Polling', '75% Layout', 'Linear Switches'],
    rating: 4.8,
    inStock: true,
    description: 'The Yuki Aim Polar75 8K Dragon Edition is a premium 75% mechanical keyboard featuring an incredible 8000Hz polling rate for the fastest possible input response. With its stunning Dragon Edition design and smooth linear switches, this keyboard is built for competitive gamers who demand the very best.',
  },
  {
    name: 'Yuki Aim Hall Effect Magnetic 65%',
    category: 'keyboard',
    price: 175,
    image: '/images/yuki aim 2.png',
    badge: '',
    features: ['Hall Effect', '65% Layout', 'Gaming Optimized'],
    rating: 4.9,
    inStock: true,
    description: 'Experience the next generation of keyboard technology with the Yuki Aim Hall Effect Magnetic 65%. Using magnetic hall effect switches, this keyboard offers adjustable actuation points and incredible consistency that traditional mechanical switches cannot match.',
  },
  {
    name: 'Viper Mini',
    category: 'mouse',
    price: 89,
    image: '/images/mouse_2-removebg-preview.png',
    badge: '',
    features: ['Ultra-light', '8000 DPI', 'RGB Lighting'],
    rating: 4.7,
    inStock: true,
    description: 'The Razer Viper Mini is an ultra-lightweight gaming mouse designed for fast-paced gaming. Weighing in at just 61g, it features an 8000 DPI optical sensor, RGB Chroma lighting, and Razer Speedflex cable for minimal drag.',
  },
  {
    name: 'Viper Mini Signature Edition',
    category: 'mouse',
    price: 115,
    image: '/images/mouse 1.png',
    badge: 'sale',
    features: ['Signature Design', 'Pro Sensor', 'Wireless'],
    rating: 4.6,
    inStock: true,
    description: 'The Viper Mini Signature Edition takes everything great about the original and elevates it with a premium wireless design, upgraded pro-grade sensor, and exclusive signature aesthetics. Perfect for esports professionals.',
  },
  {
    name: 'Razer Barracuda Pro',
    category: 'headphone',
    price: 200,
    image: '/images/headphone-removebg-preview.png',
    badge: 'new',
    features: ['Active Noise Cancelling', 'THX Spatial Audio', '50hr Battery'],
    rating: 4.8,
    inStock: false,
    description: 'The Razer Barracuda Pro is a premium wireless gaming headset featuring hybrid Active Noise Cancellation, THX Spatial Audio for immersive soundscapes, and an incredible 50-hour battery life. Seamlessly switch between gaming, music, and calls.',
  },
  {
    name: 'Yuki Aim - Kitsune LARGE Mousepad',
    category: 'mousepad',
    price: 35,
    image: '/images/mousepad 2.png',
    badge: '',
    features: ['XXL Size', 'Stitched Edges', 'Anti-slip Base'],
    rating: 4.5,
    inStock: true,
    description: 'The Yuki Aim Kitsune LARGE Mousepad offers a generous surface area for low-sensitivity gamers. With premium stitched edges for durability and a non-slip rubber base, this mousepad provides consistent tracking across its entire surface.',
  },
  {
    name: 'Koorui 24E3 24" 165Hz Gaming Monitor',
    category: 'monitor',
    price: 199,
    image: '/images/monitor1.png',
    badge: 'hot',
    features: ['165Hz Refresh', '1ms Response', 'FreeSync'],
    rating: 4.4,
    inStock: true,
    description: 'The Koorui 24E3 delivers smooth 165Hz gaming at an incredible value. With 1ms response time and AMD FreeSync support, this 24-inch monitor eliminates screen tearing and motion blur for a competitive edge.',
  },
  {
    name: 'AOC C27G4X 27" Curved Gaming Monitor',
    category: 'monitor',
    price: 250,
    image: '/images/monitor2.jpg',
    badge: '',
    features: ['1500R Curve', '180Hz', 'VA Panel'],
    rating: 4.6,
    inStock: true,
    description: 'Immerse yourself in gaming with the AOC C27G4X curved gaming monitor. Its 1500R curvature wraps around your field of vision, while the 180Hz refresh rate and VA panel deliver vibrant colors and deep blacks.',
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert products
    const inserted = await Product.insertMany(products);
    console.log(`✅ Seeded ${inserted.length} products successfully!`);

    inserted.forEach((p) => {
      console.log(`   📦 ${p.name} - $${p.price}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedProducts();
