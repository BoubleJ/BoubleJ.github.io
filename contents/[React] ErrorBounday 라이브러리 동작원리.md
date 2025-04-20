---
date: "2024-06-02"
title: "[React] ErrorBoundary 라이브러리 동작원리"
categories: ["React"]
summary: "에러 발생 시 에러를 잡아내고 fallback UI를 보여주는 ErrorBoundary의 동작원리를 알아봅시다."
thumbnail: "./에러바운더리이미지.png"
---

# Error Boundary란?

Error Boundary는 하위 컴포넌트에서 발생한 자바스크립트 에러를 포착하고 잡아내(catch) 오류 상태로 전환한 뒤 fallback UI를 보여주는 기능입니다.

클래스형 컴포넌트의 `getDerivedStateFromError`, `componentDidCatch` 생명주기를 사용해 에러바운더리를 구현할 수 있다고합니다.

`getDerivedStateFromError` 는 에러가 발생한 후 Fallback UI를 렌더링하는 데 사용하고 `componentDidCatch`를 에러 정보를 기록하는데 사용합니다.

<br>
<br>

# 적용 예시

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logErrorToMyService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

위 코드와 같이 클래스형 컴포넌트 형식으로 ErrorBoundary를 구현할 수 있습니다.

<br>

```jsx
<ErrorBoundary fallback={<p>Something went wrong</p>}>
  <Profile />
</ErrorBoundary>
```

비동기함수 호출 컴포넌트(`<Profile>`)를

위에서 구현한 `ErrorBoundary` 컴포넌트로 감싸주면

`<Profile />` 내 에러 발생 시 ErrorBoundary에서 해당 오류를 "캐치"하고 오류 메시지와 함께

fallback ui인 `{<p>Something went wrong</p>}` 를 보여줍니다.

<br>
<br>

## ErrorBoundary 컴포넌트 분석

위에서 작성한 ErrorBoundary 컴포넌트의 동작원리를 딥다이브 해봅시다.

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트 합니다.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // 에러 리포팅 서비스에 에러를 기록할 수도 있습니다.
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logErrorToMyService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      //  커스텀 폴백 UI를 렌더링할 수 있습니다.
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```
<BR>

### 1. 생성자 (Constructor)

```jsx
constructor(props) {
     super(props);
     this.state = { hasError: false };
   }
```

- constructor는 컴포넌트의 초기 상태를 설정합니다.
- 여기서는 hasError 상태를 false로 초기화합니다. 아직 에러를 포착하지 않은 상태입니다. 

<BR>

### 2. getDerivedStateFromError

```jsx
  static getDerivedStateFromError(error) {
     return { hasError: true };
   }
```

- 이 정적 메서드는 컴포넌트가 오류를 포착했을 때 호출됩니다.
- 반환된 객체는 컴포넌트의 상태를 업데이트합니다. 
- 여기서는 hasError를 true로 설정(에러를 포착)하여 다음 렌더링에서 오류 UI를 표시하도록 합니다.

<BR>

### 3. componentDidCatch


```jsx
 componentDidCatch(error, info) {
     logErrorToMyService(error, info.componentStack);
   }
```

- 이 메서드는 컴포넌트가 오류를 포착했을 때 호출됩니다.
- error와 info 객체를 인수로 받아, 오류와 관련된 추가 정보를 처리할 수 있습니다.
- 여기서는 logErrorToMyService 함수를 호출하여 오류와 컴포넌트 스택 정보를 외부 서비스에 로깅합니다.

<BR>

### 4. render

```jsx
render() {
     if (this.state.hasError) {
       return this.props.fallback;
     }
     return this.props.children;
   }
```

- render 메서드는 컴포넌트의 UI를 정의합니다.
- hasError 상태가 true이면, this.props.fallback을 렌더링하여 사용자에게 오류 메시지나 대체 UI를 표시합니다.
- 그렇지 않으면, 자식 컴포넌트(this.props.children)를 렌더링합니다.

<br>
<br>

## Suspense와 ErrorBoundary 동작원리

ErrorBoundary와 Suspense는 동일한 생명주기를 가지고 있습니다. 동작원리도 상당히 비슷합니다.

### Suspense의 특징

1. Suspense는 하위 컴포넌트의 비동기상태 따라 fallback UI 혹은 children을 띄워줍니다.
2. 하위컴포넌트는 promise를 throw 하고, Suspense는 그 promise를 catch 한다.
3. promise(비동기요청은)는 pending, error, success 3가지 상태를 갖는다
   a. 로딩 :  pending 상태이면 ⇒ Suspense return
   b. 성공 :  settled(Fullfilled) 상태이면 ⇒ 하위컴포넌트(children) return
   c. 실패 :  settled(Rejected) 상태이면 ⇒ Error Boundary return

Suspenses는 프로미스를 catch하고 ErrorBoundary는 에러를 catch 한다는 점에서 동작 원리가 유사한 것 같습니다. 


## ErrorBoundary의 장점

1. 간편한 오류 처리

react-error-boundary는 오류 처리를 간단하고 직관적으로 구현할 수 있게 해줍니다.

또한 선언적 에러 처리를 통해 코드 가독성을 높이고 외부 요인에 의한 코드 오염을 막아줍니다. 

2. 사용자 경험 개선

오류가 발생했을 때 어떠한 안내없이 흰 화면만 보여준다면 사용자는 불쾌감을 느끼고 더 이상 해당 서비스를 이용하고 싶지 않겠죠. 

사용자에게 오류가 났다는 메시지를 전달하고 복구 옵션을 제시해 사용자 경험을 개선할 수 있습니다.

3. 재사용성
ErrorBoundary 컴포넌트를 여러 곳에서 재사용할 수 있어 코드의 중복을 줄이고 유지보수성을 높일 수 있습니다.

<br>
<br>

## 직접 구현해서 사용하면 되지 굳이 라이브러리 쓸 이유가 있나?

아직 함수형 컴포넌트에서는 이러한 생명주기와 똑같은 기능없습니다.

때문에 ErrorBoundary 구현에는 클래스형 컴포넌트를 사용할 수 밖에 없어 라이브러리 사용을 권장하고 있습니다.

<br>
<br>
<br>

<details>

<summary>참고문헌</summary>

<div markdown="1">

https://ko.legacy.reactjs.org/docs/error-boundaries.html

https://velog.io/@mmmdo21/%EC%84%A0%EC%96%B8%EC%A0%81%EC%9C%BC%EB%A1%9C-%EC%97%90%EB%9F%AC%EC%B2%98%EB%A6%AC%ED%95%98%EA%B8%B0react-error-boundary#4-error-boundary%EB%A1%9C-%EC%84%A0%EC%96%B8%EC%A0%81%EC%9C%BC%EB%A1%9C-%EC%97%90%EB%9F%AC%EC%B2%98%EB%A6%AC%ED%95%98%EA%B8%B0-1

</div>

</details>
