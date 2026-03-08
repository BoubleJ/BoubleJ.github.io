---
date: "2026-03-01"
title: "Next.js에서 nginx 배포 시 suspense 적용되지 않는 이슈 대응 (작성중)"
categories: ["React"]
summary: "쿼리 팩토리 패턴 구현."
thumbnail: "/thumbnail/vpc.png"
---

suspense를 적용해보았는데요

https://monognuisy.vercel.app/frontend/next-suspense-not-working

https://pungwa.tistory.com/225

```js
async headers() {
    return [
      // 나머지 속성
      {
        source: '/:path*{/}?',
        headers: [{ key: 'X-Accel-Buffering', value: 'no' }],
      },
    ]
  },

```

<details>

<summary>참고문헌</summary>

<div markdown="1">

https://velog.io/@juhyeon1114/AWS-S3%EC%99%80-Cloudfront%EB%A1%9C-%EC%9B%B9%EC%82%AC%EC%9D%B4%ED%8A%B8-%EB%B0%B0%ED%8F%AC

</div>

</details>




