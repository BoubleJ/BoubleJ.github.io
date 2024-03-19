---
date: "2023-02-11"
title: "[마켓플레이스 프로젝트] ui Toast 안뜨는 이유 & 위치 조정"
categories: ["MarketPlace"]
summary: "버튼을 클릭했는데 modal창이 안떴다."
thumbnail: "./image-29.png"
---

```jsx
//ItemMainInfo.tsx

<button
  className="my-3 rounded-md border border-brand-primary-500 p-2 text-sm text-brand-primary-500"
  onClick={() => {
    renderToastWithAddCoupon();
    toast({
      title: "쿠폰 발급 성공",
      description: "쿠폰이 정상적으로 발급되었습니다.",
      action: <ToastAction altText="Try again">닫기</ToastAction>,
    });
  }}
>
  10% 쿠폰 받기
</button>
```

버튼을 클릭했는데 modal창이 안떴다.

원인은 layout.tsx에 모달 컴포넌트를 넣지않았기 때문이다.

```jsx
//item 상세페이지.tsx

<>
  <div className="fixed top-0 bg-white w-96 flex flex-col gap-2 z-10">
    <ItemHeader itemName={itemDetails.data.itemName} />
    <ItemTabs itemId={params.itemId} />
  </div>
  <div className="pt-28 py-20 min-h-screen">{children}</div>
  <div className="fixed bottom-0 h-20 w-96">
    <BottomTab
      wished={itemDetails.data.wished}
      itemId={params.itemId}
      product={convertedItem}
    />
  </div>
  **
  <Toaster />
  **
</>
```

    <Toaster /> 컴포넌트를 넣어주니 모달창이 정상적으로 떴다.

![alt text](image-29.png)

본 프로젝트는 모바일 기준 ui기 때문에 모달창을 가운데로 옮기고 싶다.

toast 컴포넌트를 들어가보자

```jsx

//toast.tsx

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
      className,
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

{/*  이런저런 코드  */}
```

ToastViewport 는 toast modal 창이 렌더링되는 위치를 지정하는 곳이다.

className 속성을 수정해주자

```jsx
 className={cn(
      'fixed bottom-0 left-[50%] z-[100] flex max-h-screen w-full translate-x-[-50%] flex-col-reverse p-4 sm:right-0 sm:flex-col md:max-w-[420px]',
      className,
    )}
```

수정한 상태로 다시 toast를 렌더링해보자

![alt text](image-30.png)

원하는 위치에 modal창이 렌더링되는 것을 확인할 수 있다.
