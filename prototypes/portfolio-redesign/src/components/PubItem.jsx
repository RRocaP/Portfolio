import React from 'react';

const PubItem = ({ title, venue, year }) => (
  <li className="mb-2">
    <span className="font-semibold">{title}</span>,{' '}
    <span className="text-sm text-neutral-400">{venue} {year}</span>{' '}
    <a href="#" className="text-red-600 hover:underline text-sm">
      View
    </a>
  </li>
);

export default PubItem;
