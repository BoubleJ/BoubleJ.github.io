---
date: "2026-01-07"
title: "queryOption을 활용한 쿼리키 관리 방법"
categories: ["React", "TanStack-Query", "Query-Key", "QueryOption", "Factory-Pattern"]
summary: "Tanstack-Query의 쿼리 키를 효율적으로 관리하기 위한 인사이트를 공유합니다."
thumbnail: "/thumbnail/리액트쿼리.png"
---

오늘 다뤄볼 주제는 Tanstack-Query의 핵심 개념들 중 하나인 Query Keys를 관리하는 방법입니다.

공식문서에서는 다음과 같이 Query Keys를 소개하고 있습니다.

> At its core, TanStack Query manages query caching for you based on query keys. Query keys have to be an Array at the top level, and can be as simple as an Array with a single string, or as complex as an array of many strings and nested objects. As long as the query key is serializable, and unique to the query's data, you can use it!    https://tanstack.com/query/latest/docs/framework/react/guides/query-keys

Query Keys를 제대로 관리하지 않으면 예상치 못한 문제가 생길 수 있습니다. 프로젝트를 진행하면서 쿼리키를 효율적으로 다루기 위해 꾸준히 고민했고, 그 과정에서 얻은 인사이트를 이번 포스팅에서 공유하고자 합니다.


# 분산되어있는 쿼리 옵션

프로젝트 초기 에는 아래와 같이 쿼리키를 관리했었습니다. 

아마 프로젝트 초기 단계 혹은 가벼운 마음으로 React Query를 도입한 팀에선 아래와 같은 코드 형태가 익숙하실 수 있습니다.

```ts

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, } = useInfiniteQuery({
    queryKey: [REVIEW_LIST_KEY, pid, sort, filter],
    queryFn: ({ pageParam = 1 }) =>
      getReviewsApi({
      //..
      }),
      // 나머지
  })

```

```ts

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, } = useInfiniteQuery({
       // 동일한 데이터인데 쿼리키가 다름!
    queryKey: [DETAIL_REVIEW_LIST_KEY, pid, sort, filter],
    queryFn: ({ pageParam = 1 }) =>
      getReviewsApi({
     //...
      }),
      // 나머지
  })

```



```ts

  await queryClient.prefetchInfiniteQuery({
    queryKey: [DETAIL_REVIEW_LIST_KEY, pid, sort, filter],
    queryFn: ({ pageParam }) =>
      getReviewsApi({
//..
      }),
         // 나머지
  })

```




각 쿼리 호출처마다 queryKey와 queryFn 등 쿼리 옵션이 따로 작성되어있는데요. 

## 문제점

#### 1. 단일 책임 소스(Single Source of Truth) 미준수

같은 리뷰 목록 쿼리인데 `useInfiniteQuery`와 `prefetchInfiniteQuery`에서 `queryKey`·`queryFn`과 같은 쿼리 옵션이 따로 작성되어있어 한쪽만 수정하거나 오타가 나면 캐시 키가 어긋나거나 옵션이 누락될 수 있습니다. 

위 코드처럼 `useInfiniteQuery` 호출 시 같은 데이터를 가져와야 하는데, 호출처마다 queryKey가 달라 의도와 다른 데이터가 렌더링 및 캐싱될 위험이 있습니다.

#### 2. 휴먼에러 위험성

쿼리 옵션이 따로 작성되어 있기 때문에 만약 api 파라미터가 변경될 경우 `useInfiniteQuery`와 `prefetchInfiniteQuery` 둘 다 `queryKey`·`queryFn` 등 옵션을 고쳐야 해서 번거롭고, 그 과정에서 옵션 누락 같은 실수가 나기 쉽습니다.


# 팩토리 패턴 쿼리키 객체 관리

위 문제를 해결하기 위해 팩토리 패턴 쿼리키 객체 관리 방식을 도입해보았습니다.


```ts


// 쿼리티 팩토리 패턴 객체
export const reviewQueryKeys = {
  all: () => [REVIEW_LIST_KEY] as const,
  lists: () => [...reviewQueryKeys.all()] as const,
  list: (params: ReviewListParams) => [...reviewQueryKeys.lists(), params] as const,
};
```

쿼리 키를 상수로 관리하면 아래와 같이 사용할 수 있습니다. 

```ts
const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
  useInfiniteQuery({
    queryKey: reviewQueryKeys.list({ pid, sort, filter }), // 쿼리키 객체 주입
    queryFn: ({ pageParam = 1 }) =>
      getReviewsApi({
      //..
      }),
        staleTime: 1000 * 60,
  });

  // 특정 쿼리 목록만 무효화
queryClient.invalidateQueries({ queryKey: reviewQueryKeys.list({ pid, sort, filter }) });

// 모든 쿼리 목록 무효화
queryClient.invalidateQueries({ queryKey: reviewQueryKeys.lists() });

```

팩토리 패턴으로 쿼리키를 중앙화하면 쿼리키 오타나 불일치를 사전에 방지할 수 있습니다.

 


## 쿼리키 옵션 객체 관리

여기서 좀 더 나아가 쿼리 키를 상수로 관리했듯이 옵션 객체를 상수로 관리하는 방법도 가능합니다. 

```ts
// 쿼리 옵션 관리 객체
export const reviewQueryOptions = {
  list: (params: ReviewListParams) => ({
    queryKey: reviewQueryKeys.list(params),
    queryFn: ({ pageParam  }) =>
      getReviewsApi({
   .//..
      }),
    // staleTime, getNextPageParam  등 공통 옵션도 여기서 관리
    staleTime: 1000 * 60,
   getNextPageParam: (lastPage, _, lastPageParam) => {
     //...
      },
   initialPageParam: 1,
  }),
};

```

```ts

const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
  useInfiniteQuery({
    ...reviewQueryOptions.list({ pid, sort, filter }),
    // 쿼리 옵션이 모두 포함되어 있기에 별도로 추가해줄 필요가 없음
  });


```

이렇게 쿼리 옵션을 포함한 객체로 중앙화하면 쿼리 속성을 각 사용처에서 쿼리옵션을 반복 작성할 필요없고 옵션을 동일하게 가져가는 효과가 있습니다. 




## 문제점

하지만 이러한 방법도 문제점이 있는데요. 

단순 쿼리키 객체로 관리되기 떄문에 타입스크립트 구조적 타입 시스템으로 인해 객체로 분리된 옵션에서 오타나 잘못된 프로퍼티 사용 시 타입 에러가 발생하지 않는 문제가 있습니다.

```ts

export const reviewQueryOptions = {
  list: (params: ReviewListParams) => ({
    queryKey: reviewQueryKeys.list(params),
    queryFn: ({ pageParam  }) =>
      getReviewsApi({
   .//..
      }),
    // // staleTime의 오타
    stallTime: 1000 * 60,
   getNextPageParam: (lastPage, _, lastPageParam) => {
     //...
      },
  }),
};

const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
  useInfiniteQuery({
    ...reviewQueryOptions.list({ pid, sort, filter }),
  // type error가 발생하지 않음
  });

```

# queryOptions(infiniteQueryOptions)을 활용한 타입추론


TanStack React Query v5에서는 위 문제를 해결하기 위한 queryOptions(infiniteQueryOptions)가 새롭게 도입되었는데요. 런타임에서는 사실상 단순 identity 함수 역할을 하지만, 타입 레벨에서는 queryClient의 여러 부분들을 타입 안전하게 만들 수 있도록 도와주며, queryKey와 queryFn 등을 밀접하게 태깅해 정확한 타입 추론을 지원해 줍니다.



```ts
export const reviewQueryOptions = {
  all: () => [REVIEW_LIST_KEY] as const,
  lists: () => [...reviewQueryOptions.all()] as const,
  infiniteList: ({  pid, sort, filter }: DetailReviewListParams) =>
    infiniteQueryOptions({
      // 쿼리 옵션 작성 시 오타나면 type error가 발생
      queryKey: [...reviewQueryOptions.lists(), pid,  sort, filter] as const,
      queryFn: ({ pageParam }) =>
        getReviewApi({
          //..
        }),
      getNextPageParam: (lastPage, _, lastPageParam) => {
        //..
      },
      
 staleTime: 1000 * 60,
    }),
} as const

```

```ts

// 클라이언트 쿼리 호출
const { data, fetchNextPage, hasNextPage } =
useInfiniteQuery(reviewQueryOptions.infiniteList({ pid, sort, filter }));

// prefetch 쿼리
await queryClient.prefetchInfiniteQuery(reviewQueryOptions.infiniteList({ pid, sort, filter }));

  // 특정 조건의 쿼리만 무효화
queryClient.invalidateQueries({
  queryKey: reviewQueryOptions.infiniteList({ pid, sort, filter }).queryKey,
});

// 모든 쿼리 목록 무효화 
queryClient.invalidateQueries({
  queryKey: reviewQueryOptions.lists(),
});

```
queryOptions(infiniteQueryOptions) 을 사용해 쿼리 객체를 관리하면 다음과 같은 이점을 누릴 수 있습니다.

#### 1. 쿼리 팩토리(Query factory) 전환

기존의 쿼리 키만 관리하는 팩토리에서 한 단계 더 발전하여, 키와 관련된 쿼리 함수, 추가 옵션을 모두 결합하여 관리하는 쿼리 팩토리(Query factory) 로 전환할 수 있습니다. 쿼리 키와 쿼리 함수는 본질적으로 밀접하게 연결되어 있으므로, 함께 관리하는 것이 논리적입니다.



#### 2. 자동 타입 추론 및 타입 오류의 즉각적인 감지
queryOptions를 사용하면 쿼리 키가 해당 쿼리 함수와 “동일 객체” 임을 타입스크립트가 인식합니다. 때문에 오탈자 방지는 물론 getQueryData, setQueryData를 사용할 때도 쿼리 함수의 반환 타입에 맞춰 자동으로 정확한 타입 추론이 이뤄집니다.


#### 3. 일관된 재사용

하나의 객체로 쿼리 키, 함수, 옵션을 묶어 React Query의 API 전반에서 일관되게 사용할 수 있습니다. 이를 통해 모든 옵션을 한곳에서 관리하며 타입 안전성과 코드의 명확성을 높일 수 있습니다. 또한 관련된 쿼리 로직이 한 곳에 모여 있어 코드의 가독성과 유지보수성이 향상됩니다.

#### 4. 패칭과 프리패칭 간 옵션 공유

동일한 쿼리에 대한 일반 패칭과 프리패칭 사이에 모든 옵션을 일관되게 유지할 수 있어 코드 중복과 불일치를 방지합니다. 





# 마무리


이번 글에서는 `queryOptions`(및 `infiniteQueryOptions`)를 활용해 Query Key뿐만 아니라 쿼리 옵션까지 효율적으로 관리하는 방법을 공유했습니다.

쿼리 키 관리 문제는 사소해 보이지만, 프로젝트가 커질수록 기술 부채로 커질 수 있습니다. 이를 방지하고자 `queryOptions`(및 `infiniteQueryOptions`)와 팩토리 패턴을 함께 도입하면서 타입 안전성을 확보하고, 유지보수성을 크게 높일 수 있었습니다.

추가로 TanStack Query의 `useMutation`은 [`setMutationDefaults`](https://tanstack.com/query/latest/docs/framework/react/guides/mutations#persist-mutations)를 활용해 비슷하게 관리할 수 있습니다. 해당 방법도 추후 정리해 공유할 예정입니다. 

