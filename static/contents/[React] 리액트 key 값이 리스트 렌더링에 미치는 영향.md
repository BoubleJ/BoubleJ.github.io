---
date: "2025-07-28"
title: "[React] 리액트 key 값이 리스트 렌더링에 미치는 영향"
categories: ["React"]
summary: "Hydration Failed 에러와 suppressHydrationWarning를 알아봅시다."
thumbnail: "/image/리액트key.png"
---

# 발단

사내 프로젝트 진행 중 신기한 현상을 발견했습니다.

```ts

// 사내 코드는 공개할 수 없어, 예시 코드로 구현했습니다.

import { getItems } from "../lib/items";
import Buttons from "../components/Buttons";

export default async function Dashboard() {
  const items = await getItems();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-50 p-8 font-sans dark:bg-zinc-950">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        항목 버튼
      </h1>
      <Buttons items={items} />
    </div>
  );
}

```

```ts

// 사내 코드는 공개할 수 없어, 예시 코드로 구현했습니다.

"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Item {
  label: string;
  id: number;
}
export default function Buttons({ items }: { items: Item[] }) {
  const router = useRouter();
  const handleClick = (item: string) => {
    router.replace(`/dashboard?keywordId=${item}`);
  };

  const search = useSearchParams();
  const keywordId = search.get("keywordId");

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {items.map((item) => {
        return (
          <button
            key={`${keywordId}`}
            type="button"
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            aria-label={`${item.label} 버튼`}
            onClick={() => handleClick(item.label)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

```

버튼 클릭 시 해당 태그를 쿼리스트링에 붙이는 로직을 구현했는데 버튼을 클릭할 때마다 버튼 리스트가 화면에 **추가로** 노출되는 이슈가 발생했습니다.

![버튼 클릭 시 리스트가 중복 노출되는 현상](/image/버튼리스트추가노출.gif)

<br>
<br>
<br>

# 원인

원인을 살펴보니 **리액트 컴포넌트 반복문 내 key 값이 모두 동일했던 것**이 원인이었습니다.

```ts

  const search = useSearchParams();
  const keywordId = search.get("keywordId");


   <button
   //이녀석이 원인
            key={`${keywordId}`}
            type="button"

```

다만 궁금한 점이 생겼습니다. 리액트 key 값은 중복으로 사용하면 안 된다는 것은 알고 있었지만, 그래서 **왜 중복으로 사용하면 안되는지**와, 지금과 같은 현상이 나타난 **정확한 이유**가 궁금했습니다.  
그래서 리액트에서 key 값이 어떻게 쓰이고 있는지 조사해 보았습니다.

<br>
<br>
<br>

# 원인 분석

## 리액트는 어떻게 동작하는가

key가 어떤 역할을 하는지 이해하려면, 리액트가 화면을 어떻게 그리는지부터 알아야 합니다.

### 가상 DOM(Virtual DOM)

리액트는 렌더링할 때 메모리 위의 **가상 DOM**을 사용합니다. 데이터가 바뀌면 바로 실제 DOM을 수정하는 것이 아니라, 가상 DOM에서 먼저 변경 사항을 반영한 뒤, 그 결과를 실제 DOM에 적용합니다.

실제 DOM을 직접 자주 건드리면 브라우저의 리플로우·리페인트가 반복되어 비용이 큽니다. 그래서 가상 DOM으로 “어디가 바뀌었는지” 먼저 계산하고, **정말 바뀐 부분만** 실제 DOM에 반영하는 방식입니다. 이 과정을 리액트에서는 **재조정(Reconciliation)**이라고 부릅니다.

### 재조정(Reconciliation)

재조정 시 리액트는 **current**(현재 가상 DOM)와 **workInProgress**(변경을 반영한 가상 DOM) 두 트리를 비교합니다. workInProgress에 변경 사항이 모두 반영되면, 두 트리를 비교해 **실제 DOM에 반영할 부분만** 골라 내고, 그 부분만 업데이트합니다.  
그래서 “변경된 곳”만 다시 렌더링하고, 나머지는 재사용합니다.

<br>
<br>
<br>

## key는 어떤 역할을 하는가

### 재조정 과정에서의 key

가상 DOM 트리를 비교할 때, “이전 자식 목록”과 “새 자식 목록”을 어떻게 짝 지을지가 중요합니다. 리액트는 여기서 **key**를 사용합니다.

- **key가 같으면** → “이전과 같은 아이템”으로 보고, 해당 인스턴스를 **재사용**합니다.
- **key가 바뀌면** → “새 아이템”으로 보고, **다시 연산·렌더링**합니다.

즉, key는 “이 리스트 아이템을 다시 만들지 말고, 기존 것을 재사용할지”를 리액트에게 알려 주는 **식별자**입니다.  
key는 컴포넌트에 props로 전달되지 않고, 리액트 내부에서만 사용됩니다.

### key를 제대로 쓰지 않으면

- **key에 배열 index를 쓰는 경우**  
  배열 앞이나 중간에 항목이 추가·삭제·정렬되면 index가 달라집니다. 그러면 “같은 항목”인데도 key가 바뀐 것으로 인식되어, 불필요하게 많은 컴포넌트가 다시 렌더링됩니다.  
  “이동만 하면 되는” 경우에도 전체를 새로 그리게 되어 성능이 나빠집니다.

- **key에 매번 새로 만든 값(예: 랜덤 값)을 쓰는 경우**  
  렌더할 때마다 key가 바뀌므로, 리액트는 매번 “완전히 새로운 목록”으로 인식합니다. 그 결과 매 렌더마다 모든 아이템을 새로 만들게 되어 매우 비효율적입니다.

- **key를 아예 안 주는 경우**  
  리액트는 key가 없으면 내부적으로 **index를 key처럼 사용**합니다. 그래서 “key를 생략한 map”은 사실상 index를 key로 쓰는 것과 같은 효과입니다.

<br>
<br>
<br>

## 그럼 왜 버튼 리스트가 “추가로” 노출되었는가

제 코드에서는 `map`으로 그리는 **모든 버튼에 동일한 key**를 넣고 있었습니다.

```tsx
{items.map((item) => {
  return (
    <button
      key={`${keywordId}`}  // ← 모든 버튼이 같은 key
      ...
    >
      {item.label}
    </button>
  );
})}
```

`keywordId`는 URL 쿼리스트링에서 가져온 하나의 값이므로, **버튼이 10개든 20개든 전부 같은 key**를 갖게 됩니다.

리액트는 “형제 리스트 아이템”끼리 key로 “누가 누구인지” 구분합니다. 그런데 여러 개의 형제가 **같은 key**를 가지면, 리액트는 “어떤 노드가 기존 것인지, 어떤 것이 새로 추가된 것인지”를 제대로 구분하지 못합니다.  
그 결과 재조정 과정에서 기대와 다르게 “기존 목록은 유지한 채, 새 목록이 추가된 것처럼” DOM이 그려질 수 있고, 사용자 입장에서는 “버튼 리스트가 클릭할 때마다 한 줄씩 더 쌓인다”는 현상으로 보이게 됩니다.

즉, **key가 모두 동일했기 때문에** 리액트가 리스트 아이템을 올바르게 짝 지어 재사용·갱신하지 못하고, DOM이 중복되어 보이는 형태로 렌더링된 것입니다.

<br>
<br>
<br>

### 그런데 key를 상수로 넣으면 왜 쌓이지 않을까?

원인은 파악했는데, 한 가지 더 궁금한 점이 생겼습니다.

key를 아래처럼 상수로 두었을 때는 버튼 리스트가 계속 추가되는 현상이 없었습니다. 리액트에서 “key가 동일하다”는 경고만 동일하게 노출되더군요.

```ts
  key={'1234'}
```

`key={keywordId}`와 `key={'1234'}` 둘 다 “모든 버튼에 같은 key”를 준다는 점에서는 같습니다. 그런데 전자만 리스트가 쌓이고, 후자(상수)는 쌓이지 않았습니다. 왜 그럴까요?

차이는 **key가 렌더마다 바뀌는지, 항상 같은지**에 있습니다.

- **`key={keywordId}`**  
  버튼을 클릭할 때마다 URL 쿼리스트링이 바뀌므로 `keywordId`도 바뀝니다. 재조정 시점에 리액트가 보는 것은 다음과 같습니다.
  - **이전 트리**: 자식 9개, 전부 key=`'홈'` (이전 keywordId)
  - **새 트리**: 자식 9개, 전부 key=`'설정'` (클릭 후 keywordId)  
    리액트는 “key가 다르면 다른 엘리먼트”로 봅니다. 그래서 key=`'홈'`인 리스트와 key=`'설정'`인 리스트를 **서로 다른 목록**으로 인식하고, 기존 목록은 그대로 두고 새 목록을 **추가**하는 식으로 동작할 수 있습니다. 그 결과 화면에는 리스트가 한 줄씩 더 쌓여 보이게 됩니다.

- **`key={'1234'}`**  
  key 값이 항상 `'1234'`로 **고정**되어 있습니다.
  - **이전 트리**: 자식 9개, 전부 key=`'1234'`
  - **새 트리**: 자식 9개, 전부 key=`'1234'`  
    리액트 입장에서는 “같은 key, 같은 개수”이므로 기존 리스트를 새 리스트로 **교체**하는 쪽으로 동작합니다. 새 목록을 **추가**할 이유가 없어서, 리스트가 중복해서 쌓이는 현상은 발생하지 않습니다.

즉, **동일한 key를 여러 개 쓰는 것**만으로는 “리스트가 쌓이는” 현상이 나오지 않고, **클릭할 때마다 key 값이 바뀌는 것**(`keywordId`)이 “이전 목록 + 새 목록”처럼 보이게 만든 것입니다.  
상수 key는 매번 같은 값이라 “같은 목록의 갱신”으로 처리되고, 변하는 key는 “다른 목록”으로 인식되어 목록이 추가되는 것처럼 보이는 것입니다.  
다만 `key={'1234'}`처럼 상수를 쓰면 리스트가 쌓이지 않을 뿐, 여전히 “어떤 버튼이 어떤 항목인지” 구분이 되지 않아 올바른 재조정이 아닌 것은 마찬가지입니다.

<br>
<br>
<br>

## 정리

- 리액트는 **key**를 이용해 리스트의 각 항목을 식별하고, 재조정 시 “같은 항목은 재사용, 바뀐 항목만 갱신”하도록 동작합니다.
- key가 **중복**이면 형제 노드들을 구분할 수 없어, 재조정 결과가 꼬이고 우리가 겪은 것처럼 “리스트가 추가로 노출되는” 듯한 버그가 발생할 수 있습니다.

<br>
<br>
<br>

<details>

<summary>참고문헌</summary>

<div markdown="1">

https://yozm.wishket.com/magazine/detail/2634/

</div>

</details>
