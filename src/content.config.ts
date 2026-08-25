import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  loader: glob({
    pattern: "*/index.mdx",
    base: "./src/content/posts",
    generateId: ({ entry }) =>
      entry
        .replace(/\/index\.mdx$/, "")
        .trim()
        .replace(/\s+/g, "-"),
  }),
  schema: z.object({
    date: z.string(),
    title: z.string(),
    categories: z.array(z.string()),
    summary: z.string(),
    thumbnail: z.string(),
  }),
});
export const collections = { posts };
