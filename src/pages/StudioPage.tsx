import React from 'react';
import { Studio } from 'sanity';
import config from '../sanity/sanity.config';

export function StudioPage() {
  return (
    <div style={{ height: '100vh', width: '100vw', margin: '-16px' }}>
      <Studio config={config} />
    </div>
  );
}
