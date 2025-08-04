// Generate Open Graph image for social media sharing
// Run with: node scripts/generate-og-image.js

import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

const WIDTH = 1200;
const HEIGHT = 630;

// Create canvas
const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');

// Background gradient (Catalan red to dark)
const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
gradient.addColorStop(0, '#DA291C');
gradient.addColorStop(1, '#1a1a1a');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, WIDTH, HEIGHT);

// Add geometric pattern
ctx.strokeStyle = 'rgba(255, 217, 61, 0.1)';
ctx.lineWidth = 2;
for (let i = 0; i < WIDTH; i += 100) {
  ctx.beginPath();
  ctx.moveTo(i, 0);
  ctx.lineTo(i + 50, HEIGHT);
  ctx.stroke();
}

// Main title
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 72px Arial, sans-serif';
ctx.textAlign = 'center';
ctx.fillText('Ramon Roca Pinilla', WIDTH / 2, 200);

// Subtitle
ctx.font = '36px Arial, sans-serif';
ctx.fillStyle = '#FFD93D';
ctx.fillText('Biomedical Engineer & Molecular Biologist', WIDTH / 2, 280);

// Tagline
ctx.font = '28px Arial, sans-serif';
ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
ctx.textAlign = 'center';
const tagline = 'Engineering next-generation gene therapies';
ctx.fillText(tagline, WIDTH / 2, 380);
ctx.fillText('and antimicrobial solutions', WIDTH / 2, 420);

// Stats
ctx.font = 'bold 24px Arial, sans-serif';
ctx.fillStyle = '#FFD93D';
ctx.textAlign = 'left';
ctx.fillText('16+ Publications', 50, 550);
ctx.fillText('250+ Citations', 300, 550);
ctx.fillText('3 Patents', 550, 550);

// Website
ctx.font = '20px Arial, sans-serif';
ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
ctx.textAlign = 'right';
ctx.fillText('rrocap.github.io/Portfolio', WIDTH - 50, HEIGHT - 30);

// Save as PNG
const buffer = canvas.toBuffer('image/png');
const outputPath = path.join(process.cwd(), 'public', 'og-image.png');

fs.writeFileSync(outputPath, buffer);
console.log(`✅ Generated Open Graph image: ${outputPath}`);
console.log(`📐 Size: ${WIDTH}x${HEIGHT}px`);
console.log(`📁 File size: ${(buffer.length / 1024).toFixed(1)}KB`);