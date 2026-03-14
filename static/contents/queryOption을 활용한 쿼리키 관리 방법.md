---
date: "2026-03-01"
title: "queryOption을 활용한 쿼리키 관리 방법 (작성중)"
categories: ["React", "TanStack-Query", "Query-Key", "QueryOption"]
summary: "쿼리 팩토리 패턴 구현."
thumbnail: "/thumbnail/리액트쿼리.png"
---


여러분들은 쿼리키 관리를 어떻게 관리하고 계신가요??

관리방법을 공유드리고자 합니다.

기존 방식

```ts

export function useReviewListInfinityQuery(pid: string) {

//..
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useSuspenseInfiniteQuery({
    // 쿼리 키
    queryKey: [DETAIL_REVIEW_LIST_KEY, pid, sort, filter],
    queryFn: ({ pageParam = 1 }) =>
      getReviewsClientApi({
        reviewType: 'CONTENT',
        subdir: pid,
        page: pageParam,
        size: DETAIL_REVIEW_COMMENT_COUNT_LIMIT,
        sort,
        filter,
      }),
      // 나머지
  })
}

```


```ts

export default async function DetailReviewQueryHydrator({
  children,
  pid,
  sort = 'RECOMMENDED',
  filter = 'BUYER_ONLY',
}: DetailReviewQueryHydratorProps) {
  const queryClient = getQueryClient()

  await queryClient.prefetchInfiniteQuery({
    queryKey: [DETAIL_REVIEW_LIST_KEY, pid, sort, filter],
    queryFn: ({ pageParam }) =>
      getReviewsServerApi({
        reviewType: 'CONTENT',
        subdir: pid,
        page: pageParam,
        size: DETAIL_REVIEW_COMMENT_COUNT_LIMIT,
        sort,
        filter,
      }),
    initialPageParam: 1,
  })

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
}

```

1. 단일 책임 소스(Single Source of Truth)
이전

queryKey는 queryKeys.ts에, queryFn·getNextPageParam·initialPageParam은 훅/히드레이터에 각각 흩어져 있음.
useReviewListInfinityQuery와 DetailReviewQueryHydrator에서 같은 리뷰 목록 쿼리인데 queryKey 배열, queryFn, initialPageParam을 따로 작성 → 실수 시 캐시 키 불일치·옵션 누락 가능.
이후

detailReviewQueries.infiniteList({ ... }) 한 곳에서 queryKey, queryFn, getNextPageParam, initialPageParam을 묶어 관리.
클라이언트는 useSuspenseInfiniteQuery(detailReviewQueries.infiniteList({ fetcher: clientFetcher, ... })), 서버 프리패치는 prefetchInfiniteQuery(detailReviewQueries.infiniteList({ fetcher: serverFetcher, ... }))처럼 동일한 옵션 객체를 재사용 → 키·옵션 불일치 위험이 줄어듦.


---

이때 단순 쿼리키 객체로 사용하면 타입스크립트 구조적 타입 시스템으로 인해 객체로 분리된 옵션에서 오타나 잘못된 프로퍼티 사용 시 타입 에러가 발생하지 않는 문제가 있습니다.

https://5kdk.github.io/blog/2025/04/04/query-factory

```ts
useQuery({
  queryKey: todokeys.all,
  queryFn: fetchTodos,
  stallTime: 5000, // staleTime의 오타 - type error 발생
});

const todosQuery = {
  queryKey: todokeys.all,
  queryFn: fetchTodos,
  stallTime: 5000, // staleTime의 오타
};

useQuery(todosQuery); // type error가 발생하지 않음
```

```ts
export const detailReviewQueries = {
  all: () => [DETAIL_REVIEW_LIST_KEY] as const,
  lists: (pid: string) => [...detailReviewQueries.all(), pid] as const,
  infiniteList: ({ fetcher, pid, sort, filter }: DetailReviewListParams) =>
    infiniteQueryOptions({
      queryKey: [...detailReviewQueries.lists(pid), sort, filter] as const,
      queryFn: ({ pageParam = 1 }) =>
        getReviewApi({
          fetcher,
          params: {
            reviewType: 'CONTENT',
            subdir: pid,
            page: pageParam,
            size: DETAIL_REVIEW_COMMENT_COUNT_LIMIT,
            sort,
            filter,
          },
        }),
      getNextPageParam: (lastPage, _, lastPageParam) => {
        const lastPageNumber = Math.ceil(lastPage.totalCount / DETAIL_REVIEW_COMMENT_COUNT_LIMIT)
        if (lastPageNumber === lastPageParam) {
          return undefined
        }
        return lastPageParam + 1
      },
      initialPageParam: 1,
    }),
} as const

```


다음과 같은 방법을 생각할 수 있는데요

```ts
const todosQuery = {
  queryKey: todokeys.all,
  queryFn: fetchTodos,
  staleTime: 5000,
};
```

이러면 타입에러를 못잡습니다

```ts
useQuery({
  queryKey: todokeys.all,
  queryFn: fetchTodos,
  stallTime: 5000, // staleTime의 오타 - type error 발생
});

const todosQuery = {
  queryKey: todokeys.all,
  queryFn: fetchTodos,
  stallTime: 5000, // staleTime의 오타
};

useQuery(todosQuery); // type error가 발생하지 않음
```

2. 쿼리 키 계층과 무효화 전략이 명확해짐
이전

```ts
      const queries = queryClient.getQueriesData<{
      pages: Array<{
        reviews: ReviewList[]
        totalCount: number
        allReviewStats: AllReviewStats
        buyerReviewStats: BuyerReviewStats
      }>
      pageParams: number[]
    }>({
      queryKey: [DETAIL_REVIEW_LIST_KEY, pid],
    })
```

queryClient.invalidateQueries({ queryKey: [DETAIL_REVIEW_LIST_KEY] })만으로는 “리뷰 목록 전부”만 표현 가능.
특정 pid만 무효화하려면 [DETAIL_REVIEW_LIST_KEY, pid]를 직접 맞춰서 넣어야 하고, 팀원마다 배열을 다르게 짜기 쉽다.
이후

```ts
     const queries = queryClient.getQueriesData<{
      pages: Array<{
        reviews: ReviewList[]
        totalCount: number
        allReviewStats: AllReviewStats
        buyerReviewStats: BuyerReviewStats
      }>
      pageParams: number[]
    }>({
      queryKey: detailReviewQueries.lists(pid),
    })
```

detailReviewQueries.all() → 리뷰 관련 쿼리 전체
detailReviewQueries.lists(pid) → 해당 상품의 리스트들 (sort/filter 포함한 무한 쿼리들의 상위)

상품 전체 리뷰 갱신: invalidateQueries({ queryKey: detailReviewQueries.lists(pid) })
리뷰 도메인 전체: invalidateQueries({ queryKey: detailReviewQueries.all() })
QueryKey factory에서 말하는 “기능 단위 키 + 계층”을 그대로 가져가면서, 그걸 queryOptions와 합친 형태가 됩니다.





usemutate 는 setDefaultMutation 을 활용해볼 예정

https://jihoplayground.tistory.com/entry/Tanstack-Query-key%EB%A5%BC-setMutationDefaults%EB%A1%9C-%EB%AA%A8%EB%93%88%ED%99%94%ED%95%98%EC%97%AC-%EA%B4%80%EB%A6%AC%ED%95%98%EA%B8%B0


비포
```ts

//before

import { queryOptions } from '@tanstack/react-query'
import { getReviewApi } from '@/src/common/components/review/apis/getReviews'
import type { ReviewSort } from '@/src/common/components/review/types'
import type { Fetcher } from '@/src/common/types/fetch'

export const EVENT_REVIEW_LIST_KEY = 'EVENT_REVIEW_LIST'

interface EventReviewListParams {
  eventId: number
  sort: ReviewSort
  page: number
  size: number
}

export const eventReviewQueries = (fetcher: Fetcher) => ({
  all: () => [EVENT_REVIEW_LIST_KEY] as const,
  lists: () => [...eventReviewQueries(fetcher).all(), 'list'] as const,
  list: ({ eventId, sort, page, size }: EventReviewListParams) =>
    queryOptions({
      queryKey: [...eventReviewQueries(fetcher).lists(), eventId, sort, page, size] as const,
      queryFn: () =>
        getReviewApi({
          fetcher,
          params: { eventId, reviewType: 'EVENT', page, size, sort },
        }),
    }),
})

```

```ts

//after

import { queryOptions } from '@tanstack/react-query'
import { getReviewApi } from '@/src/common/components/review/apis/getReviews'
import type { ReviewSort } from '@/src/common/components/review/types'
import type { Fetcher } from '@/src/common/types/fetch'
import { EVENT_COMMENT_COUNT_LIMIT } from '@/src/event/constants'

export const EVENT_REVIEW_LIST_KEY = 'EVENT_REVIEW_LIST'

interface EventReviewListParams {
  fetcher: Fetcher
  eventId: number
  sort: ReviewSort
  page: number
}

export const eventReviewQueries = {
  all: () => [EVENT_REVIEW_LIST_KEY] as const,
  lists: () => [...eventReviewQueries.all()] as const,
  list: ({ fetcher, eventId, sort, page }: EventReviewListParams) =>
    queryOptions({
      queryKey: [...eventReviewQueries.lists(), eventId, sort, page] as const,
      queryFn: () =>
        getReviewApi({
          fetcher,
      params: { eventId, reviewType: 'EVENT', page, size: EVENT_COMMENT_COUNT_LIMIT, sort },
        }),
    }),
} as const

```


<details>

<summary>참고문헌</summary>

<div markdown="1">

https://velog.io/@juhyeon1114/AWS-S3%EC%99%80-Cloudfront%EB%A1%9C-%EC%9B%B9%EC%82%AC%EC%9D%B4%ED%8A%B8-%EB%B0%B0%ED%8F%AC

</div>

</details>
