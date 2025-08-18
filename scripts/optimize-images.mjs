#!/usr/bin/env node
/**
 * Image Optimization Script
 * Optimizes profile images and creates responsive variants
 */

import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

const IMAGE_CONFIGS = {
  profile: {
    source: 'public/profile.jpg',
    variants: [
      { size: 120, quality: 85, suffix: '' },        // Main usage
      { size: 240, quality: 85, suffix: '@2x' },     // High DPI
      { size: 60, quality: 80, suffix: '@0.5x' }     // Thumbnail
    ],
    formats: ['webp', 'avif', 'jpg']
  },
  'video-poster': {
    source: 'public/hero/video-poster.jpg',
    variants: [
      { size: 960, quality: 75, suffix: '' },        // HD
      { size: 1920, quality: 70, suffix: '@2x' },    // Full HD
      { size: 480, quality: 70, suffix: '@0.5x' }    // Mobile
    ],
    formats: ['webp', 'avif']
  }
};

class ImageOptimizer {
  constructor() {
    this.stats = {
      originalSize: 0,
      optimizedSize: 0,
      filesProcessed: 0,
      errors: []
    };
  }

  async checkDependencies() {
    const tools = ['magick', 'cwebp', 'avifenc'];
    const available = {};
    
    for (const tool of tools) {
      try {
        await execAsync(`which ${tool}`);
        available[tool] = true;
        console.log(`✅ ${tool} available`);
      } catch {
        available[tool] = false;
        console.warn(`⚠️  ${tool} not available - will use alternative`);
      }
    }
    
    return available;
  }

  async optimizeWithImageMagick(inputPath, outputPath, size, quality, format) {
    const formatMap = {
      jpg: 'JPEG',
      webp: 'WEBP',
      avif: 'AVIF'
    };

    const cmd = [
      'magick',
      `"${inputPath}"`,
      '-strip',                                    // Remove metadata
      '-interlace', 'Plane',                      // Progressive/interlaced
      '-gaussian-blur', '0.05',                   // Slight blur for compression
      '-quality', quality,                        // Quality setting
      '-resize', `${size}x${size}^`,             // Resize to exact dimensions
      '-gravity', 'center',                       // Center crop
      '-extent', `${size}x${size}`,              // Crop to exact size
      '-format', formatMap[format],
      '-define', `${formatMap[format]}:method=6`, // Best compression
      `"${outputPath}"`
    ].join(' ');

    return execAsync(cmd);
  }

  async optimizeWithAlternativeTools(inputPath, outputPath, size, quality, format) {
    // First resize with ImageMagick (if available) or create fallback
    const tempPath = outputPath.replace(/\.[^.]+$/, '.temp.jpg');
    
    try {
      // Resize to target dimensions
      await execAsync([
        'magick',
        `"${inputPath}"`,
        '-strip',
        '-resize', `${size}x${size}^`,
        '-gravity', 'center', 
        '-extent', `${size}x${size}`,
        '-quality', '95', // High quality for further processing
        `"${tempPath}"`
      ].join(' '));

      // Convert to target format
      switch (format) {
        case 'webp':
          await execAsync(`cwebp -q ${quality} -m 6 "${tempPath}" -o "${outputPath}"`);
          break;
        case 'avif':
          await execAsync(`avifenc --min 0 --max 63 -a end-usage=q -a cq-level=${Math.round((100-quality)/2)} "${tempPath}" "${outputPath}"`);
          break;
        case 'jpg':
          await execAsync(`magick "${tempPath}" -quality ${quality} "${outputPath}"`);
          break;
      }

      // Clean up temp file
      fs.unlinkSync(tempPath);
    } catch (error) {
      // Clean up on error
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      throw error;
    }
  }

  async optimizeImage(config, imageName) {
    const { source, variants, formats } = config;
    
    if (!fs.existsSync(source)) {
      console.warn(`⚠️  Source image not found: ${source}`);
      return;
    }

    const originalStats = fs.statSync(source);
    this.stats.originalSize += originalStats.size;

    console.log(`\n📸 Optimizing ${imageName}...`);
    console.log(`   Original: ${(originalStats.size / 1024).toFixed(1)}KB`);

    for (const variant of variants) {
      for (const format of formats) {
        const filename = this.generateFilename(imageName, variant, format);
        const outputPath = path.join('public', filename);
        
        // Ensure output directory exists
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        try {
          await this.optimizeWithImageMagick(
            source, 
            outputPath, 
            variant.size, 
            variant.quality, 
            format
          );

          const optimizedStats = fs.statSync(outputPath);
          const savedKB = (originalStats.size - optimizedStats.size) / 1024;
          const savedPercent = ((originalStats.size - optimizedStats.size) / originalStats.size * 100);
          
          this.stats.optimizedSize += optimizedStats.size;
          this.stats.filesProcessed++;

          console.log(`   ✅ ${filename}: ${(optimizedStats.size / 1024).toFixed(1)}KB (saved ${savedKB.toFixed(1)}KB, ${savedPercent.toFixed(1)}%)`);

        } catch (error) {
          console.error(`   ❌ Failed to optimize ${filename}: ${error.message}`);
          this.stats.errors.push({
            file: filename,
            error: error.message
          });
        }
      }
    }
  }

  generateFilename(imageName, variant, format) {
    const { suffix } = variant;
    const ext = format === 'jpg' ? 'jpg' : format;
    
    if (imageName === 'video-poster') {
      return `hero/video-poster${suffix}.${ext}`;
    }
    
    return `${imageName}${suffix}.${ext}`;
  }

  async generatePictureElements() {
    const pictureElementsPath = 'src/utils/optimizedImages.ts';
    
    const content = `/**
 * Optimized Image Components and Utilities
 * Generated by optimize-images.mjs
 */

export interface ImageVariant {
  src: string;
  width: number;
  height: number;
  format: string;
  size?: string; // CSS size hint
}

export interface OptimizedImageConfig {
  variants: ImageVariant[];
  alt: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync';
  className?: string;
}

// Profile image variants
export const PROFILE_IMAGE_VARIANTS: ImageVariant[] = [
  // AVIF variants (best compression)
  { src: '/Portfolio/profile@2x.avif', width: 240, height: 240, format: 'avif', size: '120px' },
  { src: '/Portfolio/profile.avif', width: 120, height: 120, format: 'avif', size: '120px' },
  { src: '/Portfolio/profile@0.5x.avif', width: 60, height: 60, format: 'avif', size: '60px' },
  
  // WebP variants (good compression, wider support)
  { src: '/Portfolio/profile@2x.webp', width: 240, height: 240, format: 'webp', size: '120px' },
  { src: '/Portfolio/profile.webp', width: 120, height: 120, format: 'webp', size: '120px' },
  { src: '/Portfolio/profile@0.5x.webp', width: 60, height: 60, format: 'webp', size: '60px' },
  
  // JPEG fallback
  { src: '/Portfolio/profile@2x.jpg', width: 240, height: 240, format: 'jpg', size: '120px' },
  { src: '/Portfolio/profile.jpg', width: 120, height: 120, format: 'jpg', size: '120px' },
  { src: '/Portfolio/profile@0.5x.jpg', width: 60, height: 60, format: 'jpg', size: '60px' }
];

// Video poster variants
export const VIDEO_POSTER_VARIANTS: ImageVariant[] = [
  // AVIF variants
  { src: '/Portfolio/hero/video-poster@2x.avif', width: 1920, height: 1080, format: 'avif' },
  { src: '/Portfolio/hero/video-poster.avif', width: 960, height: 540, format: 'avif' },
  { src: '/Portfolio/hero/video-poster@0.5x.avif', width: 480, height: 270, format: 'avif' },
  
  // WebP variants  
  { src: '/Portfolio/hero/video-poster@2x.webp', width: 1920, height: 1080, format: 'webp' },
  { src: '/Portfolio/hero/video-poster.webp', width: 960, height: 540, format: 'webp' },
  { src: '/Portfolio/hero/video-poster@0.5x.webp', width: 480, height: 270, format: 'webp' }
];

/**
 * Generate responsive picture element HTML
 */
export function generatePictureElement(variants: ImageVariant[], config: OptimizedImageConfig): string {
  const { alt, loading = 'lazy', decoding = 'async', className = '' } = config;
  
  // Group by format for source elements
  const formatGroups = variants.reduce((groups, variant) => {
    if (!groups[variant.format]) groups[variant.format] = [];
    groups[variant.format].push(variant);
    return groups;
  }, {} as Record<string, ImageVariant[]>);

  let sources = '';
  
  // AVIF first (best compression)
  if (formatGroups.avif) {
    const srcset = formatGroups.avif.map(v => 
      \`\${v.src} \${v.width}w\`
    ).join(', ');
    sources += \`<source srcset="\${srcset}" type="image/avif" />\`;
  }
  
  // WebP second (good compression)
  if (formatGroups.webp) {
    const srcset = formatGroups.webp.map(v => 
      \`\${v.src} \${v.width}w\`
    ).join(', ');
    sources += \`<source srcset="\${srcset}" type="image/webp" />\`;
  }
  
  // JPEG fallback
  const jpegVariants = formatGroups.jpg || [];
  const fallbackSrc = jpegVariants.find(v => v.width === 120)?.src || variants[0].src;
  
  return \`
    <picture class="\${className}">
      \${sources}
      <img 
        src="\${fallbackSrc}" 
        alt="\${alt}"
        loading="\${loading}"
        decoding="\${decoding}"
        width="120" 
        height="120"
      />
    </picture>
  \`.trim();
}

/**
 * React component for optimized images
 */
export function OptimizedImage({ variants, alt, loading = 'lazy', className = '', ...props }: OptimizedImageConfig & any) {
  const formatGroups = variants.reduce((groups, variant) => {
    if (!groups[variant.format]) groups[variant.format] = [];
    groups[variant.format].push(variant);
    return groups;
  }, {} as Record<string, ImageVariant[]>);

  return (
    <picture className={className}>
      {formatGroups.avif && (
        <source 
          srcSet={formatGroups.avif.map(v => \`\${v.src} \${v.width}w\`).join(', ')}
          type="image/avif"
        />
      )}
      {formatGroups.webp && (
        <source 
          srcSet={formatGroups.webp.map(v => \`\${v.src} \${v.width}w\`).join(', ')}
          type="image/webp" 
        />
      )}
      <img
        src={formatGroups.jpg?.[0]?.src || variants[0].src}
        alt={alt}
        loading={loading}
        decoding="async"
        width={120}
        height={120}
        {...props}
      />
    </picture>
  );
}`;

    fs.writeFileSync(pictureElementsPath, content);
    console.log(`\n📝 Generated optimized image utilities: ${pictureElementsPath}`);
  }

  async run() {
    console.log('🖼️  Image Optimization Tool');
    console.log('=' .repeat(40));

    const tools = await this.checkDependencies();
    
    if (!tools.magick) {
      console.error('❌ ImageMagick is required but not available.');
      console.log('   Install with: brew install imagemagick');
      process.exit(1);
    }

    // Process each image configuration
    for (const [imageName, config] of Object.entries(IMAGE_CONFIGS)) {
      await this.optimizeImage(config, imageName);
    }

    // Generate TypeScript utilities
    await this.generatePictureElements();

    // Summary
    console.log('\n' + '='.repeat(40));
    console.log('📊 OPTIMIZATION SUMMARY');
    console.log('='.repeat(40));
    console.log(`Files processed: ${this.stats.filesProcessed}`);
    console.log(`Original total size: ${(this.stats.originalSize / 1024).toFixed(1)}KB`);
    console.log(`Optimized total size: ${(this.stats.optimizedSize / 1024).toFixed(1)}KB`);
    
    if (this.stats.originalSize > 0) {
      const savedBytes = this.stats.originalSize - this.stats.optimizedSize;
      const savedPercent = (savedBytes / this.stats.originalSize) * 100;
      console.log(`Total saved: ${(savedBytes / 1024).toFixed(1)}KB (${savedPercent.toFixed(1)}%)`);
    }

    if (this.stats.errors.length > 0) {
      console.log(`\n⚠️  Errors encountered: ${this.stats.errors.length}`);
      this.stats.errors.forEach(error => {
        console.log(`   - ${error.file}: ${error.error}`);
      });
    }

    console.log('\n✅ Image optimization complete!');
    console.log('\nNext steps:');
    console.log('1. Update components to use optimized images');
    console.log('2. Test responsive behavior');  
    console.log('3. Run performance audit: npm run performance:audit');
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  new ImageOptimizer().run().catch(console.error);
}