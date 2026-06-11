import { defineCollection, z } from 'astro:content';

const noticiasCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    category: z.string().optional(),
    coverImage: z.string().optional(),
  }),
});

const paginasCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    seo: z.object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
    }).optional(),
  }),
});

const projetosCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    area: z.enum(['agricultura', 'território', 'inovação']),
    shortDescription: z.string(),
    image: z.string().optional(),
  }),
});

const equipaCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    role: z.string(),
    photo: z.string().optional(),
    shortBio: z.string().optional(),
  }),
});

export const collections = {
  noticias: noticiasCollection,
  paginas: paginasCollection,
  projetos: projetosCollection,
  equipa: equipaCollection,
};