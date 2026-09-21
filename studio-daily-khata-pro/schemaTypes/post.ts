import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  groups: [
    { name: 'articleInfo', title: 'Article Information', default: true },
    { name: 'author', title: 'Author' },
    { name: 'media', title: 'Media' },
    { name: 'publication', title: 'Publication' },
    { name: 'content', title: 'Content' },
    { name: 'research', title: 'Research' },
    { name: 'disclaimer', title: 'Disclaimer' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ARTICLE INFORMATION
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'articleInfo',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'articleInfo',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt / Short Summary',
      type: 'text',
      group: 'articleInfo',
      rows: 3,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'articleInfo',
      options: {
        list: [
          { title: 'Finance', value: 'Finance' }
        ],
      },
      initialValue: 'Finance',
    }),
    defineField({
      name: 'topics',
      title: 'Topics',
      type: 'array',
      group: 'articleInfo',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Business', value: 'Business' },
          { title: 'Startup', value: 'Startup' },
          { title: 'Income & Expenses', value: 'Income & Expenses' },
          { title: 'Budgeting', value: 'Budgeting' },
          { title: 'Saving', value: 'Saving' },
          { title: 'Emergency Fund', value: 'Emergency Fund' },
          { title: 'Investment', value: 'Investment' },
          { title: 'Personal Finance', value: 'Personal Finance' },
          { title: 'Money Management', value: 'Money Management' },
          { title: 'Wealth Building', value: 'Wealth Building' },
          { title: 'Banking', value: 'Banking' },
          { title: 'Loans & Credit', value: 'Loans & Credit' },
          { title: 'Insurance', value: 'Insurance' },
          { title: 'Taxes', value: 'Taxes' },
          { title: 'Financial Planning', value: 'Financial Planning' },
        ],
      },
    }),
    defineField({
      name: 'articleType',
      title: 'Article Type',
      type: 'string',
      group: 'articleInfo',
      options: {
        list: [
          { title: 'Guide', value: 'Guide' },
          { title: 'Analysis', value: 'Analysis' },
          { title: 'News', value: 'News' },
          { title: 'Explainer', value: 'Explainer' },
          { title: 'Opinion', value: 'Opinion' },
        ],
      },
    }),

    // AUTHOR
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: { type: 'author' },
      group: 'author',
    }),

    // MEDIA
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility.',
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
        {
          name: 'credit',
          type: 'string',
          title: 'Credit / Source',
        }
      ]
    }),

    // PUBLICATION
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'publication',
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated at',
      type: 'datetime',
      group: 'publication',
    }),

    // CONTENT
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      group: 'content',
      of: [
        {type: 'block'},
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              description: 'Important for SEO and accessibility.',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
            {
              name: 'credit',
              type: 'string',
              title: 'Credit / Source',
            }
          ]
        }
      ],
    }),

    // RESEARCH
    defineField({
      name: 'sources',
      title: 'Sources / References',
      type: 'array',
      group: 'research',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Source Name', type: 'string' },
            { name: 'url', title: 'Source URL', type: 'url' },
            { name: 'description', title: 'Description', type: 'text', rows: 2 },
            { name: 'date', title: 'Publication / Reference Date', type: 'date' },
          ],
        },
      ],
    }),

    // DISCLAIMER
    defineField({
      name: 'disclaimer',
      title: 'Disclaimer',
      type: 'text',
      group: 'disclaimer',
      description: 'Article-specific disclaimer content',
      rows: 4,
    }),

    // SEO
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      group: 'seo',
      fields: [
        { name: 'seoTitle', title: 'SEO Title', type: 'string' },
        { name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 3 },
        { name: 'socialImage', title: 'Social / OG Image', type: 'image', options: { hotspot: true } },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'featuredImage',
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author ? `by ${author}` : 'No author'}
    },
  },
})
