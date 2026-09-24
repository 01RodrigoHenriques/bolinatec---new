import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const noticias = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/noticias' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    category: z.string().optional(),
    coverImage: z.string().optional(),
  }),
});

const projetos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projetos' }),
  schema: z.object({
    title: z.string(),
    area: z.string().optional(),
    maturity: z.enum(['produto', 'experiencia', 'investigacao']).default('produto'),
    status: z.string().optional(),
    shortDescription: z.string(),
    image: z.string().optional(),
    externalUrl: z.string().optional(),
  }),
});

const equipa = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/equipa' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    photo: z.string().optional(),
    shortBio: z.string().optional(),
  }),
});

export const collections = { noticias, projetos, equipa };