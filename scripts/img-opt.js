const sharp = require('sharp');
const fs = require('fs');

async function convertImage(file) {
  const img = sharp(`public/${file}`);
  await img.toFile(`public/${file.split('.')[0]}.webp`);
  await img.toFile(`public/${file.split('.')[0]}.avif`);
}

fs.readdirSync('public').forEach(file => {
  if (/(png|jpg|jpeg)$/i.test(file)) {
    convertImage(file);
  }
});
