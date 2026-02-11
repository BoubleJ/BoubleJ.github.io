---
date: "2024-09-28"
title: "[Next.js] Hydration 에러를 해결하기 위한 suppressHydrationWarning"
categories: ["Next.js"]
summary: "Hydration Failed 에러와 suppressHydrationWarning를 알아봅시다."
thumbnail: "/image/하이드레이션에러.png"
---

# 개요

![하이드레이션에러코드](/image/하이드레이션에러코드.png)

우리가 Next.js로 개발하다보면 가끔 목도하는 에러입니다.

과연 어떤 에러인지, 왜 발생하는지, 해결방법은 뭔지 알아봅시다.

# Hydration Error

위 에러는 Hydration Error 라는 에러입니다.

Hydration Error 에러란,

서버에서 렌더링된 초기 UI가 클라이언트에서 렌더링된 UI와 일치하지 않을 때 발생하는 에러입니다.

React(Next.js)에서는 `서버 사이드 렌더링(SSR)`과 `클라이언트 사이드 렌더링(CSR)` 사이에 정확한 일치가 필요합니다.

즉 `서버 사이드에서 생성된 html`과 이 `html`을 클라이언트로 가져와 이벤트 핸들링과 같은 동적이벤트를 적용하는 `리액트 컴포넌트 활성화`를 통해 만들어지는 `html`이 동일해야한다는 뜻입니다.

이러한 오류는 서버와 클라이언트 사이에서 초기 렌더링이 일관되지 않을 때 주로 나타납니다.

# Hydration이란?

그렇다면 Hydration은 뭘까요?

Hydration은 서버에서 렌더링된 HTML을 사용해 클라이언트에서 React 컴포넌트를 활성화하는 과정을 의미합니다.

이 과정에서 React는 서버에서 생성된 마크업(`html`)을 클라이언트에서 재사용하고 이벤트 핸들러 등을 연결합니다. 그러나 서버와 클라이언트 사이에 불일치가 있다면, React는 hydration 과정에서 오류를 던지게 됩니다.

이로 인해 애플리케이션이 제대로 작동하지 않을 수 있습니다.

# 에러 원인

에러 원인이야 여러가지가 있지만 대표적으로 서버와 클라이언트간 시간차 (Timestamp 사용 시) 로 인한 에러가 있습니다.

`Timestamp`를 사용할 때 이 에러가 발생하는 이유는, 서버와 클라이언트 간의 시간 불일치가 큰데요.

서버에서 생성된 `Timestamp`를 클라이언트에서 검증할 때, 클라이언트의 시간이 서버와 다르면 유효성 검사에 실패하거나 오류가 발생할 수 있습니다.

또는 날짜 포맷이 일치하지 않는 경우에도 문제가 생길 수 있습니다.

# 해결 방법

이러한 문제에 대한 해결책으로 `suppressHydrationWarning` 속성을 사용할 수 있습니다. 이 속성을 불일치가 발생할 수 있는 요소에 추가하면 됩니다.

예를 들어 날짜를 렌더링하는 요소 `suppressHydrationWarning` 속성을 추가해보겠습니다.

```js

return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <StyledRequest>
        <h2>정정 신청 페이지</h2>
        <form onSubmit={handleSubmit} suppressHydrationWarning={true}>
      // "suppressHydrationWarning" 속성추가
        //생략
)

```

중요한 것은 이 속성이 한 단계 깊이에서만 작동한다는 점입니다.

즉 해당되는 React 요소 바로 한 단계 아래의 자식 요소까지만 영향을 미친다는 의미입니다. 자식 요소의 하위 요소들에는 영향을 미치지 않습니다.

위 코드의 경우 form 요소 바로 아래 자식요소에만 적용되겠죠.

따라서 이 속성을 남용하지 않도록 주의해야 합니다.

`suppressHydrationWarning` 는 Hydration Error 문제를 해결하기 위한 임시 방편일 뿐입니다.

<br>
<br>
<br>

<details>

<summary>참고문헌</summary>

<div markdown="1">

https://velog.io/@zojo24/Error-Log-Hydration-Failed

</div>

</details>
