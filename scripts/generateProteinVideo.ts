#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface VideoConfig {
  pdbId: string;
  frames: number;
  outputDir: string;
  format: 'webm' | 'mp4' | 'both';
  fps: number;
  quality: number; // CRF value (lower = higher quality)
}

class ProteinVideoGenerator {
  private config: VideoConfig;

  constructor(config: Partial<VideoConfig> = {}) {
    this.config = {
      pdbId: '2K6O', // Default antimicrobial peptide
      frames: 120, // 4 seconds at 30fps
      outputDir: './public/videos',
      format: 'both',
      fps: 30,
      quality: 30, // Good balance of size/quality
      ...config
    };
  }

  async generateFrames(): Promise<void> {
    console.log(`🧬 Generating ${this.config.frames} frames for ${this.config.pdbId}`);
    
    // Ensure output directory exists
    const framesDir = path.join(this.config.outputDir, 'frames');
    if (!fs.existsSync(framesDir)) {
      fs.mkdirSync(framesDir, { recursive: true });
    }

    // Generate rotating protein frames
    for (let i = 0; i < this.config.frames; i++) {
      const angle = (i / this.config.frames) * 360;
      const frame = this.generateProteinFrame(i, angle);
      
      const framePath = path.join(framesDir, `frame_${i.toString().padStart(4, '0')}.png`);
      fs.writeFileSync(framePath, frame);
      
      if (i % 30 === 0) {
        console.log(`  Generated frame ${i}/${this.config.frames}`);
      }
    }
    
    console.log('✅ Frame generation complete');
  }

  private generateProteinFrame(frameIndex: number, angle: number): Buffer {
    // Simple SVG-based protein representation for demo
    // In production, this would interface with actual protein structure data
    const svg = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="proteinGrad" cx="50%" cy="50%">
            <stop offset="0%" stop-color="#DC2626" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#7F1D1D" stop-opacity="0.4"/>
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <rect width="800" height="600" fill="transparent"/>
        
        <!-- Simplified protein structure -->
        <g transform="translate(400,300) rotate(${angle})">
          <!-- Alpha helices -->
          <ellipse cx="0" cy="-40" rx="60" ry="12" fill="url(#proteinGrad)" filter="url(#glow)"/>
          <ellipse cx="30" cy="0" rx="50" ry="10" fill="url(#proteinGrad)" filter="url(#glow)" opacity="0.8"/>
          <ellipse cx="-20" cy="35" rx="40" ry="8" fill="url(#proteinGrad)" filter="url(#glow)" opacity="0.9"/>
          
          <!-- Beta sheets -->
          <rect x="-45" y="-15" width="90" height="8" fill="#FFD93D" opacity="0.7" filter="url(#glow)"/>
          <rect x="-35" y="10" width="70" height="6" fill="#FFD93D" opacity="0.6" filter="url(#glow)"/>
          
          <!-- Active site -->
          <circle cx="0" cy="0" r="8" fill="#DC2626" opacity="0.9" filter="url(#glow)"/>
          
          <!-- Connecting loops -->
          <path d="M -40,-30 Q 0,-15 35,5" stroke="#A3A3A3" stroke-width="3" fill="none" opacity="0.5"/>
          <path d="M 20,10 Q 0,25 -25,30" stroke="#A3A3A3" stroke-width="3" fill="none" opacity="0.5"/>
        </g>
        
        <!-- Interaction indicators -->
        <g opacity="${0.3 + 0.4 * Math.sin((frameIndex / this.config.frames) * Math.PI * 4)}">
          <circle cx="${350 + 30 * Math.cos(angle * Math.PI / 180)}" 
                  cy="${270 + 30 * Math.sin(angle * Math.PI / 180)}" 
                  r="15" fill="#FFD93D" opacity="0.6"/>
          <circle cx="${450 + 25 * Math.cos((angle + 120) * Math.PI / 180)}" 
                  cy="${330 + 25 * Math.sin((angle + 120) * Math.PI / 180)}" 
                  r="12" fill="#FFD93D" opacity="0.5"/>
        </g>
      </svg>
    `;

    // Convert SVG to PNG buffer (simplified - in production use proper SVG->PNG conversion)
    return Buffer.from(svg, 'utf8');
  }

  async generateVideo(): Promise<void> {
    console.log('🎬 Generating video from frames');
    
    const framesPattern = path.join(this.config.outputDir, 'frames', 'frame_%04d.png');
    const videoPath = path.join(this.config.outputDir, `protein_${this.config.pdbId.toLowerCase()}`);
    
    try {
      if (this.config.format === 'webm' || this.config.format === 'both') {
        const webmPath = `${videoPath}.webm`;
        const webmCommand = `ffmpeg -y -framerate ${this.config.fps} -i "${framesPattern}" -c:v libvpx-vp9 -pix_fmt yuva420p -crf ${this.config.quality} -b:v 0 "${webmPath}"`;
        
        console.log('  Generating WebM...');
        execSync(webmCommand, { stdio: 'pipe' });
        console.log(`✅ WebM generated: ${webmPath}`);
      }

      if (this.config.format === 'mp4' || this.config.format === 'both') {
        const mp4Path = `${videoPath}.mp4`;
        const mp4Command = `ffmpeg -y -framerate ${this.config.fps} -i "${framesPattern}" -c:v libx264 -pix_fmt yuv420p -crf ${this.config.quality} "${mp4Path}"`;
        
        console.log('  Generating MP4...');
        execSync(mp4Command, { stdio: 'pipe' });
        console.log(`✅ MP4 generated: ${mp4Path}`);
      }

      // Generate poster frame
      const posterPath = `${videoPath}_poster.webp`;
      const posterCommand = `ffmpeg -y -i "${path.join(this.config.outputDir, 'frames', 'frame_0000.png')}" -q:v 85 "${posterPath}"`;
      execSync(posterCommand, { stdio: 'pipe' });
      console.log(`✅ Poster generated: ${posterPath}`);
      
    } catch (error) {
      console.error('❌ Video generation failed:', error);
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    // Remove temporary frames
    const framesDir = path.join(this.config.outputDir, 'frames');
    if (fs.existsSync(framesDir)) {
      fs.rmSync(framesDir, { recursive: true });
      console.log('🧹 Cleaned up temporary frames');
    }
  }

  async generate(): Promise<void> {
    const startTime = Date.now();
    console.log('🚀 Starting protein video generation');
    
    try {
      await this.generateFrames();
      await this.generateVideo();
      await this.cleanup();
      
      const duration = (Date.now() - startTime) / 1000;
      console.log(`🎉 Video generation complete in ${duration.toFixed(1)}s`);
      
      // Generate metadata
      const metadata = {
        pdbId: this.config.pdbId,
        frames: this.config.frames,
        fps: this.config.fps,
        generatedAt: new Date().toISOString(),
        duration: duration,
        scriptVersion: '1.0.0'
      };
      
      const metadataPath = path.join(this.config.outputDir, `${this.config.pdbId.toLowerCase()}_metadata.json`);
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
      
    } catch (error) {
      console.error('❌ Generation failed:', error);
      process.exit(1);
    }
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const config: Partial<VideoConfig> = {};
  
  // Parse command line arguments
  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i];
    const value = args[i + 1];
    
    switch (flag) {
      case '--pdb':
        config.pdbId = value;
        break;
      case '--frames':
        config.frames = parseInt(value);
        break;
      case '--fps':
        config.fps = parseInt(value);
        break;
      case '--format':
        config.format = value as 'webm' | 'mp4' | 'both';
        break;
      case '--quality':
        config.quality = parseInt(value);
        break;
    }
  }
  
  const generator = new ProteinVideoGenerator(config);
  generator.generate();
}

export { ProteinVideoGenerator, VideoConfig };