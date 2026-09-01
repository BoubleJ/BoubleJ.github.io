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
  // thumbnail 은 글 폴더 안의 상대경로입니다. image() 를 써야 webp 변환과 해시가 붙습니다.
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
