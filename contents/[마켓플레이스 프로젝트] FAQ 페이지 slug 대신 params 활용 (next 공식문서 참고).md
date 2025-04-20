---
date: "2023-01-10"
title: "[마켓플레이스 프로젝트] FAQ 페이지 slug 대신 params 활용 (next 공식문서 참고)"
categories: ["MarketPlace"]
summary: "slug를 전달하던 곳 대신 가져온 url params를  props를 통해 전달해주도록하면 수정 끝!!"
thumbnail: "./useparams.png"
---

```jsx
export default function page(props: Props) {
  const slug = props.params.FAQId
  const params = useParams<{ tag: string; item: string }>()
//이렇게 slug를 가져와도 정상적으로 url params를 가져올 수 있지만

  return (
    <div className="h-full w-full p-4">
      <div className=" text-title-lg">
        <FAQPage FAQId={FAQId} />
      </div>
    </div>
  )
}

```

next 공식문서에서 권장하는 방법을 써야겠죠??

```jsx

import { useParams } from 'next/navigation'

export default function page() {
  const params = useParams<{ tag: string; item: string }>()
//useParams 훅을 사용해 params를 불러와 객체로 저장한 후

 console.log(params)
//{FAQId: 'member'}

  const { FAQId } = params

//구조분해 할당으로 FAQId를 꺼내온다.

  console.log(FAQId)
//member

  return (
    <div className="h-full w-full p-4">
      <div className=" text-title-lg">
        <FAQPage FAQId={FAQId} />
      </div>
    </div>
  )
}
```

slug를 전달하던 곳 대신 가져온 url params를 props를 통해 전달해주도록하면 수정 끝!!

참고로 FAQId인 이유는 내가 폴더 구조를 [FAQId] 로 설정했기 때문!!

마무리로 타입지정까지 해결해줬다.

```jsx

export default function page() {
  const params = useParams<{ tag: string; item: string }>()
  const { FAQId } = params
//Property 'FAQId' does not exist on type '{ tag: string; item: string; }'
// '{ tag: string; item: string; }' 타입에는 'FAQId' 속성이 존재하지 않는다는 뜻

  console.log(FAQId)

  return (
    <div className="h-full w-full p-4">
      <div className=" text-title-lg">
        <FAQPage FAQId={FAQId} />
      </div>
    </div>
  )

```

`const params = useParams<{ tag: string; item: string }>()`

타입 지정을

`const params = useParams<{ FAQId: string, tag: string; item: string }>()`

다음과 같이 수정해줬다.
