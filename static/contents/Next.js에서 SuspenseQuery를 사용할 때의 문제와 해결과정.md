---
date: "2026-03-01"
title: "Next.js에서 SuspenseQuery를 사용할 때의 문제와 해결과정 (작성중)"
categories: ["React"]
summary: "쿼리 팩토리 패턴 구현."
thumbnail: "/thumbnail/vpc.png"
---

기존 코드는 명령형으로 괸리되었는데요


```ts

//DetailReview.tsx

  const { data, isLoading, isError } = useReviewListInfinityQuery(pid)

  if (isLoading) return <Loading />

  if (isError) return <Typography.Body1 ta="center">댓글을 불러오는 중 오류가 발생했습니다.</Typography.Body1>


```

useSuepseQuery를 활용해 적용하기로 했스비다. 

```ts

export function useReviewListInfinityQuery(pid: string) {
  const sort = useRecoilValue(detailCommentSortState)
  const filter = useRecoilValue(detailCommentFilterState)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useSuspenseInfiniteQuery({
    queryKey: [DETAIL_REVIEW_LIST_KEY, pid, sort, filter],
    queryFn: ({ pageParam = 1 }) =>
      getReviewsApi({
         fetcher: ApiClient,
        reviewType: 'CONTENT',
        subdir: pid,
        page: pageParam,
        size: DETAIL_REVIEW_COMMENT_COUNT_LIMIT,
        sort,
        filter,
      }),
    select: (data) => {
      return {
        reviews: data.pages.flatMap((page) => page.data.reviews),
        totalCount: data.pages[0].data.totalCount,
        allReviewStats: data.pages[0].data.allReviewStats,
        buyerReviewStats: data.pages[0].data.buyerReviewStats,
      }
    },
    getNextPageParam: (lastPage, _, lastPageParam) => {
      const lastPageNumber = Math.ceil(lastPage.data.totalCount / DETAIL_REVIEW_COMMENT_COUNT_LIMIT)
      if (lastPageNumber === lastPageParam) {
        return undefined
      }
      return lastPageParam + 1
    },
    initialPageParam: 1,
    staleTime: 0,
    placeholderData: keepPreviousData,
  })

  const { observerRef } = useIntersectionObserver({
    onScroll: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
  })

  return {
    data,
    isFetchingNextPage,
    observerRef,
  }
}

```


```ts
  <Suspense fallback={<Loading pid={params.id} />}>
        <DetailReview pid={params.id} />
    </Suspense>
```

갑자기 서버에러가 나는게 아니겠어요!

![SuspenseQuery서버에러](/image/api헤더누락에러.png)

띠요옹...

 해당 에러는 api 요청시 필수헤더값이 누락되엇을 때 나오는 에러인데요 

 분명 클라이언트에선 정상적으로 헤더를 넘기고 있는데 오ㅔ 이런 에러가 발생하나 의문이었습니다. 

 ![클라이언트작품정상노출](/image/클라이언트작품정상노출.png)

 때문에 api 요청이 어떻게 진행되나 확인해보니


 ```bash
 headers:  Object [AxiosHeaders] {
  Accept: 'application/json, text/plain, */*',
  'Content-Type': 'application/json'
}
 ```
 서버 터미널에서 콘솔이 찍히더군요.

 즉 서버에서도 호출이 진행됐고 서버에서는 클라이언트 header 접근이 안되기 때문에 에러가 발생한것이었습니다.


 왜 next 서버환경에서 api 호출이 일어났을까요??


1.진입점: useSuspenseInfiniteQuery
https://github.com/TanStack/query/blob/c1142b923b95ea99ca7d81d7f7d58758c10ddd82/packages/react-query/src/useSuspenseQuery.ts#L17-L21

```ts
'use client'
import { InfiniteQueryObserver, skipToken } from '@tanstack/query-core'
import { useBaseQuery } from './useBaseQuery'
import { defaultThrowOnError } from './suspense'
import type {
  DefaultError,
  InfiniteData,
  InfiniteQueryObserverSuccessResult,
  QueryClient,
  QueryKey,
  QueryObserver,
} from '@tanstack/query-core'
import type {
  UseSuspenseInfiniteQueryOptions,
  UseSuspenseInfiniteQueryResult,
} from './types'

export function useSuspenseInfiniteQuery<
  TQueryFnData,
  TError = DefaultError,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
>(
  options: UseSuspenseInfiniteQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >,
  queryClient?: QueryClient,
): UseSuspenseInfiniteQueryResult<TData, TError> {
  if (process.env.NODE_ENV !== 'production') {
    if ((options.queryFn as any) === skipToken) {
      console.error('skipToken is not allowed for useSuspenseInfiniteQuery')
    }
  }

  return useBaseQuery(
    {
      ...options,
      enabled: true,
      suspense: true,
      throwOnError: defaultThrowOnError,
    },
    InfiniteQueryObserver as typeof QueryObserver,
    queryClient,
  ) as InfiniteQueryObserverSuccessResult<TData, TError>
}

```

useSuspenseInfiniteQuery는 useBaseQuery만 호출합니다.
suspense: true, enabled: true, throwOnError: defaultThrowOnError를 넘기고, 옵저버로 InfiniteQueryObserver를 씁니다.
실제 “언제/무엇을 던질지”는 전부 useBaseQuery와 옵저버/캐시 쪽에 있습니다.

2. . Promise를 던지는 곳: useBaseQuery


https://github.com/TanStack/query/blob/c1142b923b95ea99ca7d81d7f7d58758c10ddd82/packages/react-query/src/useBaseQuery.ts

```ts
  // Handle suspense
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
  }
```
서버/클라이언트 구분 없이 이 분기가 실행됩니다 (isServer 체크 없음).
shouldSuspend(...)가 참이면 fetchOptimistic(...)가 반환하는 Promise를 그대로 throw합니다.
Next.js SSR이든 브라우저든, 이 훅을 쓰는 컴포넌트가 렌더될 때 “아직 로딩 중”이면 같은 경로로 Promise가 던져집니다.


3. 언제 suspend 하는지: shouldSuspend

https://github.com/TanStack/query/blob/c1142b923b95ea99ca7d81d7f7d58758c10ddd82/packages/react-query/src/suspense.ts

```ts
export const shouldSuspend = (
  defaultedOptions:
    | DefaultedQueryObserverOptions<any, any, any, any, any>
    | undefined,
  result: QueryObserverResult<any, any>,
) => defaultedOptions?.suspense && result.isPending
```

suspense === true이고 **result.isPending === true**이면 suspend 합니다.
result는 observer.getOptimisticResult(defaultedOptions)로 나온 값입니다 (아래 참고).


4. result가 어디서 오는지: useBaseQuery 안에서

https://github.com/TanStack/query/blob/c1142b923b95ea99ca7d81d7f7d58758c10ddd82/packages/react-query/src/useBaseQuery.ts

```ts
  // note: this must be called before useSyncExternalStore
  const result = observer.getOptimisticResult(defaultedOptions)
```
Observer는 useSuspenseInfiniteQuery일 때 InfiniteQueryObserver입니다.
InfiniteQueryObserver.getOptimisticResult는 부모 QueryObserver.getOptimisticResult를 그대로 쓰고, createResult에서 status === 'pending'이면 isPending: true가 됩니다.
캐시에 데이터가 없거나 아직 fetch가 끝나지 않았으면 이렇게 pending이 되고, 그때 shouldSuspend가 true가 되어 위의 throw fetchOptimistic(...)가 실행됩니다.



5. 던져지는 Promise가 만들어지는 곳: fetchOptimistic

https://github.com/TanStack/query/blob/c1142b923b95ea99ca7d81d7f7d58758c10ddd82/packages/react-query/src/suspense.ts

```ts
export const fetchOptimistic = <
  ...
>(
  defaultedOptions: ...,
  observer: QueryObserver<...>,
  errorResetBoundary: QueryErrorResetBoundaryValue,
) =>
  observer.fetchOptimistic(defaultedOptions).catch(() => {
    errorResetBoundary.clearReset()
  })
```
https://github.com/TanStack/query/blob/c1142b923b95ea99ca7d81d7f7d58758c10ddd82/packages/query-core/src/queryObserver.ts

```ts
  fetchOptimistic(
    options: QueryObserverOptions<...>,
  ): Promise<QueryObserverResult<TData, TError>> {
    const defaultedOptions = this.#client.defaultQueryOptions(options)

    const query = this.#client
      .getQueryCache()
      .build(this.#client, defaultedOptions)

    return query.fetch().then(() => this.createResult(query, defaultedOptions))
  }
```

fetchOptimistic은 캐시에 쿼리를 build하고 query.fetch()를 호출한 뒤, 그 Promise를 createResult로 이어서 반환합니다.
useBaseQuery에서는 이 반환값을 그대로 throw하므로, “fetch가 끝날 때까지 resolve되는 Promise”가 React(Suspense) 쪽으로 던져집니다.
InfiniteQueryObserver는 fetchOptimistic을 오버라이드하지 않으므로, **같은 QueryObserver.fetchOptimistic**이 useSuspenseInfiniteQuery에서도 사용됩니다.

6. SSR과의 관계
useBaseQuery의 suspense 분기에는 isServer 체크가 없습니다.
따라서 Next.js SSR 환경에서도:
컴포넌트가 렌더될 때
getOptimisticResult가 isPending: true를 주면
shouldSuspend가 true가 되고
throw fetchOptimistic(...)가 실행되어 같은 Promise가 던져집니다.
React 18의 SSR Suspense는 이렇게 던져진 Promise를 잡아서, 해당 Promise가 settle될 때까지 해당 트리를 “보류”하고(스트리밍/점진적 렌더링 등) 나중에 다시 렌더합니다.
isServer는 useBaseQuery에서 experimental_prefetchInRender 할 때만 사용됩니다 (클라이언트에서만 prefetch in render 동작하도록).

https://github.com/TanStack/query/blob/c1142b923b95ea99ca7d81d7f7d58758c10ddd82/packages/react-query/src/useBaseQuery.ts


```ts
  if (
    defaultedOptions.experimental_prefetchInRender &&
    !isServer &&
    willFetch(result, isRestoring)
  ) {
```

Suspense로 Promise를 던지는 경로와는 별개입니다.




## 7. 요약 구조

단계	파일	내용
1	useSuspenseInfiniteQuery.ts	useBaseQuery(..., suspense: true, InfiniteQueryObserver) 호출
2	useBaseQuery.ts	result = observer.getOptimisticResult(...) 후 shouldSuspend(options, result)면 throw fetchOptimistic(...)
3	suspense.ts	shouldSuspend = options.suspense && result.isPending
4	suspense.ts	fetchOptimistic = observer.fetchOptimistic(options).catch(...)
5	queryObserver.ts (query-core)	fetchOptimistic = query.fetch().then(() => createResult(...))
정리하면, useSuspenseInfiniteQuery가 Next.js SSR에서 Promise를 던지는 이유는, useBaseQuery가 suspense: true일 때 서버/클라이언트 구분 없이 result.isPending이면 fetchOptimistic Promise를 throw하기 때문이고, 그 로직이 useBaseQuery 한곳에 모여 있으며 useSuspenseQuery / useSuspenseInfiniteQuery 모두 이 같은 경로를 사용합니다.

# 해결방법

서버 컴포넌트에서 Prefetch를 통해 초기 데이터 넘겨주기

공식문서에선 다음과 같이 설명해준다

https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr



```ts
 export default function DetailReview({ pid }: DetailReviewProps) {
  const { data, observerRef, isFetchingNextPage } = useReviewListInfinityQuery(pid)

  return (
    <>
      <section>
        <DetailReviewHeader allReviewStats={data.allReviewStats} buyerReviewStats={data.buyerReviewStats} />
        <DetailReviewOptionBar />
        <DetailReviewBuyerFilter buyerCount={data.buyerReviewStats?.count} allCount={data.allReviewStats?.count} />
        <DetailReviewList pid={pid} data={data.reviews} className={cn('review-list')} />
        {isFetchingNextPage && <Loading />}

        <div ref={observerRef} className={cn('observer-padding')} />
      </section>


    </>
  )
}
```



```ts
    <Suspense fallback={<Loading />}>
      <DetailReviewQueryHydrator pid={params.id} sort={sort} filter={filter}>
        <DetailReview pid={params.id} />
      </DetailReviewQueryHydrator>
    </Suspense>
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
      getReviewsApi({
         fetcher: ApiServer,
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

fallback ui를 노출시키기 위해 3초 settimeout을 줬습니다.

![suspense정상적용](/image/suspense정상적용.gif)


다만 fallback ui가 항상 loading.tsx 노출되는게 사용성 저해라고 판단했는데요
swr패턴은 다음 포스팅에서 확인하실 수 있습니다. 

<details>

<summary>참고문헌</summary>

<div markdown="1">

https://velog.io/@junhakjh/useSuspenseQuery-%ED%86%BA%EC%95%84%EB%B3%B4%EA%B8%B01-useSuspenseQuery

https://velog.io/@junhakjh/useSuspenseQuery-%ED%86%BA%EC%95%84%EB%B3%B4%EA%B8%B02-useBaseQuery

https://velog.io/@juhyeon1114/AWS-S3%EC%99%80-Cloudfront%EB%A1%9C-%EC%9B%B9%EC%82%AC%EC%9D%B4%ED%8A%B8-%EB%B0%B0%ED%8F%AC

</div>

</details>
