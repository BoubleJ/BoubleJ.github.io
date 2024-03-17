---
date: "2023-02-17"
title: "[Next.JS] Next.js window 객체 사용법"
categories: ["Next.JS"]
summary: "Next.js에서 제공하는 SSR, 하지만 우리는 SSR에서 사용하지 못하는 객체인 window 객체를 사용할 때가 많습니다. 그럴때 해결하는 방법을 소개합니다."
thumbnail: "./NEXT.png"
---

### Next.js에서 제공하는 SSR, 하지만 우리는 SSR에서 사용하지 못하는 객체인 window 객체를 사용할 때가 많습니다. 그럴때 해결하는 방법을 소개합니다.

## 1. typeof를 사용.

```jsx
if(window){...} 
// window is not definde 에러발생

if(typeof window !== undefined) {...}
// 정의되지않은 window의 타입이기떄문에 undefied가 발생 -> 에러가 발생하지 않습니다.
```

간단하게 이러한 방법으로 window객체가 있는지 체크하는 방법이 있습니다.

## 2. useEffect를 사용.

```jsx
useEffect(()=>{
	// 안에서 window 객체를 사용
},[])
```

useEffect는 DOM형성 후에 실행이 되는 hook입니다. 고로 브라우저가아닌 서버에서 window를 체크를 하지 않는 다는 것이죠. react를 사용하면서 가장 편하게 사용할 수 있는 방법이 아닐까 싶습니다.

## 3. dynamic을 사용

```tsx
import dynamic from 'next/dynamic'

const ComponentsWithNoSSR = dynamic<{props:type;}>( // typescript에서 props를 전달할때 interface를 정의해줍니다.
  () => import('./components/Component'), // Component로 사용할 항목을 import합니다.
  { ssr: false } // ssr옵션을 false로 설정해줍니다.
);

const App = () => {
  return(
    <div>
    	<Components/>
{/*   해당 컴포넌트는 SSR로 불러올 수 있습니다. */}
    	<ComponentsWithNoSSR/> 
{/*   해당 컴포넌트는 ssr:false이기 때문에 서버사이드 렌더를 하지않습니다.  */}
    </div>
  )
};
```

next.js에서 제공하는 dynamic이라는 함수로 ssr옵션을 꺼줄 수 있으며, 이로 인해 window를 사용하는 컴포넌트에서 에러가 나는 것을 막을 수 있습니다.
