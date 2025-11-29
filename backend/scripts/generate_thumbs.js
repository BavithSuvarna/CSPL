#!/usr/bin/env node
// backend/scripts/generate_thumbs.js
// Small script to generate 300x300 thumbnails for existing uploaded images.

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const uploadsDir = path.join(__dirname, '..', 'uploads');
const thumbsDir = path.join(uploadsDir, 'thumbs');

if (!fs.existsSync(uploadsDir)) {
  console.error('Uploads directory does not exist:', uploadsDir);
  process.exit(1);
}
if (!fs.existsSync(thumbsDir)) fs.mkdirSync(thumbsDir, { recursive: true });

const files = fs.readdirSync(uploadsDir).filter(f => {
  const p = path.join(uploadsDir, f);
  return fs.statSync(p).isFile() && !f.startsWith('thumb-');
});

(async () => {
  for (const file of files) {
    const inPath = path.join(uploadsDir, file);
    const outName = `thumb-${file}`;
    const outPath = path.join(thumbsDir, outName);
    try {
      // rotate according to EXIF before resizing so output is correctly oriented
      await sharp(inPath).rotate().resize(300, 300, { fit: 'cover' }).toFile(outPath);
      console.log('Created', outPath);
    } catch (err) {
      console.warn('Failed for', file, err.message);
    }
  }
  console.log('Done');
})();
