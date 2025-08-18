import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SmartNavigationProps {
  lang?: 'en' | 'es' | 'ca';
  className?: string;
}

interface NavItem {
  id: string;
  label: string;
  href: string;
  children?: NavItem[];
}

const SmartNavigation: React.FC<SmartNavigationProps> = ({ lang = 'en', className = '' }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{ label: string; href: string }>>([]);
  
  const navRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Internationalization
  const content = {
    en: {
      navigation: [
        { id: 'home', label: 'Home', href: '/en/' },
        { id: 'about', label: 'About', href: '/en/#about' },
        { id: 'research', label: 'Research', href: '/en/#research', children: [
          { id: 'publications', label: 'Publications', href: '/en/#publications' },
          { id: 'projects', label: 'Projects', href: '/en/#projects' },
          { id: 'timeline', label: 'Timeline', href: '/en/#timeline' }
        ]},
        { id: 'contact', label: 'Contact', href: '/en/#contact' }
      ],
      languages: [
        { code: 'en', label: 'English', href: '/en/' },
