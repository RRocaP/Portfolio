import React from 'react';

const ProjectCard = ({ title, tag, children }) => (
  <div className="border border-neutral-800 rounded p-4 hover:border-neutral-600 transition-colors">
    <h3 className="font-semibold text-lg mb-1">{title}</h3>
    <p className="text-sm text-red-600 font-medium mb-2">{tag}</p>
    <p className="text-base text-neutral-200">{children}</p>
  </div>
);

export default ProjectCard;
