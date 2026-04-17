import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

import Product from '../src/models/Product.js';

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('✅ Connected to MongoDB');

    const files = fs.readdirSync(IMAGES_DIR);
    console.log(`🔍 Found ${files.length} files in ${IMAGES_DIR}`);

    let convertedCount = 0;
    let updatedCount = 0;

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        const filePath = path.join(IMAGES_DIR, file);
        const newFileName = file.replace(ext, '.webp');
        const newPath = path.join(IMAGES_DIR, newFileName);

        // Convert to WebP
        await sharp(filePath)
          .webp({ quality: 80 })
          .toFile(newPath);
        
        console.log(`📸 Converted: ${file} -> ${newFileName}`);
        convertedCount++;

        // Update DB references
        const oldRef = `/images/${file}`;
        const newRef = `/images/${newFileName}`;
        
        const result = await Product.updateMany(
          { image: oldRef },
          { $set: { image: newRef } }
        );
        
        if (result.modifiedCount > 0) {
          console.log(`   🔗 Updated ${result.modifiedCount} products in DB`);
          updatedCount += result.modifiedCount;
        }

        // Optional: Remove original if strictly requested, but better to keep for now
        // fs.unlinkSync(filePath); 
      }
    }

    console.log(`\n✨ Migration Summary:`);
    console.log(`   🖼️  Images converted: ${convertedCount}`);
    console.log(`   📦 Database updates: ${updatedCount}`);

    await mongoose.disconnect();
    console.log('👋 Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
