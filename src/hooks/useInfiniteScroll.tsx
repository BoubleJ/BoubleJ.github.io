import { MutableRefObject, useState, useEffect, useRef, useMemo } from 'react'
import { PostListItemType } from '@/types/PostItem.types'

export type useInfiniteScrollType = {
  containerRef: MutableRefObject<HTMLDivElement | null>
  postList: PostListItemType[]
}

const NUMBER_OF_ITEMS_PER_PAGE = 10

const useInfiniteScroll = function (
  selectedCategory: string,
  searchTerm: string = "",
  posts: PostListItemType[],
): useInfiniteScrollType {
  const containerRef: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement>(null)
  const observer: MutableRefObject<IntersectionObserver | null> =
    useRef<IntersectionObserver>(null)
  const [count, setCount] = useState<number>(1)

  const postListByCategory = useMemo<PostListItemType[]>(
    () => {
      let filtered = posts;

      // 카테고리 필터링
      if (selectedCategory !== 'All') {
        filtered = filtered.filter(
          ({
            node: {
              frontmatter: { categories },
            },
          }: PostListItemType) => categories.includes(selectedCategory),
        );
      }

      // 검색어 필터링
      if (searchTerm.trim()) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        filtered = filtered.filter(
          ({
            node: {
              frontmatter: { title, summary },
            },
          }: PostListItemType) => {
            const lowerTitle = title.toLowerCase();
            const lowerSummary = summary?.toLowerCase() || '';
            return (
              lowerTitle.includes(lowerSearchTerm) ||
              lowerSummary.includes(lowerSearchTerm)
            );
          },
        );
      }

      return filtered;
    },
    [selectedCategory, searchTerm, posts],
  )

  useEffect(() => {
    observer.current = new IntersectionObserver((entries, observer) => {
      if (!entries[0].isIntersecting) return

      setCount(value => value + 1)
      observer.unobserve(entries[0].target)
    })
  }, [])

  useEffect(() => setCount(1), [selectedCategory, searchTerm])

  useEffect(() => {
    if (
      NUMBER_OF_ITEMS_PER_PAGE * count >= postListByCategory.length ||
      containerRef.current === null ||
      containerRef.current.children.length === 0 ||
      observer.current === null
    )
      return

    observer.current.observe(
      containerRef.current.children[containerRef.current.children.length - 1],
    )
  }, [count, selectedCategory, searchTerm, postListByCategory.length])

  return {
    containerRef,
    postList: postListByCategory.slice(0, count * NUMBER_OF_ITEMS_PER_PAGE),
  }
}

export default useInfiniteScroll