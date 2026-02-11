---
date: "2025-03-05"
title: "[Next.js] Next.js 페이지 이동 후 스크롤이 맨 위로 가지 않는 이슈"
categories: ["Next.js"]
summary: "레이아웃에 상단 여백을 둔 Next.js 앱에서, 페이지 이동 시 스크롤이 초기화되지 않는 현상의 원인과 대응을 정리했습니다."
thumbnail: "/image/NEXT.png"
---

# 발단

사내 프로젝트 작업 중 고정 헤더와 상단 여백이 있는 레이아웃에서 Next.js로 페이지를 이동할 때, **스크롤이 맨 위로 초기화되지 않고 이전 위치가 유지되는** 현상을 겪었습니다.  
동일한 레이아웃을 사용하는 탭 간 이동에서 재현되었고, 대응을 위해 원인을 추적해 보았습니다.

## 재현 환경

- 레이아웃 루트에 `pt-128`(상단 패딩)을 두고, 헤더는 `fixed`로 상단 고정.
- `/about`, `/dashboard` 등 동일 레이아웃을 공유하는 페이지 간 `<Link>`로 이동.

레이아웃과 페이지 구조는 아래와 비슷합니다.

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

## 재현 조건과 현상

**재현되는 경우**

1. 레이아웃 상단 여백(`pt-128` 영역)보다 **적게** 스크롤한 상태에서
2. GNB 탭(Home / About / Dashboard) 등으로 다른 페이지로 이동하면
3. 페이지는 바뀌지만 **스크롤 위치는 그대로** 유지됩니다.

![스크롤초기화안됨](/image/스크롤초기화안됨.gif)

<br>
<br>



**재현되지 않는 경우**

- 스크롤을 하지 않은 채로 페이지 이동 → 스크롤은 맨 위로 리셋됨.
- 상단 여백을 모두 지나 **그보다 많이** 스크롤한 뒤 페이지 이동 → 이때도 스크롤이 맨 위로 리셋됨.

![스크롤초기화됨](/image/스크롤초기화됨.gif)

<br>
<br>
<br>

# 원인

Next.js App Router는 페이지 전환 시 **페이지 컨텐츠 최상단 요소가 이미 뷰포트 안에 있으면 스크롤을 건드리지 않는다**는 최적화 로직을 사용합니다.  
우리 레이아웃은 **상단 여백을 `pt-128`로 채우고 있어서**, “적게 스크롤한 상태”에서는 이 최상단 요소가 계속 뷰포트 안에 남고, 그 결과 스크롤 리셋이 수행되지 않습니다.

<br>
<br>
<br>

# 원인 분석: Next.js의 스크롤 처리

Next.js 소스에는 대략 아래와 같은 보조 함수와 분기가 있습니다.

- [layout-router.tsx (관련 로직)](https://github.com/vercel/Next.js/blob/87fb29ee7143c1e9a4c129585f9546c3f5e0b2b8/packages/next/src/client/components/layout-router.tsx#L151)

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

- `domNode`는 **레이아웃이 아니라 페이지 컨텐츠 영역의 최상단 요소**로 전달됩니다.
- `rect.top >= 0`이면 “요소가 뷰포트 상단보다 아래에 있다”고 보고, **스크롤을 유지**합니다.
- `rect.top < 0`이면 “뷰포트 위로 벗어났다”고 보고, `scrollTop = 0` 후 필요 시 `scrollIntoView()`까지 호출해 **맨 위로 맞춥니다**.

<br>
<br>

제가 재현한 프로젝트 구조에서는

- 레이아웃 루트에 `pt-128`이 있어, **페이지 컨텐츠 최상단**이 그만큼 아래에 있습니다.
- 스크롤을 “pt-128 영역만큼만” 내리면, 컨텐츠 최상단 요소의 `rect.top`은 여전히 **0 이상**입니다.
- 따라서 Next.js는 “이미 뷰포트 안에 있음”으로 판단하고 **스크롤을 리셋하지 않습니다**.
- 반대로, 그 이상 스크롤해 `rect.top`이 음수가 되면 “뷰포트를 벗어남”으로 판단해 **스크롤을 맨 위로 초기화**합니다.

즉, **레이아웃 상단 여백 때문에 페이지 최상단 요소”가 항상 뷰포트 안에 들어오는 구간이 생기고**, 그 구간에서는 Next.js의 “불필요한 스크롤 방지” 로직이 스크롤 리셋을 막는 것이 원인입니다.

<br>
<br>
<br>

# 해결 방향

원인은 **페이지 컨텐츠 최상단 요소가 뷰포트를 벗어나야 스크롤 리셋이 동작한다**는 점이므로,  
레이아웃에서 상단 여백을 없애고 **각 페이지(또는 페이지를 감싸는 wrapper)에서만 상단 여백을 주는 방식**으로 바꾸면 됩니다.

- 레이아웃 루트의 `pt-128` 제거.
- 페이지 컨텐츠를 감싸는 wrapper에만 `padding-top`(또는 동일한 높이의 여백) 적용.

이렇게 하면:

- 문서 흐름 상 **페이지 컨텐츠 최상단**이 실제로 화면 위쪽에 붙고,
- 스크롤을 조금만 내려도 해당 요소의 `rect.top`이 음수가 되어,
- Next.js가 “뷰포트 밖”으로 판단해 **페이지 이동 시 스크롤을 맨 위로 리셋**하게 됩니다.

예시는 아래와 같습니다.

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

<br>
<br>
<br>

# 한계와 정리

- **장점**: 이슈는 해소되고, 페이지 이동 시 스크롤이 맨 위로 초기화됩니다.
- **단점**:
  - 헤더가 존재하는 모든 페이지를 ContentWrapper 등으로 감싸야하는 번거로움이 생깁니다.
  - 레이아웃에 있던 헤더, GNB탭 등이 next page 컴포넌트에 위치해야하는 경우가 생길 수 있습니다.
  - “레이아웃이 전역 상단 여백을 담당한다”는 역할이 줄어들어, 레이아웃 설계를 다시 보는 게 좋습니다.

정리하면, **Next.js의 스크롤 최적화(이미 뷰포트 안에 있으면 스크롤 유지)** 와 **레이아웃 상단 여백 구조**가 맞물려서, “조금만 스크롤한 상태”에서만 스크롤이 리셋되지 않는 현상이 발생한 것이고, 상단 여백을 레이아웃이 아닌 페이지 쪽으로 옮기면 해결할 수 있습니다.  
더 나은 구조(예: 스크롤 리셋만 별도로 제어하는 방법)는 추후에 고민해 보면 좋을 것 같습니다.

<br>
<br>
<br>

<details>

<summary>참고문헌</summary>

<div markdown="1">

- [Next.js layout-router.tsx (스크롤 처리 로직)](https://github.com/vercel/Next.js/blob/87fb29ee7143c1e9a4c129585f9546c3f5e0b2b8/packages/next/src/client/components/layout-router.tsx#L151)

</div>

</details>
