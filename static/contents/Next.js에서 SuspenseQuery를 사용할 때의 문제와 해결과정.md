---
date: "2026-01-10"
title: "Next.js에서 SuspenseQuery를 사용할 때의 문제와 해결과정"
categories: ["React", "TanStack-Query", "Next.js"]
summary: "Next.js + SuspenseQuery 사용 시 서버, 클라이언트 모두 api 호출되는 이슈 해결 과정을 공유합니다."
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

## SSR 환경 API 요청

위와 같이 적용했을 때 한 가지 문제점이 있는데요. SSR 환경에서도 useSuspenseInfiniteQuery 훅이 호출된다는 점입니다. (useInfiniteQuery도 마찬가지)

이 때문에 Next.js 서버 환경과 브라우저 환경에서 API 요청·헤더 접근 방식이 다르면(EX. 서버에서는 cookies(), 클라이언트에서는 브라우저 API 사용 등) 그 차이로 인해 에러가 발생할 수 있습니다.

그렇다면 왜 Next.js 서버 환경에서 API 호출이 일어났을까요? 이 원인을 파악하기 위해 TanStack Query의 소스 코드를 직접 까봤습니다.


### 1. 진입점 : [useSuspenseQuery.ts](https://github.com/TanStack/query/blob/c1142b923b95ea99ca7d81d7f7d58758c10ddd82/packages/react-query/src/useSuspenseQuery.ts#L17-L21)


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

useSuspenseInfiniteQuery는 useBaseQuery를 호출하는데요. suspense: true 로 세팅되어있는 것을 볼 수 있습니다. 즉 useSuspenseInfiniteQuery 내부에서 useBaseQuery가 Promise를 throw 하도록 동작합니다.

이 훅 자체는 use client이지만, Next.js App Router에서는 서버에서 클라이언트 컴포넌트를 한 번 렌더링한 뒤 그 결과를 직렬화해 클라이언트로 보내기 때문에, 서버 렌더링 과정에서 useSuspenseInfiniteQuery가 호출되고 이때 Suspense를 위해 Promise를 throw 하게 됩니다.



### 2. Promise를 던지는 곳 : [useBaseQuery.ts](https://github.com/TanStack/query/blob/c1142b923b95ea99ca7d81d7f7d58758c10ddd82/packages/react-query/src/useBaseQuery.ts)

useBaseQuery 훅으로 들어가보겠습니다. 


```ts
  // Handle suspense
  if (shouldSuspend(defaultedOptions, result)) {
    throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
  }
```
useBaseQuery 훅 내부에선 shouldSuspend()가 참일 경우 fetchOptimistic()가 반환하는 Promise를 그대로 throw합니다.



### 3. shouldSuspend 함수는 언제 true를 반환해? : [suspense.ts](https://github.com/TanStack/query/blob/c1142b923b95ea99ca7d81d7f7d58758c10ddd82/packages/react-query/src/suspense.ts)


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

suspense === true 인건 위에서 확인했으니 언제  'result.isPending === true' 인지 찾으면 useBaseQuery 훅이 어떻게 promise를 throw하는지 알 수 있겠군요. 


### 4. result 출처 : [useBaseQuery.ts](https://github.com/TanStack/query/blob/c1142b923b95ea99ca7d81d7f7d58758c10ddd82/packages/react-query/src/useBaseQuery.ts)


```ts

 const [observer] = React.useState(
    () =>
      new Observer<TQueryFnData, TError, TData, TQueryData, TQueryKey>(
        client,
        defaultedOptions,
      ),
  )

  // note: this must be called before useSyncExternalStore
  const result = observer.getOptimisticResult(defaultedOptions)
```

observer.getOptimisticResult라는 함수가 result를 반환하는군요.

### 5. getOptimisticResult는 뭔데? [queryObserver.ts](https://github.com/TanStack/query/blob/main/packages/query-core/src/queryObserver.ts)

```ts
getOptimisticResult(
  options: DefaultedQueryObserverOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey
  >,
): QueryObserverResult {
  const query = this.#client.getQueryCache().build(this.#client, options)
  const result = this.createResult(query, options)
  if (shouldAssignObserverCurrentProperties(this, result)) {
    // ... 
    this.#currentResult = result
    this.#currentResultOptions = this.options
    this.#currentResultState = this.#currentQuery.state
  }
  return result
}
```

getOptimisticResult는 캐시에서 options로 Query를 build하고 그 Query와 options로 createResult 함수를 호출해 결과 객체를 만든 뒤 그 결과를 그대로 반환하는 역할을 합니다.

그리고 createResult 함수 로직은 아래와 같습니다.

```ts
let { error, errorUpdatedAt, status } = newState
// ...
const isFetching = newState.fetchStatus === 'fetching'
const isPending = status === 'pending'   // ← 여기
const isError = status === 'error'
// ...
const result: QueryObserverBaseResult = {
  status,
  fetchStatus: newState.fetchStatus,
  isPending,   // ← result에 들어감
  isSuccess: status === 'success',
  isError,
  // ...
}
```

캐시에 데이터가 없거나 아직 fetch가 끝나지 않았으면 query.state에서 status가 'pending'으로 넘어오는데, 이때 isPending이 true가 되고, 이 값이 반환되는 result 객체에 들어갑니다.

즉 createResult에서 status === 'pending'이면 isPending: true가 되고 상단 result.isPending === true 가 true가 됩니다. 


### 6. Promise를 만드는 fetchOptimistic: [suspense.ts](https://github.com/TanStack/query/blob/c1142b923b95ea99ca7d81d7f7d58758c10ddd82/packages/react-query/src/suspense.ts)

이제 fetchOptimistic 함수를 분석해볼까요?

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

[queryObserver.ts](https://github.com/TanStack/query/blob/c1142b923b95ea99ca7d81d7f7d58758c10ddd82/packages/query-core/src/queryObserver.ts)


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

fetchOptimistic은 캐시에 쿼리를 build하고 query.fetch()를 호출한 뒤, 그 Promise를 createResult로 이어서 반환합니다. 그리고 이 함수는 상술했듯이 throw fetchOptimistic 로 promise를 throw 합니다.


## 정리

정리하면 다음과 같습니다. 

1. getOptimisticResult가 isPending: true를 주면
2. shouldSuspend가 true가 되고
3. throw fetchOptimistic(...)가 실행되어 같은 Promise가 던져집니다.



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



# 해결방법

promise를 던지는 원인을 알았으니 해결해야겠지요. 

이러한 문제를 해결하기 위해 [리액트 쿼리 공식문서](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)는 서버 컴포넌트에서 Prefetch를 통해 초기 데이터 넘겨주기 방식을 권장합니다.


서버 컴포넌트에서 query client를 통해 데이터를 prefetch하고, Hydration Boundary를 사용하여 query client를 직렬화(dehydrate)하여 서버 → 클라이언트로 query client 객체를 내려줍니다.

서버 컴포넌트에서 query client를 통해 데이터를 prefetch하기 때문에 SSR 환경에선 useSuspenseInfiniteQuery 훅이 호출되지 않고 클라이언트에선 추가적인 네트워크 요청을 하지 않고 캐싱된 데이터를 활용해 렌더링할 수 있습니다.

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

설령 prefetch가 실패하더라도 클라이언트 환경에서 useSuspenseInfiniteQuery 훅이 호출되기 때문에 문제없이 데이터를 렌더링 할 수 있습니다.


## 이점

위와 같은 패턴은 다음과 같은 이점을 가집니다.

1. SuspenseQuery 훅 서버, 클라이언트 환경 모두 호출되는 문제 해결
2. prefetch + HydrationBoundary를 활용한 클라이언트 데이터 즉시 렌더링 가능 -> 초기 로딩 속도 개선 및 불필요한 네트워크 요청 감소
3. 데이터 즉시 렌더링을 통한 사용자 경험 증대