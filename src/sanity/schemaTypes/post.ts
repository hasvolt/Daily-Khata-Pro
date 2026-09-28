import {defineField, defineType, defineArrayMember} from 'sanity'
import {MarkdownPastePortableTextInput} from '../components/MarkdownPastePortableTextInput'

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
      initialValue: 'Finance',
      description: 'Select main category or type a custom category name.',
      options: {
        list: [
          { title: 'Finance', value: 'Finance' },
          { title: 'Technology', value: 'Technology' },
          { title: 'Business', value: 'Business' },
          { title: 'Economy', value: 'Economy' },
          { title: 'AI & Automation', value: 'AI & Automation' },
          { title: 'Digital & Internet', value: 'Digital & Internet' },
          { title: 'Investing', value: 'Investing' },
          { title: 'Personal Finance', value: 'Personal Finance' },
          { title: 'Entrepreneurship', value: 'Entrepreneurship' },
          { title: 'Markets', value: 'Markets' },
          { title: 'Policy & Regulation', value: 'Policy & Regulation' },
          { title: 'Research & Analysis', value: 'Research & Analysis' },
        ],
      },
    }),
    defineField({
      name: 'topics',
      title: 'Topics',
      type: 'array',
      group: 'articleInfo',
      description: 'Select from predefined topics or add custom topics.',
      of: [
        defineArrayMember({
          type: 'string',
          title: 'Topic',
          options: {
            list: [
              { title: 'Artificial Intelligence', value: 'Artificial Intelligence' },
              { title: 'AI Agents', value: 'AI Agents' },
              { title: 'Machine Learning', value: 'Machine Learning' },
              { title: 'Automation', value: 'Automation' },
              { title: 'Generative AI', value: 'Generative AI' },
              { title: 'Computing', value: 'Computing' },
              { title: 'Cloud Computing', value: 'Cloud Computing' },
              { title: 'GPUs & Infrastructure', value: 'GPUs' },
              { title: 'Digital Payments', value: 'Digital Payments' },
              { title: 'Digital Assets', value: 'Digital Assets' },
              { title: 'Blockchain', value: 'Blockchain' },
              { title: 'Machine-to-Machine Commerce', value: 'Machine-to-Machine Commerce' },
              { title: 'Fintech', value: 'Fintech' },
              { title: 'Digital Economy', value: 'Digital Economy' },
              { title: 'Business', value: 'Business' },
              { title: 'Startup', value: 'Startup' },
              { title: 'Business Strategy', value: 'Business Strategy' },
              { title: 'Small Business', value: 'Small Business' },
              { title: 'E-commerce', value: 'E-commerce' },
              { title: 'Productivity', value: 'Productivity' },
              { title: 'Innovation', value: 'Innovation' },
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
              { title: 'Economy', value: 'Economy' },
              { title: 'Economic Policy', value: 'Economic Policy' },
              { title: 'Monetary Policy', value: 'Monetary Policy' },
              { title: 'Regulation', value: 'Regulation' },
              { title: 'Research', value: 'Research' },
              { title: 'Data & Statistics', value: 'Data & Statistics' },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'articleType',
      title: 'Article Type',
      type: 'string',
      group: 'articleInfo',
      options: {
        list: [
          { title: 'Guide', value: 'Guide' },
          { title: 'Explainer', value: 'Explainer' },
          { title: 'Analysis', value: 'Analysis' },
          { title: 'News', value: 'News' },
          { title: 'Research', value: 'Research' },
          { title: 'Report', value: 'Report' },
          { title: 'Case Study', value: 'Case Study' },
          { title: 'Review', value: 'Review' },
          { title: 'Opinion', value: 'Opinion' },
          { title: 'Interview', value: 'Interview' },
        ],
      },
    }),

    // AUTHOR
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: { type: 'author' },
      weak: true,
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
    defineField({
      name: 'attachedFile',
      title: 'Attach File / PDF / Document',
      type: 'file',
      group: 'media',
      description: 'Upload optional downloadable PDF, spreadsheet, document, or research report.',
      fields: [
        {
          name: 'title',
          type: 'string',
          title: 'Document / File Title',
        },
        {
          name: 'description',
          type: 'string',
          title: 'File Description',
        },
      ],
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
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 1', value: 'h1' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Heading 4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
              { title: 'Underline', value: 'underline' },
              { title: 'Strike', value: 'strike-through' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) =>
                      Rule.uri({
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  },
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
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
            },
          ],
        }),
        defineArrayMember({
          type: 'file',
          title: 'Embedded File / Document',
          fields: [
            {
              name: 'description',
              type: 'string',
              title: 'Description / Title',
            },
          ],
        }),
      ],
      components: {
        input: MarkdownPastePortableTextInput,
      },
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
