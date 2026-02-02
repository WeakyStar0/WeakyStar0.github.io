// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders'; // Optional, but good for Astro 5

const weekooCollection = defineCollection({
  // In Astro 5, if you use standard markdown files in src/content/, 
  // keeping `type: 'content'` usually works, but this is the modern standard:
  loader: glob({ pattern: "**/*.md", base: "./src/content/weekoo" }),
  
  schema: z.object({
    title: z.string(),
    order: z.number().default(99),
  }),
});

export const collections = {
  'weekoo': weekooCollection,
};