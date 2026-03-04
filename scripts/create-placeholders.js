#!/usr/bin/env node
/**
 * Creates placeholder image files in images/ and icons/ so the folder structure
 * matches what the main app expects. Run once: node scripts/create-placeholders.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Minimal valid 1x1 pixel JPEG (grey) - 119 bytes
const MINIMAL_JPEG_BASE64 =
  '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/2gAMAwEAAhEDEQA/AL8AB//Z';
const MINIMAL_JPEG = Buffer.from(MINIMAL_JPEG_BASE64, 'base64');

// Minimal valid 1x1 pixel PNG (transparent)
const MINIMAL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);

const IMAGE_NAMES = [
  'gold-purity.jpg',
  '22k-gold-calculator.jpg',
  '916-hallmark.jpg',
  'making-charges.jpg',
  '24k-vs-22k.jpg',
  'war-gold-silver.jpg',
];

const ICON_NAMES = ['icon-512x512.png'];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function main() {
  const imagesDir = path.join(ROOT, 'images');
  const iconsDir = path.join(ROOT, 'icons');
  ensureDir(imagesDir);
  ensureDir(iconsDir);

  for (const name of IMAGE_NAMES) {
    const filePath = path.join(imagesDir, name);
    fs.writeFileSync(filePath, MINIMAL_JPEG);
    console.log('Created', filePath);
  }

  for (const name of ICON_NAMES) {
    const filePath = path.join(iconsDir, name);
    fs.writeFileSync(filePath, MINIMAL_PNG);
    console.log('Created', filePath);
  }

  console.log('Done. Replace these placeholders with real images.');
}

main();
