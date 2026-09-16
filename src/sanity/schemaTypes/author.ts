import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'profilePhoto',
      title: 'Profile Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'bio',
      title: 'Short Bio',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'profileUrl',
      title: 'Profile URL',
      type: 'url',
    }),
    defineField({
      name: 'professionalDescription',
      title: 'Professional Description',
      type: 'string',
      description: 'Optional professional description (e.g. Author & Independent Researcher)',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'profilePhoto',
    },
  },
})
