import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {TaxonomyManagerTool} from './tools/TaxonomyManagerTool'

export default defineConfig({
  name: 'default',
  title: 'Daily Khata Pro',
  projectId: '3zccyf67',
  dataset: 'production',
  basePath: '/studio',
  plugins: [structureTool(), visionTool()],
  tools: (prev) => [
    ...prev,
    {
      name: 'taxonomy-manager',
      title: 'Taxonomy Manager',
      component: TaxonomyManagerTool,
    },
  ],
  schema: {
    types: schemaTypes,
  },
})
