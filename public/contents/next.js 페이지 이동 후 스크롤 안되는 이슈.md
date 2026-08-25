---
date: "2025-03-05"
title: "Next.js 페이지 이동 후 스크롤이 맨 위로 가지 않는 이슈"
categories: ["Next.js"]
summary: "레이아웃에 상단 여백을 둔 Next.js 앱에서, 페이지 이동 시 스크롤이 초기화되지 않는 현상의 원인과 대응을 정리했습니다."
thumbnail: "/thumbnail/NEXT.png"
---

# 개요

next.js 기반 프로젝트 작업 중 페이지 이동 시 스크롤이 최상단으로 가지 않고 유지되는 이슈를 발견했습니다.

정확한 원인 파악을 위해 Next.js 소스코드를 분석했고, 그 과정에서 확인한 내용을 공유하고자 합니다.

# 이슈 재현

재현코드는 아래와 같습니다.

```tsx
// Layout.tsx (일부)
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 pt-128">
      <header className="... fixed w-full z-10 top-0">...</header>
      <main className="...">
        <div className="...">{children}</div>
      </main>
    </div>
  );
}
```

재현 방법은 레이아웃 상단 여백(`pt-128` 영역)보다 **적게** 스크롤한 상태에서 GNB 탭(Home / About / Dashboard) 등으로 다른 페이지로 이동하면 페이지는 정상적으로 라우팅되지만 **스크롤 위치는 그대로** 유지됩니다.

![스크롤초기화안됨](/image/스크롤초기화안됨.gif)

# 이슈 미재현

 

하지만 다음과 같은 조건일 경우 스크롤 이슈가 발생하지 않습니다. 즉 페이지 이동 시 정상적으로 스크롤이 최상단으로 이동합니다.

1. 스크롤을 이동하지 않은 채 페이지 이동
2. 스크롤을 128px 이상 내린 후 페이지 이동

![스크롤초기화됨](/image/스크롤초기화됨.gif)




 
 

해당 이슈를 확인하고, 상술한 128px 구간 어딘가에서 스크롤이 고정되는 문제가 발생한다고 판단해 원인 분석을 시작했습니다. 그 결과, 다음과 같은 원인을 찾아냈습니다.

 
 

# 원인
[next 내부 코드](https://github.com/vercel/next.js/blob/87fb29ee7143c1e9a4c129585f9546c3f5e0b2b8/packages/next/src/client/components/layout-router.tsx#L151)를 까보면 아래와 같은 로직이 존재합니다.

```ts
function topOfElementInViewport(element: HTMLElement, viewportHeight: number) {
  const rect = element.getBoundingClientRect()
  return rect.top >= 0 && rect.top <= viewportHeight
}

// ....


  // If the element's top edge is already in the viewport, exit early.
          if (topOfElementInViewport(domNode as HTMLElement, viewportHeight)) {
            return
          }

          // Otherwise, try scrolling go the top of the document to be backward compatible with pages
          // scrollIntoView() called on `<html/>` element scrolls horizontally on chrome and firefox (that shouldn't happen)
          // We could use it to scroll horizontally following RTL but that also seems to be broken - it will always scroll left
          // scrollLeft = 0 also seems to ignore RTL and manually checking for RTL is too much hassle so we will scroll just vertically
          htmlElement.scrollTop = 0

          // Scroll to domNode if domNode is not in viewport when scrolled to top of document
          if (!topOfElementInViewport(domNode as HTMLElement, viewportHeight)) {
            // Scroll into view doesn't scroll horizontally by default when not needed
            ;(domNode as HTMLElement).scrollIntoView()
          }
```

topOfElementInViewport 함수는 엘리먼트와 viewportHeight 를 인자로 받습니다

인자로 받은 요소와 viewport 거리를 계산해서 rect.top 값이 양수 or 0이면 next는 해당 요소가 아직 viewport내 존재한다 판단해 페이지 이동 시 스크롤을 유지합니다. (불필요한 스크롤 방지를 위한 최적화)

rect.top 값이 0보다 작으면 해당 요소가 viewport를 벗어났다 판단해 페이지 이동 시 스크롤 이벤트가 발생합니다.

이때 topOfElementInViewport 함수가 넘겨받는 엘리먼트 인자는 layout 영역이 아닌 page 컨텐츠 영역 최상단 요소 입니다. 

 
## 원인은 layout의 padding top

이제 다시 재현 코드를 살펴보겠습니다.
 
```tsx
// Layout.tsx (일부)
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 pt-128">
      <header className="... fixed w-full z-10 top-0">...</header>
      <main className="...">
        <div className="...">{children}</div>
      </main>
    </div>
  );
}
```

원인은 바로 ` <div className="min-h-screen bg-gray-50 pt-128">` 프로젝트 전역을 감싸고 있는 layout의  div 태그에 적용된 pt-128 값입니다. 

레이아웃 루트에 `pt-128`이 있어, 기본적으로 page 요소는 화면에서 128px 아래부터 존재하고, 스크롤을 `pt-128` 영역보다 적게 내리면 page 요소의 `rect.top`은 여전히 **0 이상**입니다.

이경우 page 요소의 rect.top 값이 양수이므로 next 입장에선 page 요소가 아직 viewport에 존재한다 판단해 페이지 이동 시 스크롤을 유지합니다.


반대로 viewport에 layout padding 값이 사라지면 page 요소가 뷰포트를 벗어났다는 의미이고 rect.top 값이 음수가 되기 때문에 next 입장에선 page 요소가 viewport를 벗어났구나 판단해 페이지 이동 시 스크롤을 최상단으로 끌어올립니다.


즉, page의 콘텐츠 영역이 뷰포트를 벗어났을 때만 페이지 이동 시 스크롤이 최상단으로 이동하도록 하는 Next.js의 최적화 로직이 원인이었습니다.






 
## 해결
근본적 원인인 page요소가 viewport를 벗어나야하기에 Layout에 padding-top을 제거하고 page 컴포넌트마다 padding-top을 부여해서 해결했습니다. 


```tsx
// 레이아웃: 상단 여백 제거
<div className="min-h-screen bg-gray-50">
  <header className="... fixed ...">...</header>
  <main>{children}</main>
</div>

// 페이지를 감싸는 ContentWrapper에서만 padding-top 적용
export default function ContentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-128">
      {children}
    </div>
  );
}

// 각 페이지
export default function AboutPage() {
  return (
    <ContentWrapper>
      {/* About 컨텐츠 */}
    </ContentWrapper>
  );
}
```


 
## 최선인가?
이슈 자체는 해결됐지만 여러 가지 에러 사항이 남아있습니다.

 

1. next의 `header`가 존재하는 모든 페이지마다 ContentWrapper로 감싸줘야하는 번거로움이 있습니다.
2. layout 패딩(마진)을 제거했기 때문에 특정 페이지 layout에 subHeader 같은 컴포넌트가 존재한다면 해당 컴포넌트가 화면 최상단에 위치해 header에 가려지는 사이드 이펙트가 존재합니다. 때문에 layout 내 컴포넌트를 page로 옮겨줘야합니다.
3. 사실상 layout 존재 의의가 퇴색된 코드입니다.


 
위 에러 사항을 해결하기 위한 더 나은 방안을 강구하는 것이 숙제일 듯 합니다.

 
 
<br>
<br>

 
<!-- ![next스크롤이슈재현](/image/next스크롤이슈재현.gif) -->

<!-- ![next스크롤이슈재현안됨](/image/next스크롤이슈재현안됨.gif) -->


<details>

<summary>참고문헌</summary>

<div markdown="1">

- [Next.js layout-router.tsx (스크롤 처리 로직)](https://github.com/vercel/Next.js/blob/87fb29ee7143c1e9a4c129585f9546c3f5e0b2b8/packages/next/src/client/components/layout-router.tsx#L151)

</div>

</details>
