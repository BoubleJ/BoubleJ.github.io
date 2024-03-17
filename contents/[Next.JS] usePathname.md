---
date: "2023-03-12"
title: "[Next.JS] usePathname"
categories: ["Next.JS"]
summary: "usePathname은 현재 URL의 경로 이름을 읽을 수 있는 클라이언트 구성 요소 hook입니다."
thumbnail: "./NEXT.png"
---

usePathname은 현재 URL의 경로 이름을 읽을 수 있는 클라이언트 구성 요소 hook입니다.

```jsx
'use client'
 
import { usePathname } from 'next/navigation'
 
export default function ExampleClientComponent() {
  const pathname = usePathname()
//현재 url 경로 이름을 pathname이라는 변수에 할당(저장)
  return <p>Current pathname: {pathname}</p>
}
// Current pathname : /현재주소~/어쩌구~
```