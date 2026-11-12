import readingTime from "reading-time";
import { getImage } from "astro:assets";
import { type CollectionEntry, getCollection } from "astro:content";

export interface PostSummary {
  id: string;
  slug: string;
  title: string;
  summary: string;
  date: string;
  categories: string[];
  thumbnail: string;
}

const byDateThenTitleDesc = (
  a: CollectionEntry<"posts">,
  b: CollectionEntry<"posts">,
) => {
  if (a.data.date !== b.data.date) return a.data.date < b.data.date ? 1 : -1;
  if (a.data.title !== b.data.title) return a.data.title < b.data.title ? 1 : -1;
  return 0;
};

export const getSortedPosts = async () =>
  (await getCollection("posts")).sort(byDateThenTitleDesc);

export const formatDate = (date: string) => `${date.replaceAll("-", ".")}.`;

const READING_WORDS_PER_MINUTE = 500;

export const getReadingTimeText = (
  entry: CollectionEntry<"posts">,
): string | undefined =>
  entry.body
    ? readingTime(entry.body, { wordsPerMinute: READING_WORDS_PER_MINUTE }).text
    : undefined;

export const toPostSummary = async (
  p: CollectionEntry<"posts">,
): Promise<PostSummary> => ({
  id: p.id,
  slug: `/${p.id}/`,
  title: p.data.title,
  summary: p.data.summary,
  date: formatDate(p.data.date),
  categories: p.data.categories,
  thumbnail: (await getImage({ src: p.data.thumbnail, format: "webp", width: 1200 })).src,
});

export const toPostSummaries = (posts: CollectionEntry<"posts">[]) =>
  Promise.all(posts.map(toPostSummary));
