import fs from 'fs/promises';
import path from 'path';
import glob from 'glob';
import sharp from 'sharp';

const files = glob.sync('public/**/*.{png,jpg,jpeg}');
for (const file of files) {
  const ext = path.extname(file);
  const base = file.slice(0, -ext.length);
  await sharp(file).toFormat('webp').toFile(`${base}.webp`);
  await sharp(file).toFormat('avif').toFile(`${base}.avif`);
}
