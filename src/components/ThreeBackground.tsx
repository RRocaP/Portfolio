import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import type { RefObject } from 'react';

interface ThreeBackgroundProps {
  enabled?: boolean;
  quality?: 'low' | 'med' | 'high';
  className?: string;
}

interface ThreeObjects {
  scene: any;
  camera: any;
  renderer: any;
  particles: any;
  geometry: any;
  material: any;
  animationId: number | null;
  mouse: { x: number; y: number };
}

const QUALITY_SETTINGS = {
  low: { particles: 800, size: 1.5, speed: 0.5 },
  med: { particles: 1200, size: 2, speed: 0.8 },
  high: { particles: 2000, size: 2.5, speed: 1 }
} as const;

const ThreeBackground: React.FC<ThreeBackgroundProps> = ({
  enabled = true,
  quality = 'med',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const threeObjectsRef = useRef<ThreeObjects | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number>(0);

  // Check for reduced motion preference and mobile
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mobileQuery.matches);

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    const handleMobileChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener('change', handleReducedMotionChange);
    mobileQuery.addEventListener('change', handleMobileChange);

    return () => {
      mediaQuery.removeEventListener('change', handleReducedMotionChange);
      mobileQuery.removeEventListener('change', handleMobileChange);
    };
  }, []);

  // Throttled mouse move handler
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (prefersReducedMotion || !enabled) return;
    
    // Throttle to ~60fps
    if (frameRef.current > 0) return;
    frameRef.current = requestAnimationFrame(() => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      }
      frameRef.current = 0;
    });
  }, [prefersReducedMotion, enabled]);

  // Initialize Three.js scene
  const initThreeJS = useCallback(async () => {
    if (!canvasRef.current || !enabled || prefersReducedMotion) return;

    try {
      // Lazy load Three.js
      const THREE = await import('three');
      
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      
      // Scene setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.1, 1000);
      camera.position.z = 5;

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !isMobile,
        powerPreference: isMobile ? 'low-power' : 'high-performance'
      });
      
      renderer.setSize(rect.width, rect.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
      
      // Particle system
      const settings = QUALITY_SETTINGS[quality];
      const particleCount = isMobile ? Math.floor(settings.particles * 0.6) : settings.particles;
      
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      // Catalan-inspired color palette
      const colorPalette = [
        new THREE.Color('#DA291C'), // Catalan red
        new THREE.Color('#FFD93D'), // Catalan yellow  
        new THREE.Color('#FFFFFF'), // White
        new THREE.Color('#E5E5E5')  // Light gray
      ];

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Random positions in a sphere
        const radius = Math.random() * 8 + 2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);

        // Random colors from palette
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;

        // Random sizes
        sizes[i] = Math.random() * settings.size + 0.5;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      // Shader material for better performance
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          mouse: { value: new THREE.Vector2() }
        },
        vertexShader: `
          attribute float size;
          varying vec3 vColor;
          uniform float time;
          uniform vec2 mouse;
          
          void main() {
            vColor = color;
            vec3 pos = position;
            
            // Gentle wave motion
            pos.x += sin(time * 0.5 + position.y * 0.1) * 0.1;
            pos.y += cos(time * 0.3 + position.x * 0.1) * 0.1;
            
            // Mouse interaction
            vec2 mouseInfluence = mouse * 0.3;
            pos.xy += mouseInfluence * (1.0 / (distance(pos.xy, mouseInfluence) + 1.0));
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          
          void main() {
            float r = distance(gl_PointCoord, vec2(0.5, 0.5));
            if (r > 0.5) discard;
            
            float alpha = 1.0 - r * 2.0;
            gl_FragColor = vec4(vColor, alpha * 0.8);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        vertexColors: true
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);

      // Store objects
      threeObjectsRef.current = {
        scene,
        camera,
        renderer,
        particles,
        geometry,
        material,
        animationId: null,
        mouse: { x: 0, y: 0 }
      };

      setIsLoaded(true);
    } catch (error) {
      console.warn('ThreeBackground: Failed to initialize Three.js:', error);
      setHasError(true);
    }
  }, [enabled, prefersReducedMotion, isMobile, quality]);

  // Animation loop
  const animate = useCallback(() => {
    if (!threeObjectsRef.current || prefersReducedMotion) return;

    const { scene, camera, renderer, material } = threeObjectsRef.current;
    
    // Update uniforms
    const time = Date.now() * 0.001;
    material.uniforms.time.value = time;
    material.uniforms.mouse.value.set(mouseRef.current.x, mouseRef.current.y);

    // Render
    renderer.render(scene, camera);
    
    // Continue animation
    threeObjectsRef.current.animationId = requestAnimationFrame(animate);
  }, [prefersReducedMotion]);

  // Handle resize
  const handleResize = useCallback(() => {
    if (!threeObjectsRef.current || !canvasRef.current) return;

    const { camera, renderer } = threeObjectsRef.current;
    const rect = canvasRef.current.getBoundingClientRect();
    
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
    renderer.setSize(rect.width, rect.height);
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (!threeObjectsRef.current) return;

    const { renderer, geometry, material, animationId } = threeObjectsRef.current;
    
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    
    // Dispose of Three.js resources
    geometry?.dispose();
    material?.dispose();
    renderer?.dispose();
    
    threeObjectsRef.current = null;
  }, []);

  // Initialize Three.js when component mounts
  useEffect(() => {
    if (!enabled || prefersReducedMotion) return;

    const timeoutId = setTimeout(initThreeJS, 100); // Small delay for canvas to be ready
    
    return () => clearTimeout(timeoutId);
  }, [initThreeJS, enabled, prefersReducedMotion]);

  // Start animation when loaded
  useEffect(() => {
    if (isLoaded && !prefersReducedMotion) {
      animate();
    }
    
    return () => {
      if (threeObjectsRef.current?.animationId) {
        cancelAnimationFrame(threeObjectsRef.current.animationId);
      }
    };
  }, [isLoaded, animate, prefersReducedMotion]);

  // Event listeners
  useEffect(() => {
    if (!enabled || prefersReducedMotion) return;

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleMouseMove, handleResize, enabled, prefersReducedMotion]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Static fallback for reduced motion
  const StaticFallback = useMemo(() => {
    if (!prefersReducedMotion && enabled) return null;

    return (
      <div 
        className={`absolute inset-0 opacity-20 ${className}`}
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(218, 41, 28, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(255, 217, 61, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
          `
        }}
        aria-hidden="true"
      />
    );
  }, [prefersReducedMotion, enabled, className]);

  if (!enabled || hasError) {
    return null;
  }

  if (prefersReducedMotion) {
    return StaticFallback;
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 pointer-events-none ${className}`}
        style={{ 
          width: '100%', 
          height: '100%',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out'
        }}
        aria-hidden="true"
      />
      {!isLoaded && (
        <div 
          className={`absolute inset-0 opacity-10 ${className}`}
          style={{
            background: `
              radial-gradient(circle at 25% 25%, rgba(218, 41, 28, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(255, 217, 61, 0.1) 0%, transparent 50%)
            `
          }}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default ThreeBackground;