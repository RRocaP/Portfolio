import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { ProteinVisualizationConfig, ProteinStructureData, VisualizationState } from '../types/protein-visualization';

interface ProteinVisualizationProps {
  structureData?: ProteinStructureData;
  config?: Partial<ProteinVisualizationConfig>;
  className?: string;
}

const defaultConfig: ProteinVisualizationConfig = {
  frameCount: 180,
  frameBasePath: '/Portfolio/assets/protein-frames/',
  frameFormat: '.webp',
  scrollSensitivity: 0.5,
  smoothingFactor: 0.1
};

const defaultStructureData: ProteinStructureData = {
  name: 'Antimicrobial Peptide LL-37',
  description: 'Human cathelicidin with broad-spectrum antimicrobial activity',
  pdbId: '2K6O',
  frameCount: 180
};

export const ProteinVisualizationReact: React.FC<ProteinVisualizationProps> = ({
  structureData = defaultStructureData,
  config: userConfig,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const config = { ...defaultConfig, ...userConfig };
  
  const [state, setState] = useState<VisualizationState>({
    currentFrame: 0,
    targetFrame: 0,
    isLoading: true,
    loadProgress: 0,
    frames: []
  });

  // Load frames
  useEffect(() => {

    let loadedCount = 0;

    const loadFrame = (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const frameNumber = String(index).padStart(4, '0');
        
        img.onload = () => {
          loadedCount++;
          setState(prev => ({
            ...prev,
            loadProgress: (loadedCount / config.frameCount) * 100
          }));
          resolve(img);
        };
        
        img.onerror = () => reject(new Error(`Failed to load frame ${index}`));
        img.src = `${config.frameBasePath}frame_${frameNumber}${config.frameFormat}`;
      });
    };

    const loadAllFrames = async () => {
      try {
        const framePromises = Array.from({ length: config.frameCount }, (_, i) => loadFrame(i));
        const loadedFrames = await Promise.all(framePromises);
        
        setState(prev => ({
          ...prev,
          frames: loadedFrames.map((image, index) => ({
            index,
            image,
            loaded: true
          })),
          isLoading: false
        }));
      } catch (error) {
        // Error loading frames - fail silently in production
        // Generate synthetic frames as fallback
        generateSyntheticFrames();
      }
    };

    loadAllFrames();
  }, [config.frameCount, config.frameBasePath, config.frameFormat]);

  // Generate synthetic frames as fallback
  const generateSyntheticFrames = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const frameImages: HTMLImageElement[] = [];

    for (let i = 0; i < config.frameCount; i++) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const angle = (i / config.frameCount) * Math.PI * 2;
      drawSyntheticProtein(ctx, angle, canvas.width / 2, canvas.height / 2);
      
      const img = new Image();
      img.src = canvas.toDataURL();
      frameImages.push(img);
    }

    setState(prev => ({
      ...prev,
      frames: frameImages.map((image, index) => ({
        index,
        image,
        loaded: true
      })),
      isLoading: false
    }));
  }, [config.frameCount]);

  // Draw synthetic protein structure
  const drawSyntheticProtein = (
    ctx: CanvasRenderingContext2D,
    angle: number,
    centerX: number,
    centerY: number
  ) => {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    
    const helixRadius = 100;
    const helixHeight = 200;
    const turns = 3;
    const pointsPerTurn = 20;
    const totalPoints = turns * pointsPerTurn;
    
    // Draw helix
    ctx.strokeStyle = '#DA291C';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    for (let i = 0; i <= totalPoints; i++) {
      const t = i / totalPoints;
      const theta = t * turns * 2 * Math.PI;
      const x = Math.cos(theta) * helixRadius;
      const y = (t - 0.5) * helixHeight;
      const z = Math.sin(theta) * helixRadius;
      
      const scale = 1 + z / 200;
      const projX = x * scale;
      const projY = y * scale;
      
      if (i === 0) {
        ctx.moveTo(projX, projY);
      } else {
        ctx.lineTo(projX, projY);
      }
    }
    
    ctx.stroke();
    
    // Draw atoms
    for (let i = 0; i < 10; i++) {
      const t = i / 9;
      const theta = t * turns * 2 * Math.PI;
      const x = Math.cos(theta) * helixRadius;
      const y = (t - 0.5) * helixHeight;
      const z = Math.sin(theta) * helixRadius;
      
      const scale = 1 + z / 200;
      const projX = x * scale;
      const projY = y * scale;
      const radius = 8 * scale;
      
      ctx.fillStyle = z > 0 ? '#FFD93D' : '#DA291C';
      ctx.beginPath();
      ctx.arc(projX, projY, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  };

  // Handle scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const deltaY = scrollY - lastScrollY;
      
      scrollVelocity = deltaY * config.scrollSensitivity;
      
      setState(prev => ({
        ...prev,
        targetFrame: Math.max(0, Math.min(config.frameCount - 1, prev.targetFrame + scrollVelocity))
      }));
      
      lastScrollY = scrollY;
    };

    const throttledScroll = () => {
      if (scrollTimeout) return;
      
      scrollTimeout = setTimeout(() => {
        handleScroll();
        scrollTimeout = null as any;
      }, 16);
    };

    window.addEventListener('scroll', throttledScroll);
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [config.scrollSensitivity, config.frameCount]);

  // Handle wheel events on canvas
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setState(prev => ({
      ...prev,
      targetFrame: Math.max(0, Math.min(config.frameCount - 1, prev.targetFrame + e.deltaY * 0.1))
    }));
  }, [config.frameCount]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      // Smooth interpolation
      setState(prev => {
        const newCurrentFrame = prev.currentFrame + (prev.targetFrame - prev.currentFrame) * config.smoothingFactor;
        
        // Draw frame
        const frameIndex = Math.round(newCurrentFrame) % config.frameCount;
        const frameData = prev.frames[frameIndex];
        
        if (frameData?.loaded && frameData.image.complete) {
          const { width, height } = canvas;
          ctx.clearRect(0, 0, width, height);
          
          const scale = Math.min(
            width / frameData.image.width,
            height / frameData.image.height
          );
          
          const x = (width - frameData.image.width * scale) / 2;
          const y = (height - frameData.image.height * scale) / 2;
          
          ctx.drawImage(
            frameData.image,
            x, y,
            frameData.image.width * scale,
            frameData.image.height * scale
          );
        }
        
        return { ...prev, currentFrame: newCurrentFrame };
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config.smoothingFactor, config.frameCount, state.frames]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className={`protein-visualization-container ${className}`}>
      <div className="visualization-wrapper">
        <canvas
          ref={canvasRef}
          className="protein-canvas"
          onWheel={handleWheel}
        />
        {state.isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner" />
            <p className="loading-text">
              Loading protein structure... {Math.round(state.loadProgress)}%
            </p>
          </div>
        )}
        <div className="visualization-info">
          <h3 className="protein-name">{structureData.name}</h3>
          <p className="protein-description">{structureData.description}</p>
        </div>
      </div>
      <div className="scroll-indicator">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 5v14m0 0l-7-7m7 7l7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Scroll to rotate</span>
      </div>
    </div>
  );
};

export default ProteinVisualizationReact;