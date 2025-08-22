import React from 'react';

const SkipToContent = () => (
  <a
    href="#main"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-red-600 text-white px-2 py-1 z-50"
  >
    Skip to content
  </a>
);

export default SkipToContent;
