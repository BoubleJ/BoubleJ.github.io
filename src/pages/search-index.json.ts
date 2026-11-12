import { getSortedPosts, toPostSummary } from "@/lib/posts";
import type { CollectionEntry } from "astro:content";

const stripMdx = (raw: string) =>
  raw
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^---[\s\S]*?---/, " ")
    .replace(/\s+/g, " ")
    .trim();

export async function GET() {
  const posts = await getSortedPosts();
  const index = await Promise.all(
    posts.map(async (p: CollectionEntry<"posts">) => ({
      ...(await toPostSummary(p)),
      body: stripMdx(p.body ?? ""),
    })),
  );
  return new Response(JSON.stringify(index), {
    headers: { "Content-Type": "application/json" },
  });
}
