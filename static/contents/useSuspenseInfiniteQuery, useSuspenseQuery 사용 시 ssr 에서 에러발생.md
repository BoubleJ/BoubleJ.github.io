---
date: "2025-12-24"
title: "useSuspenseInfiniteQuery, useSuspenseQuery 사용 시 ssr 에서 에러발생"
categories: ["React"]
summary: "쿼리 팩토리 패턴 구현."
thumbnail: "/thumbnail/vpc.png"
---

- tanstack query 내부코드를 보면 useBaseQuery 가 있는데
- **useInfiniteQuery (suspense: false) → shouldSuspend 값이 false → promise throw 안함**
- **useSuspenseInfiniteQuery (suspense: true) → shouldSuspend 값이 true → 서버에서 fetch 시도 → Promise를 throw 즉 서버에서 호출했기 때문에 에러발생**
- 서버 prefetch로 대응

<details>

<summary>참고문헌</summary>

<div markdown="1">

https://velog.io/@juhyeon1114/AWS-S3%EC%99%80-Cloudfront%EB%A1%9C-%EC%9B%B9%EC%82%AC%EC%9D%B4%ED%8A%B8-%EB%B0%B0%ED%8F%AC

</div>

</details>
