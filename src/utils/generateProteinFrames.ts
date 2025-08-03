/**
 * Utility script to generate protein visualization frames
 * This can be used to pre-render protein structures into frame sequences
 * 
 * Usage: node generateProteinFrames.js --pdb 2K6O --frames 180 --output ./assets/protein-frames/
 */

import { createCanvas } from 'canvas';
import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';

interface ProteinFrameGeneratorOptions {
  pdbId?: string;
  frameCount?: number;
  outputDir?: string;
  width?: number;
  height?: number;
  format?: string;
  quality?: number;
}

interface Atom {
  type: string;
  residue: string;
  chain: string;
  x: number;
  y: number;
  z: number;
  element: string;
}

interface StructureData {
  atoms: Atom[];
}

class ProteinFrameGenerator {
  private pdbId: string;
  private frameCount: number;
  private outputDir: string;
  private width: number;
  private height: number;
  private format: string;
  private quality: number;
  private structureData: StructureData | undefined;

  constructor(options: ProteinFrameGeneratorOptions = {}) {
    this.pdbId = options.pdbId || '2K6O'; // Default to LL-37
    this.frameCount = options.frameCount || 180;
    this.outputDir = options.outputDir || './public/assets/protein-frames/';
    this.width = options.width || 800;
    this.height = options.height || 600;
    this.format = options.format || 'webp';
    this.quality = options.quality || 85;
  }

  async init() {
    // Create output directory if it doesn't exist
    await fs.mkdir(this.outputDir, { recursive: true });
    
    // Fetch protein structure data
    console.log(`Fetching structure data for PDB ID: ${this.pdbId}...`);
    this.structureData = await this.fetchPDBData();
    
    // Generate frames
    console.log(`Generating ${this.frameCount} frames...`);
    await this.generateFrames();
    
    console.log('Frame generation complete!');
  }

  async fetchPDBData() {
    // In a real implementation, this would fetch actual PDB data
    // For now, we'll generate synthetic data
    const response = await fetch(`https://files.rcsb.org/download/${this.pdbId}.pdb`);
    const pdbText = await response.text();
    
    // Parse PDB data (simplified)
    const atoms = [];
    const lines = pdbText.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('ATOM') || line.startsWith('HETATM')) {
        const atom = {
          type: line.substring(12, 16).trim(),
          residue: line.substring(17, 20).trim(),
          chain: line.substring(21, 22).trim(),
          x: parseFloat(line.substring(30, 38)),
          y: parseFloat(line.substring(38, 46)),
          z: parseFloat(line.substring(46, 54)),
          element: line.substring(76, 78).trim()
        };
        atoms.push(atom);
      }
    }
    
    return { atoms };
  }

  async generateFrames() {
    for (let i = 0; i < this.frameCount; i++) {
      const canvas = createCanvas(this.width, this.height);
      const ctx = canvas.getContext('2d');
      
      // Calculate rotation angle
      const angle = (i / this.frameCount) * Math.PI * 2;
      
      // Clear canvas with background
      ctx.fillStyle = '#fafafa';
      ctx.fillRect(0, 0, this.width, this.height);
      
      // Draw protein structure
      this.drawProteinStructure(ctx, angle);
      
      // Save frame
      const frameNumber = String(i).padStart(4, '0');
      const filename = `frame_${frameNumber}.${this.format}`;
      const filepath = path.join(this.outputDir, filename);
      
      if (this.format === 'webp') {
        const buffer = canvas.toBuffer('image/webp', { quality: this.quality / 100 });
        await fs.writeFile(filepath, buffer);
      } else if (this.format === 'png') {
        const buffer = canvas.toBuffer('image/png');
        await fs.writeFile(filepath, buffer);
      } else if (this.format === 'jpg' || this.format === 'jpeg') {
        const buffer = canvas.toBuffer('image/jpeg', { quality: this.quality / 100 });
        await fs.writeFile(filepath, buffer);
      }
      
      // Progress indicator
      if ((i + 1) % 10 === 0) {
        console.log(`Generated ${i + 1}/${this.frameCount} frames...`);
      }
    }
  }

  drawProteinStructure(ctx: CanvasRenderingContext2D, angle: number) {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    
    // Calculate bounds of protein
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;
    
    if (this.structureData && this.structureData.atoms) {
      for (const atom of this.structureData.atoms) {
        minX = Math.min(minX, atom.x);
        maxX = Math.max(maxX, atom.x);
        minY = Math.min(minY, atom.y);
        maxY = Math.max(maxY, atom.y);
        minZ = Math.min(minZ, atom.z);
        maxZ = Math.max(maxZ, atom.z);
      }
      
      const proteinWidth = maxX - minX;
      const proteinHeight = maxY - minY;
      const proteinDepth = maxZ - minZ;
      
      const scale = Math.min(
        (this.width * 0.7) / proteinWidth,
        (this.height * 0.7) / proteinHeight
      );
      
      // Sort atoms by depth for proper rendering
      const rotatedAtoms = this.structureData.atoms.map(atom => {
        // Rotate around Y axis
        const x = atom.x - (minX + maxX) / 2;
        const y = atom.y - (minY + maxY) / 2;
        const z = atom.z - (minZ + maxZ) / 2;
        
        const rotatedX = x * Math.cos(angle) - z * Math.sin(angle);
        const rotatedZ = x * Math.sin(angle) + z * Math.cos(angle);
        
        return {
          ...atom,
          screenX: centerX + rotatedX * scale,
          screenY: centerY + y * scale,
          depth: rotatedZ
        };
      });
      
      // Sort by depth (back to front)
      rotatedAtoms.sort((a, b) => a.depth - b.depth);
      
      // Draw atoms
      for (const atom of rotatedAtoms) {
        // Determine atom color based on element
        let color = '#666666';
        switch (atom.element) {
          case 'C': color = '#333333'; break;
          case 'N': color = '#3050F8'; break;
          case 'O': color = '#FF0D0D'; break;
          case 'H': color = '#FFFFFF'; break;
          case 'S': color = '#FFFF30'; break;
        }
        
        // Calculate radius based on depth
        const depthScale = 1 + atom.depth / proteinDepth * 0.5;
        const radius = 3 * depthScale;
        
        // Add depth-based shading
        ctx.globalAlpha = 0.7 + 0.3 * ((atom.depth + proteinDepth / 2) / proteinDepth);
        
        // Draw atom
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(atom.screenX, atom.screenY, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(atom.screenX - radius * 0.3, atom.screenY - radius * 0.3, radius * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.globalAlpha = 1;
    } else {
      // Fallback: Draw synthetic protein structure
      this.drawSyntheticProtein(ctx, angle, centerX, centerY);
    }
  }

  drawSyntheticProtein(ctx: CanvasRenderingContext2D, angle: number, centerX: number, centerY: number) {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    
    // Draw alpha helix
    const helixRadius = 80;
    const helixHeight = 250;
    const turns = 4;
    const pointsPerTurn = 30;
    const totalPoints = turns * pointsPerTurn;
    
    // Draw backbone
    ctx.strokeStyle = '#DA291C';
    ctx.lineWidth = 4;
    ctx.beginPath();
    
    for (let i = 0; i <= totalPoints; i++) {
      const t = i / totalPoints;
      const theta = t * turns * 2 * Math.PI;
      const x = Math.cos(theta) * helixRadius;
      const y = (t - 0.5) * helixHeight;
      const z = Math.sin(theta) * helixRadius;
      
      // Simple 3D to 2D projection
      const scale = 1 + z / 300;
      const projX = x * scale;
      const projY = y * scale;
      
      if (i === 0) {
        ctx.moveTo(projX, projY);
      } else {
        ctx.lineTo(projX, projY);
      }
    }
    
    ctx.stroke();
    
    // Draw atoms/residues
    for (let i = 0; i < 20; i++) {
      const t = i / 19;
      const theta = t * turns * 2 * Math.PI;
      const x = Math.cos(theta) * helixRadius;
      const y = (t - 0.5) * helixHeight;
      const z = Math.sin(theta) * helixRadius;
      
      const scale = 1 + z / 300;
      const projX = x * scale;
      const projY = y * scale;
      const radius = 10 * scale;
      
      // Depth-based coloring
      const depth = (z + helixRadius) / (2 * helixRadius);
      ctx.fillStyle = `hsl(${depth * 60}, 70%, 50%)`;
      
      ctx.beginPath();
      ctx.arc(projX, projY, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Add highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(projX - radius * 0.3, projY - radius * 0.3, radius * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }
}

// Command line interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '');
    const value = args[i + 1];
    
    switch (key) {
      case 'pdb':
        options.pdbId = value;
        break;
      case 'frames':
        options.frameCount = parseInt(value);
        break;
      case 'output':
        options.outputDir = value;
        break;
      case 'width':
        options.width = parseInt(value);
        break;
      case 'height':
        options.height = parseInt(value);
        break;
      case 'format':
        options.format = value;
        break;
      case 'quality':
        options.quality = parseInt(value);
        break;
    }
  }
  
  const generator = new ProteinFrameGenerator(options);
  generator.init().catch(console.error);
}

export default ProteinFrameGenerator;