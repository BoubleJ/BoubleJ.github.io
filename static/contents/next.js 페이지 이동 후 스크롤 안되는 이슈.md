---
date: "2025-03-05"
title: "Next.js 페이지 이동 후 스크롤이 맨 위로 가지 않는 이슈"
categories: ["Next.js"]
summary: "레이아웃에 상단 여백을 둔 Next.js 앱에서, 페이지 이동 시 스크롤이 초기화되지 않는 현상의 원인과 대응을 정리했습니다."
thumbnail: "/thumbnail/NEXT.png"
---

# 개요

사내 next 프로젝트 내 페이지 이동 시 스크롤이 유지되는 이슈가 발생했습니다.

## 재현 환경

1. GNB Header 가 존재하는 미스터블루 내 모든 next 페이지에서 스크롤을 172px 이하로 내립니다. (172px은 완전판다운로드 배너 높이 + GNB 높이 입니다.)
2. 이 상태에서 GNB 탭을 통해 페이지를 이동합니다. (꼭 GNB가 아닌 어느 미스터블루 페이지 경로로 라우팅해도 재현됩니다.)
3. 스크롤이 유지된 채 페이지가 로드됩니다.


![next스크롤이슈재현](/image/next스크롤이슈재현.gif)


<br>
<br>

하지만 다음과 같은 조건일 경우 스크롤 이슈가 발생하지 않습니다. 즉 페이지 이동 시 정상적으로 스크롤이 최상단으로 이동합니다.
1. 스크롤을 이동하지 않은 채 페이지 이동
2. 스크롤을 172px 이상 내린 후 페이지 이동

![next스크롤이슈재현안됨](/image/next스크롤이슈재현안됨.gif)


<br>
<br>

해당 이슈를 확인하고, 상술한 172px 구간 어딘가에서 스크롤이 고정되는 문제가 발생한다고 판단해 원인 분석을 시작했습니다. 그 결과, 다음과 같은 원인을 찾아냈습니다.

<br>
<br>

## 원인
next 내부 코드를 까보면 아래와 같은 로직이 존재합니다. 참고 [next 코드베이스](https://github.com/vercel/next.js/blob/87fb29ee7143c1e9a4c129585f9546c3f5e0b2b8/packages/next/src/client/components/layout-router.tsx#L151)

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
인자로 받은 요소와 viewport 거리를 계산해서 rect.top 값이 양수 or 0이면 next는 해당 요소가 아직 viewport내 존재한다 판단해 페이지 이동 시 스크롤을 유지합니다. (불필요한 스크롤 방지를 위한 최적화..)
rect.top 값이 0보다 작으면 해당 요소가 viewport를 벗어났다 판단해 페이지 이동 시 스크롤 이벤트가 발생합니다.
이때 topOfElementInViewport 함수가 넘겨받는 엘리먼트 인자는 layout 영역이 아닌 page 컨텐츠 영역 최상단 요소 입니다. 

<br>
<br>

그리고 저희 미스터블루 next 코드는 아래와 같습니다. 

```ts
//app/(homeLayout)/Layout.tsx


export default function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const isServerShowBanner =
    ChannelForServer.isAWDevice() && getCookie(makeCookieKey('headerBanner')) === null;
  const getMargin = () => {
    let base = LAYOUT_MARGIN_TOP_BASE;

    // 헤더배너가 있을 경우
    if (isServerShowBanner) {
      base += HEADER_BANNER_HEIGHT;
    }

    return base;
  };

  const marginStyle = {
    '--margin': `${getMargin()}px`,
  } as React.CSSProperties;

  return (
    <div id="Layout" className={cn(st['wrap-layout'])} style={marginStyle}>
      <Header isServerShowBanner={isServerShowBanner}>
        <MainHomeHeaderTop />
        <HeaderBottom pageType="HOME" />
      </Header>
      <Sidebar />
      {children}
      <Footer showProposal={true} />
    </div>
  );
}


```

```scss
.wrap-layout {
  margin-top: var(--margin);
}

```

이 코드는 미스터블루 총메인 layout 영역 코드입니다.

완전판 헤더배너와 GNB에 fixed를 줬기 때문에 viewport 영역을 차지하지 않아 해당 공백을 margin으로 대체한 상태입니다.

참고로 장르홈 페이지(웹만소 페이지)에 사용되는 SubLayout.tsx 도 비슷한 구조로 설계되어있습니다. 

<br>
<br>


브라우저에선 다음과 같은 형태로 노출됩니다. 

![next스크롤이슈](/image/next스크롤이슈.png)

즉 최상단 layout에 상단 완전판다운로드 배너 높이 + GNB 높이 = 172px만큼 margin이 부여되어있는 상태입니다. (완전판 배너가없으면 100px이 적용됩니다.)

화면에 layout margin이 남아있을 경우 page 요소의 rect.top 값이 양수이므로 next 입장에선 page 요소가 아직 viewport에 존재한다 판단해 페이지 이동 시 스크롤을 유지합니다.

반대로  viewport에 layout marign 값이 사라지면 page 요소가 뷰포트를 벗어났다는 의미이고 rect.top 값이 음수가 되기 때문에 next 입장에선 page 요소가 viewport를 벗어났구나 판단해 페이지 이동 시 스크롤을 최상단으로 끌어올립니다.

<br>
<br>

## 해결
근본적 원인인 page요소가 viewport를 벗어나야하기에 Layout에 margin을 제거하고 page 컴포넌트마다 padding-top을 부여해서 해결했습니다. 

```ts
export default function Home() {
  return (
    <MainStateProvider>
      <ContentWrapper>
        <MainHome />
      </ContentWrapper>
    </MainStateProvider>
  );
}
```


```ts
export default function ContentWrapper({ children, pageType }: ContentWrapperProps) {
  const hostAppChannel = ChannelForServer.getHostAppChannel();
  const isServerShowBanner =
    ChannelForServer.isAWDevice() && getCookie(makeCookieKey('headerBanner')) === null;
  const getPaddingTop = () => {
    if (hostAppChannel === 'IA' && pageType !== 'HOME') return 0;

    let base = LAYOUT_MARGIN_TOP_BASE;

    // 헤더배너가 있을 경우
    if (isServerShowBanner) {
      base += HEADER_BANNER_HEIGHT;
    }

    return base;
  };

  const paddingStyle = {
    '--padding-top': `${getPaddingTop()}px`,
  } as React.CSSProperties;

  return (
    <div className={cn('wrap-content')} style={paddingStyle}>
      {children}
    </div>
  );
}
```

<br>
<br>

## 최선인가?
이슈 자체는 해결됐지만 여러 가지 에러 사항이 남아있습니다.

<br>


1. GNB가 존재하는 모든 페이지마다 ContentWrapper로 감싸줘야하는 번거로움이 있습니다.
2. layout 마진을 제거했기 때문에 특정 페이지 layout에 subTab 과 같은 컴포넌트가 존재한다면 해당 컴포넌트가 화면 최상단에 위치해 header에 가려지는 사이드 이펙트가 존재합니다. 때문에 layout 내 컴포넌트를 page로 옮겨줘야합니다.
3. 사실상 layout 존재 의의가 퇴색된 코드입니다.


<br>

위 에러 사항을 해결하기 위한 더 나은 방안을 강구하는 것이 숙제일 듯 합니다.

<br>
<br>
<br>

<details>

<summary>참고문헌</summary>

<div markdown="1">

- [Next.js layout-router.tsx (스크롤 처리 로직)](https://github.com/vercel/Next.js/blob/87fb29ee7143c1e9a4c129585f9546c3f5e0b2b8/packages/next/src/client/components/layout-router.tsx#L151)

</div>

</details>
