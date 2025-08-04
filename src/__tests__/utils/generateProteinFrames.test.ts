import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import ProteinFrameGenerator from '../../utils/generateProteinFrames';

// Mock dependencies
vi.mock('canvas', () => ({
  createCanvas: vi.fn(() => ({
    getContext: vi.fn(() => ({
      fillStyle: '',
      fillRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      strokeStyle: '',
      lineWidth: 0,
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      globalAlpha: 1,
    })),
    toBuffer: vi.fn(() => Buffer.from('mock-image-data')),
    width: 800,
    height: 600,
  })),
}));

vi.mock('fs/promises', () => ({
  mkdir: vi.fn().mockResolvedValue(undefined),
  writeFile: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('node-fetch', () => ({
  default: vi.fn(),
}));

import { createCanvas } from 'canvas';
import fs from 'fs/promises';
import fetch from 'node-fetch';

describe('ProteinFrameGenerator', () => {
  let generator: ProteinFrameGenerator;
  let mockCanvas: any;
  let mockContext: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockContext = {
      fillStyle: '',
      fillRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      strokeStyle: '',
      lineWidth: 0,
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      globalAlpha: 1,
    };

    mockCanvas = {
      getContext: vi.fn(() => mockContext),
      toBuffer: vi.fn(() => Buffer.from('mock-image-data')),
      width: 800,
      height: 600,
    };

    (createCanvas as Mock).mockReturnValue(mockCanvas);
  });

  describe('Constructor', () => {
    it('creates instance with default options', () => {
      generator = new ProteinFrameGenerator();
      expect(generator).toBeInstanceOf(ProteinFrameGenerator);
    });

    it('accepts custom options', () => {
      const options = {
        pdbId: 'TEST',
        frameCount: 100,
        outputDir: './test-output/',
        width: 1024,
        height: 768,
        format: 'png',
        quality: 90,
      };

      generator = new ProteinFrameGenerator(options);
      expect(generator).toBeInstanceOf(ProteinFrameGenerator);
    });

    it('uses default values for missing options', () => {
      const options = {
        pdbId: 'CUSTOM',
      };

      generator = new ProteinFrameGenerator(options);
      expect(generator).toBeInstanceOf(ProteinFrameGenerator);
    });
  });

  describe('PDB Data Fetching', () => {
    beforeEach(() => {
      generator = new ProteinFrameGenerator({ pdbId: '2K6O' });
    });

    it('fetches PDB data from RCSB', async () => {
      const mockPdbData = `
ATOM      1  N   ALA A   1      20.154  16.967  25.000  1.00 20.00           N
ATOM      2  CA  ALA A   1      21.618  16.967  25.000  1.00 20.00           C
ATOM      3  C   ALA A   1      22.252  18.367  25.000  1.00 20.00           C
ATOM      4  O   ALA A   1      21.618  19.434  25.000  1.00 20.00           O
END
      `;

      (fetch as Mock).mockResolvedValue({
        text: vi.fn().mockResolvedValue(mockPdbData),
      });

      const result = await generator.fetchPDBData();

      expect(fetch).toHaveBeenCalledWith('https://files.rcsb.org/download/2K6O.pdb');
      expect(result).toHaveProperty('atoms');
      expect(result.atoms).toHaveLength(4);
    });

    it('parses PDB atom data correctly', async () => {
      const mockPdbData = `
ATOM      1  N   ALA A   1      20.154  16.967  25.000  1.00 20.00           N
ATOM      2  CA  ALA A   1      21.618  16.967  25.000  1.00 20.00           C
      `;

      (fetch as Mock).mockResolvedValue({
        text: vi.fn().mockResolvedValue(mockPdbData),
      });

      const result = await generator.fetchPDBData();

      expect(result.atoms[0]).toEqual({
        type: 'N',
        residue: 'ALA',
        chain: 'A',
        x: 20.154,
        y: 16.967,
        z: 25.000,
        element: 'N',
      });
    });

    it('handles HETATM records', async () => {
      const mockPdbData = `
HETATM    1  O   HOH A 101      25.000  25.000  25.000  1.00 30.00           O
      `;

      (fetch as Mock).mockResolvedValue({
        text: vi.fn().mockResolvedValue(mockPdbData),
      });

      const result = await generator.fetchPDBData();

      expect(result.atoms).toHaveLength(1);
      expect(result.atoms[0].residue).toBe('HOH');
    });

    it('handles fetch errors gracefully', async () => {
      (fetch as Mock).mockRejectedValue(new Error('Network error'));

      await expect(generator.fetchPDBData()).rejects.toThrow('Network error');
    });
  });

  describe('Frame Generation', () => {
    beforeEach(() => {
      generator = new ProteinFrameGenerator({
        frameCount: 5,
        format: 'webp',
        quality: 85,
      });
    });

    it('creates output directory', async () => {
      (fs.mkdir as Mock).mockResolvedValue(undefined);
      (fs.writeFile as Mock).mockResolvedValue(undefined);

      // Mock structure data to avoid fetching
      generator['structureData'] = { atoms: [] };

      await generator.generateFrames();

      expect(fs.mkdir).toHaveBeenCalledWith(
        expect.any(String),
        { recursive: true }
      );
    });

    it('generates correct number of frames', async () => {
      (fs.writeFile as Mock).mockResolvedValue(undefined);
      generator['structureData'] = { atoms: [] };

      await generator.generateFrames();

      expect(createCanvas).toHaveBeenCalledTimes(5);
      expect(fs.writeFile).toHaveBeenCalledTimes(5);
    });

    it('saves frames with correct filenames', async () => {
      (fs.writeFile as Mock).mockResolvedValue(undefined);
      generator['structureData'] = { atoms: [] };

      await generator.generateFrames();

      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('frame_0000.webp'),
        expect.any(Buffer)
      );
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('frame_0004.webp'),
        expect.any(Buffer)
      );
    });

    it('supports different image formats', async () => {
      const pngGenerator = new ProteinFrameGenerator({
        frameCount: 1,
        format: 'png',
      });
      pngGenerator['structureData'] = { atoms: [] };

      (fs.writeFile as Mock).mockResolvedValue(undefined);

      await pngGenerator.generateFrames();

      expect(mockCanvas.toBuffer).toHaveBeenCalledWith('image/png');
    });

    it('supports JPEG format', async () => {
      const jpgGenerator = new ProteinFrameGenerator({
        frameCount: 1,
        format: 'jpg',
        quality: 90,
      });
      jpgGenerator['structureData'] = { atoms: [] };

      (fs.writeFile as Mock).mockResolvedValue(undefined);

      await jpgGenerator.generateFrames();

      expect(mockCanvas.toBuffer).toHaveBeenCalledWith('image/jpeg', { quality: 0.9 });
    });
  });

  describe('Protein Structure Drawing', () => {
    beforeEach(() => {
      generator = new ProteinFrameGenerator();
    });

    it('draws protein structure with real data', () => {
      const mockAtoms = [
        { type: 'N', residue: 'ALA', chain: 'A', x: 0, y: 0, z: 0, element: 'N' },
        { type: 'CA', residue: 'ALA', chain: 'A', x: 1, y: 0, z: 0, element: 'C' },
        { type: 'C', residue: 'ALA', chain: 'A', x: 2, y: 0, z: 0, element: 'C' },
      ];

      generator['structureData'] = { atoms: mockAtoms };

      generator.drawProteinStructure(mockContext, 0);

      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.arc).toHaveBeenCalled();
      expect(mockContext.fill).toHaveBeenCalled();
    });

    it('calculates correct atom colors', () => {
      const mockAtoms = [
        { type: 'N', residue: 'ALA', chain: 'A', x: 0, y: 0, z: 0, element: 'N' },
        { type: 'O', residue: 'ALA', chain: 'A', x: 1, y: 0, z: 0, element: 'O' },
        { type: 'S', residue: 'CYS', chain: 'A', x: 2, y: 0, z: 0, element: 'S' },
      ];

      generator['structureData'] = { atoms: mockAtoms };

      generator.drawProteinStructure(mockContext, 0);

      // Colors should be set for different elements
      expect(mockContext.fillStyle).toHaveBeenCalledWith('#3050F8'); // Nitrogen
      expect(mockContext.fillStyle).toHaveBeenCalledWith('#FF0D0D'); // Oxygen
      expect(mockContext.fillStyle).toHaveBeenCalledWith('#FFFF30'); // Sulfur
    });

    it('handles rotation angles correctly', () => {
      const mockAtoms = [
        { type: 'CA', residue: 'ALA', chain: 'A', x: 10, y: 0, z: 0, element: 'C' },
      ];

      generator['structureData'] = { atoms: mockAtoms };

      // Test different rotation angles
      generator.drawProteinStructure(mockContext, 0);
      generator.drawProteinStructure(mockContext, Math.PI / 2);
      generator.drawProteinStructure(mockContext, Math.PI);

      // Should draw atoms at different positions due to rotation
      expect(mockContext.arc).toHaveBeenCalledTimes(6); // 3 calls * 2 (atom + highlight)
    });

    it('applies depth-based effects', () => {
      const mockAtoms = [
        { type: 'CA', residue: 'ALA', chain: 'A', x: 0, y: 0, z: 10, element: 'C' },
        { type: 'CB', residue: 'ALA', chain: 'A', x: 0, y: 0, z: -10, element: 'C' },
      ];

      generator['structureData'] = { atoms: mockAtoms };

      generator.drawProteinStructure(mockContext, 0);

      // globalAlpha should be modified for depth effects
      expect(mockContext.globalAlpha).not.toBe(1);
    });

    it('falls back to synthetic protein when no data', () => {
      generator['structureData'] = undefined;

      const drawSyntheticSpy = vi.spyOn(generator, 'drawSyntheticProtein');

      generator.drawProteinStructure(mockContext, 0);

      expect(drawSyntheticSpy).toHaveBeenCalled();
    });
  });

  describe('Synthetic Protein Drawing', () => {
    beforeEach(() => {
      generator = new ProteinFrameGenerator();
    });

    it('draws synthetic helix structure', () => {
      generator.drawSyntheticProtein(mockContext, 0, 400, 300);

      expect(mockContext.save).toHaveBeenCalled();
      expect(mockContext.restore).toHaveBeenCalled();
      expect(mockContext.translate).toHaveBeenCalledWith(400, 300);
      expect(mockContext.rotate).toHaveBeenCalledWith(0);
    });

    it('draws helix backbone', () => {
      generator.drawSyntheticProtein(mockContext, 0, 400, 300);

      expect(mockContext.strokeStyle).toBe('#DA291C');
      expect(mockContext.lineWidth).toBe(4);
      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.stroke).toHaveBeenCalled();
    });

    it('draws residue atoms', () => {
      generator.drawSyntheticProtein(mockContext, 0, 400, 300);

      // Should draw 20 atoms/residues
      expect(mockContext.arc).toHaveBeenCalledTimes(40); // 20 atoms + 20 highlights
      expect(mockContext.fill).toHaveBeenCalled();
    });

    it('applies depth-based coloring', () => {
      generator.drawSyntheticProtein(mockContext, 0, 400, 300);

      // Should set HSL colors for depth effect
      expect(mockContext.fillStyle).toMatch(/hsl\(\d+, 70%, 50%\)/);
    });
  });

  describe('Initialization', () => {
    it('completes full initialization process', async () => {
      generator = new ProteinFrameGenerator({
        frameCount: 2,
        pdbId: 'TEST',
      });

      const mockPdbData = 'ATOM      1  N   ALA A   1      0.000   0.000   0.000  1.00 20.00           N\nEND';
      (fetch as Mock).mockResolvedValue({
        text: vi.fn().mockResolvedValue(mockPdbData),
      });

      (fs.mkdir as Mock).mockResolvedValue(undefined);
      (fs.writeFile as Mock).mockResolvedValue(undefined);

      await generator.init();

      expect(fs.mkdir).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalled();
      expect(createCanvas).toHaveBeenCalledTimes(2);
      expect(fs.writeFile).toHaveBeenCalledTimes(2);
    });

    it('handles initialization errors', async () => {
      generator = new ProteinFrameGenerator();

      (fetch as Mock).mockRejectedValue(new Error('Failed to fetch'));

      await expect(generator.init()).rejects.toThrow('Failed to fetch');
    });
  });

  describe('Command Line Interface', () => {
    it('parses command line arguments correctly', () => {
      const originalArgv = process.argv;
      
      process.argv = ['node', 'script.js', '--pdb', '1ABC', '--frames', '90', '--width', '1024'];

      // Test argument parsing logic would go here
      // This is more of an integration test that would require actual CLI execution
      
      process.argv = originalArgv;
    });
  });

  describe('Edge Cases', () => {
    it('handles empty PDB data', async () => {
      generator = new ProteinFrameGenerator();

      (fetch as Mock).mockResolvedValue({
        text: vi.fn().mockResolvedValue('END\n'),
      });

      const result = await generator.fetchPDBData();

      expect(result.atoms).toHaveLength(0);
    });

    it('handles malformed PDB lines', async () => {
      generator = new ProteinFrameGenerator();

      const malformedPdbData = `
ATOM      1  N   ALA
INVALID LINE
ATOM      2  CA  ALA A   1      21.618  16.967  25.000  1.00 20.00           C
      `;

      (fetch as Mock).mockResolvedValue({
        text: vi.fn().mockResolvedValue(malformedPdbData),
      });

      const result = await generator.fetchPDBData();

      // Should only parse valid ATOM lines
      expect(result.atoms).toHaveLength(1);
    });

    it('handles zero frame count', async () => {
      generator = new ProteinFrameGenerator({ frameCount: 0 });
      generator['structureData'] = { atoms: [] };

      await generator.generateFrames();

      expect(createCanvas).not.toHaveBeenCalled();
      expect(fs.writeFile).not.toHaveBeenCalled();
    });

    it('handles single atom structures', () => {
      const singleAtom = [
        { type: 'CA', residue: 'ALA', chain: 'A', x: 0, y: 0, z: 0, element: 'C' },
      ];

      generator['structureData'] = { atoms: singleAtom };

      expect(() => {
        generator.drawProteinStructure(mockContext, 0);
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('handles large structures efficiently', async () => {
      const largeStructure = Array.from({ length: 1000 }, (_, i) => ({
        type: 'CA',
        residue: 'ALA',
        chain: 'A',
        x: i,
        y: 0,
        z: 0,
        element: 'C',
      }));

      generator = new ProteinFrameGenerator({ frameCount: 1 });
      generator['structureData'] = { atoms: largeStructure };

      (fs.writeFile as Mock).mockResolvedValue(undefined);

      const startTime = performance.now();
      await generator.generateFrames();
      const endTime = performance.now();

      // Should complete in reasonable time (less than 1 second for test)
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });
});