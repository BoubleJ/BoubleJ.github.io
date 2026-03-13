---
date: "2026-03-01"
title: "Next.js에서 SuspenseQuery를 사용할 때의 문제와 해결과정 (작성중)"
categories: ["React"]
summary: "쿼리 팩토리 패턴 구현."
thumbnail: "/thumbnail/리액트쿼리.png"
---

# useInifinteQuery

무한 스크롤 구현을 위해 TanStack-Query의 useInifinteQuery 훅을 많이 사용하는데요. 

useInifinteQuery 훅을 아래와 같이 명령형으로 서버 상태를 관리하게 됩니다.


```ts

  const { data, isLoading, isError } = useReviewListInfinityQuery(pid)

  if (isLoading) return <Loading />


```
## 문제점

명령형으로 처리한다고 해서 당장 기능적인 문제가 생기는 것은 아니지만, 컴포넌트가 API 데이터의 모든 상태를 직접 관리하는 단일 책임 원칙에 어긋나게 됩니다.

또한 조회해야 하는 API가 많아질수록 각 로딩·에러 상태를 처리하는 코드가 기하급수적으로 복잡해지고, 그만큼 유지보수 역시 어려워지는 단점이 있지요.

```ts

  const ReviewList1Query = useReviewList1InfinityQuery(pid)
  const ReviewList2Query = useReviewList2InfinityQuery(pid)
  const ReviewList3Query  = useReviewList3InfinityQuery(pid)

    if (
    ReviewList1Query.isLoading ||
    ReviewList2Query.isLoading ||
    ReviewList3Query.isLoading // 이 부분에서 매번 추가해야 합니다.
  ) {
   return <Loading />
  }

```

# useSuspenseInfiniteQuery와 Suspense

이러한 단점을 해소하기 위해, TanStack Query v5에서 제공하는 useSuspenseInfiniteQuery와 React의 Suspense를 함께 사용하여 서버 상태를 선언적으로 관리하는 방식으로 전환할 수 있습니다.

```ts

export function useReviewListInfinityQuery(pid: string) {

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useSuspenseInfiniteQuery({
    queryKey: [QUERY_KEY],
    queryFn: () =>
      getReviewsApi(
            //..
      ),
  
  return {
    data,
  }
}

```


```tsx
  <Suspense fallback={<Loading />}>
        <DetailReview pid={params.id} />
    </Suspense>
```

DetailReview 컴포넌트 내부에서 useSuspenseInfiniteQuery가 던지는 Promise를 Suspense가 받아 pending 상태일 때 fallback UI를 노출함으로써, 기존 useInfiniteQuery의 isLoading 상태 관리를 대체할 수 있습니다.

또한 Suspense의 스트리밍 기능을 활용하면 서버에서 HTML을 청크(Chunk) 단위로 클라이언트에 전송할 수 있어, 모든 데이터를 다 불러오기 전에 준비된 컴포넌트부터 순차적으로 렌더링됩니다. 이를 통해 사용자는 모든 API 호출이 끝날 때까지 기다리지 않고, 일부 API가 아직 응답 중인 상황에서도 웹사이트를 이용할 수 있으므로 사용자 경험 측면에서도 큰 이점을 얻을 수 있습니다.

## 문제점

하지만 위와 같이 적용했을 때 한 가지 문제가 발생했습니다. API 호출 시 필수 헤더 값이 누락되었다는 에러가 뜨더군요.

![SuspenseQuery서버에러](/image/api헤더누락에러.png)

분명 클라이언트에서 useSuspenseInfiniteQuery로 API를 호출할 때는 헤더가 정상적으로 포함되어 있었기 때문에, 왜 이런 에러가 발생하는지 상당히 의문이었습니다.

## 원인은 useBaseQuery

api 요청 시 콘솔을 찍어보니 서버 터미널에서 콘솔이 찍히는걸 확인할 수 있었습니다. 

 ```bash
 headers:  Object [AxiosHeaders] {
  Accept: 'application/json, text/plain, */*',
  'Content-Type': 'application/json'
}
 ```

즉 서버에서도 동일한 API 호출이 발생했고, 서버 환경에서는 클라이언트 헤더에 접근할 수 없기 때문에 필수헤더가 누락되어 해당 에러가 발생한 것이었습니다.


그렇다면 왜 Next.js 서버 환경에서 API 호출이 일어났을까요? 이 원인을 파악하기 위해 TanStack Query의 소스 코드를 직접 까봤습니다.


### 1. 진입점 : [useSuspenseInfiniteQuery](https://github.com/TanStack/query/blob/c1142b923b95ea99ca7d81d7f7d58758c10ddd82/packages/react-query/src/useSuspenseQuery.ts#L17-L21)


```ts
'use client'
import { useBaseQuery } from './useBaseQuery'

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
//useBaseQuery 호출
  return useBaseQuery(
    {
      ...options,
      enabled: true,
      //suspense 가 true로 세팅
      suspense: true,
      throwOnError: defaultThrowOnError,
    },
    InfiniteQueryObserver as typeof QueryObserver,
    queryClient,
  ) as InfiniteQueryObserverSuccessResult<TData, TError>
}

```

useSuspenseInfiniteQuery는 useBaseQuery를 호출하는데요. suspense: true 로 세팅되어있는 것을 볼 수 있습니다. 즉 useSuspenseInfiniteQuery 내부에서 useBaseQuery가 React Suspense 패턴에 맞춰 Promise를 throw 하도록 동작합니다.

이 훅 자체는 use client이지만, Next.js App Router에서는 서버에서 클라이언트 컴포넌트를 한 번 렌더링한 뒤 그 결과를 직렬화해 클라이언트로 보내기 때문에, 서버 렌더링 과정에서 useSuspenseInfiniteQuery가 호출되고 이때 Suspense를 위해 Promise를 throw 하게 됩니다.



2. Promise를 던지는 곳 : [useBaseQuery](https://github.com/TanStack/query/blob/c1142b923b95ea99ca7d81d7f7d58758c10ddd82/packages/react-query/src/useBaseQuery.ts)

그렇담 useBaseQuery 훅으로 들어가보겠습니다. 


```ts
  // Handle suspense
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
  }
```
useBaseQuery 훅 내부에선 shouldSuspend()가 참일 경우 fetchOptimistic()가 반환하는 Promise를 그대로 throw합니다.



3. 언제 suspend 하는지: [shouldSuspend](https://github.com/TanStack/query/blob/c1142b923b95ea99ca7d81d7f7d58758c10ddd82/packages/react-query/src/suspense.ts)


shouldSuspend는 어떤 역할을 하는 함수일까요?

```ts
export const shouldSuspend = (
  defaultedOptions:
    | DefaultedQueryObserverOptions<any, any, any, any, any>
    | undefined,
  result: QueryObserverResult<any, any>,
) => defaultedOptions?.suspense && result.isPending
```

shouldSuspend는 다음과 같이 정의되어있습니다. 

suspense === true이고 **result.isPending === true**이면 suspend 합니다.


여기서 result는 observer.getOptimisticResult(defaultedOptions)로 나온 값입니다 (아래 참고).


4. result가 어디서 오는거야 : [useBaseQuery 안에서](https://github.com/TanStack/query/blob/c1142b923b95ea99ca7d81d7f7d58758c10ddd82/packages/react-query/src/useBaseQuery.ts)



```ts
  // note: this must be called before useSyncExternalStore
  const result = observer.getOptimisticResult(defaultedOptions)
```
Observer는 useSuspenseInfiniteQuery일 때 InfiniteQueryObserver입니다.
InfiniteQueryObserver.getOptimisticResult는 부모 QueryObserver.getOptimisticResult를 그대로 쓰고, createResult에서 status === 'pending'이면 isPending: true가 됩니다.
캐시에 데이터가 없거나 아직 fetch가 끝나지 않았으면 이렇게 pending이 되고, 그때 shouldSuspend가 true가 되어 위의 throw fetchOptimistic(...)가 실행됩니다.



새로 추가된 suspense hook은 로딩과 에러 상태를 Suspense와 ErrorBoundary가 처리하기 때문에 status가 언제나 success인 data 값을 반환합니다. data가 undefined 상태가 되지 않습니다.


5. 던져지는 Promise가 만들어지는 곳: [fetchOptimistic](https://github.com/TanStack/query/blob/c1142b923b95ea99ca7d81d7f7d58758c10ddd82/packages/react-query/src/suspense.ts)

fetchOptimistic 함수를 분석해볼까요?

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



getOptimisticResult가 isPending: true를 주면
shouldSuspend가 true가 되고
throw fetchOptimistic(...)가 실행되어 같은 Promise가 던져집니다.


## 그럼 useQuery는 왜 서버에서 호출안되나요?

조사하다보니 문득 궁금한게 그렇다면 왜 useQuery는 SSR 환경에서 렌더링될 때 호출되지 않을까요?

```tsx
export function useQuery(options: UseQueryOptions, queryClient?: QueryClient) {
  return useBaseQuery(options, QueryObserver, queryClient)
}
```
useQuery는 기본값으로 suspense: false 입니다.

즉, 옵션에 suspense: true를 명시하지 않으면 useBaseQuery가 Promise를 throw 하지 않고, isLoading, error, data 같은 플래그를 통해 상태를 표현합니다.

반대로, useQuery({ ..., suspense: true })로 사용하면, 이때는 useSuspenseInfiniteQuery와 마찬가지로 Promise를 throw 해서 Suspense에 걸리게 됩니다.


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


```tsx
export default async function ReviewQueryHydrator({
  children,
}: ReviewQueryHydratorProps) {
  const queryClient = getQueryClient()

  await queryClient.prefetchInfiniteQuery({
    queryKey: [QUERY_KEY],
    queryFn: () =>
      getReviewsApi(
        //..
      ),
  })

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
}

```

```tsx
    <Suspense fallback={<Loading />}>
      <ReviewQueryHydrator >
        <DetailReview pid={params.id} />
      </ReviewQueryHydrator>
    </Suspense>
```

fallback ui를 노출시키기 위해 3초 settimeout을 줬습니다.

![suspense정상적용](/image/suspense정상적용.gif)


<details>

<summary>참고문헌</summary>

<div markdown="1">

https://velog.io/@junhakjh/useSuspenseQuery-%ED%86%BA%EC%95%84%EB%B3%B4%EA%B8%B01-useSuspenseQuery

https://velog.io/@junhakjh/useSuspenseQuery-%ED%86%BA%EC%95%84%EB%B3%B4%EA%B8%B02-useBaseQuery

https://velog.io/@juhyeon1114/AWS-S3%EC%99%80-Cloudfront%EB%A1%9C-%EC%9B%B9%EC%82%AC%EC%9D%B4%ED%8A%B8-%EB%B0%B0%ED%8F%AC

</div>

</details>
