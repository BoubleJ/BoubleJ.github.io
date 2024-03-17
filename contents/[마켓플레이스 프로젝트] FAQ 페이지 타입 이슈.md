---
date: "2023-01-13"
title: "[마켓플레이스 프로젝트] FAQ 페이지 타입 이슈"
categories:
  ["MarketPlace", "Project", "Next.js", "Typescript", "TroubleShooting"]
summary: "slug를 전달하던 곳 대신 가져온 url params를  props를 통해 전달해주도록하면 수정 끝!!"
thumbnail: "./typescript.png"
---


```jsx
import React from 'react'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Body, List, ListProps } from '@/types/faq'

export default function FAQItemList({ list, slug }: { list: List; slug: string }) {
  const result = list.find((item: ListProps) => item.title == slug)
  const body = result?.body

  return (
    <>
      **{body.map**((item: Body) => {
//'body' is possibly 'undefined'. 라는 타입 에러가 떳다, 
        return (
          <Accordion type="single" collapsible className="w-full" key={item.Id}>
            <AccordionItem value="item-1">
              <AccordionTrigger className=" text-body-base">
                <div>
                  <span className="py-1 px-2  bg-brand-primary-500 rounded-3xl text-body-base text-white">Q</span>
                  <span className="pl-3">{item.Question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-body-base">
                <div className="pl-10">{item.Answer}</div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )
      })}
    </>
  )
}

```

body값이 존재 하지 않을 수도 있다는 뜻이므로 자바스크립트 문법인 옵셔널 체이닝 연산자를 사용해야한다. 

타 컴포넌트 result도 마찬가지로 적용해줬다. 

```jsx
**{body?.map**((item: Body) => {
```

해결!!

body 배열 타입 미지정 이슈

```jsx
import React from 'react'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Body, List, ListProps } from '@/types/faq'

export default function FAQItemList({ list, slug }: { list: List; slug: string }) {
  const result = list.find((item: ListProps) => item.title == slug)
  **const body = result?.body
//Property 'body' does not exist on type 'ListProps'.
//다음과 같은 타입 에러가 떴다.** 

  return (
    <>
      {body?.map((item: Body) => {
        return (
          <Accordion type="single" collapsible className="w-full" key={item.Id}>
            <AccordionItem value="item-1">
              <AccordionTrigger className=" text-body-base">
                <div>
                  <span className="py-1 px-2  bg-brand-primary-500 rounded-3xl text-body-base text-white">Q</span>
                  <span className="pl-3">{item.Question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-body-base">
                <div className="pl-10">{item.Answer}</div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )
      })}
    </>
  )
}

```

```jsx

{/* 타입지정   */}

export type List = Array<ListProps>

export interface ListProps extends Body {
  title: string
  filterTitle: string
}

export interface Body {
  Id: number
  Question: string
  Answer: string[]
}

```

주어진 코드를 보면 ListProps는 Body를 확장하고 있으며, List는 ListProps의 배열로 정의되어 있습니다. 따라서 ListProps에는 Body의 속성(Id, Question, Answer)을 포함하고 있습니다.

그러나 주어진 구조에서 ListProps에는 body 속성이 정의되어 있지 않습니다. 따라서 result?.body에 접근하면 "Property 'body' does not exist on type 'ListProps'"와 같은 오류가 발생합니다.

해결 방법은 ListProps에도 body 속성을 추가하여야 합니다. 그러나 Body 인터페이스와 중복되므로, ListProps에 body 속성을 추가하는 대신 ListProps 타입을 다시 정의하여 Body와 title, filterTitle 속성만 포함하도록 할 수 있습니다.

라고 한다

```jsx
export interface ListProps extends Body {
  title: string
  filterTitle: string
  body: Body[]
}

//다음과 같이 body에 배열 타입을 주면 된다.
```