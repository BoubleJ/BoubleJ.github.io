import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  loader: glob({
    pattern: "*/index.mdx",
    base: "./src/content",
    generateId: ({ entry }) =>
      entry
        .replace(/\/index\.mdx$/, "")
        .trim()
        .replace(/\s+/g, "-"),
  }),
  schema: ({ image }) =>
    z.object({
      date: z.string(),
      title: z.string(),
      categories: z.array(z.string()),
      summary: z.string(),
      thumbnail: image(),
    }),
});
export const collections = { posts };
