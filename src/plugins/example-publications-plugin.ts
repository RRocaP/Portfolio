import { definePlugin } from './registry';

// Example plugin injecting a custom component lazily (placeholder)
export default definePlugin({
  meta: {
    id: 'publications-enhancer',
    name: 'Publications Enhancer',
    version: '0.0.1',
    description: 'Adds inline enhancements for publications list',
    keywords: ['publications','enhance'],
    order: 10,
    enable: () => true
  },
  components: [
    { slot: 'research.publication.inline', component: async () => ({ default: () => null }) }
  ],
  setup(ctx) {
    ctx.provideData('publications.enhanced', true);
  }
});
