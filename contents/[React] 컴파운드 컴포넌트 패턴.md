---
date: "2024-12-21"
title: "[React] 컴파운드 컴포넌트 패턴"
categories: ["React"]
summary: "리액트 고급 패턴인 컴파운드 컴포넌트 패턴을 알아봅시다. "
thumbnail: "./컴파운드컴포넌트.png"
---

# Compound Components (컴파운드 컴포넌트란?)

> Compound의 뜻은 '합성'입니다. 즉 컴포넌트들을 합성한 패턴을 컴파운드 컴포넌트라고 합니다. <br> 유연하고 재사용 가능한 컴포넌트를 설계할 수 있으며, 코드의 가독성과 유지 보수성을 높일 수 있는 리액트의 고급 디자인 패턴입니다.

# 구현 방법

아래와 같은 코드가 있었다고 해보겠습니다.

```js
const Usage = () => {
  return <MediumClap />;
};
```

이 코드만 봐서는 MediumClap 내부에는 무엇이 들어있는지, 어떻게 구성되어있는지 알 수가 없습니다.

이 코드에 Compound Component 패턴을 적용시켜 보겠습니다.

```js
  import Count from "./Count.js"
import Total from "./Total.js"
import Icon from "./Icon.js"

const MediumClap = ({ children, onClap }) => {
	...
    return <div>{children}</div>
}

MediumClap.Count = Count
MediumClap.Total = Total
MediumClap.Icon = Icon
```

부모컴포넌트가 자식 컴포넌트 property를 가지도록 할당해준 뒤

```js
const Usage = () => {
  //이런저런 로직
  return (
    <MediumClap onClap={handleClap}>
      <MediumClap.Icon />
      <MediumClap.Count />
      <MediumClap.Total />
    </MediumClap>
  );
};
```

위 코드처럼 Compound Component 패턴을 적용시키면 됩니다.

## contextAPI를 활용한 데이터 내부에서 관리

자식에게 직접 props를 넘겨줄 수도 있지만, 상황(ex. 자식들끼리 상태를 공유해야하는 상황)에 따라 context api를 활용하는 것이 유용할 수 있습니다.그런 경우 아래와 같이 구현해볼 수 있습니다.

```js
const MediumClapContext = createContext()
const { Provider } = MediumClapContext

const MediumClap = ({ children, onClap }) => {
  const [clapState, setClapState] = useState()
  ...

  const memoizedValue = useMemo(
    () => ({
      ...clapState,

    }),
    [clapState]
  )

  return (
    <Provider value={memoizedValue}>
      <button
        className={styles.clap}
        onClick={handleClapClick}
      >
        {children}
      </button>
    </Provider>
  )
}
```

Context API에서 제공하는 Provider를 사용하고, 해당 Provider의 value에 자식들에게 전달할 value값을 넣어줍니다. 이때 value값을 memoization 해주어서 불필요한 렌더링이 생기지 않도록 신경써줍니다. 그리고 자식에서도 마찬가지로 Context API를 활용해 값을 사용하면 됩니다.

```js
const Icon = () => {
  const { isClicked } = useContext(MediumClapContext)
  //context api를 활용해  isClicked 값 활용
  return (
	...
  )
}
```

# 컴파운드 컴포넌트의 장점

그렇다면 해당 패턴을 사용하면 어떤 이점을 가져갈 수 있을까요?

## 1. 가독성

```js
const Usage = () => {
  return <MediumClap />;
};
```

위에서 언급했듯이 해당 코드만 보고는 해당 컴포넌트가 어떤 역할을 하는지 어떤 구조를 이루는지 인지하기 어렵습니다.

```js
const Usage = () => {
...
  return (
      <MediumClap onClap={handleClap}>
        <MediumClap.Icon />
        <MediumClap.Count />
        <MediumClap.Total />
      </MediumClap>
  )
}
```

컴파운드 컴포넌트를 활용하면 컴포넌트가 어떤 구조인지 어떤 역할인지 쉽게 확인 가능합니다.

즉 기존의 코드보다도 훨씬 더 가독성이 높아집니다. 사용부만 보고서도 컴포넌트 내부가 어떻게 될지, 어떤 모습으로 그려질 지를 예상할 수 있다는 장점이 있습니다.

## 2. 매우 simple한 props & prop drilling 해결

자식 컴포넌트에서 사용해야하는 props가 많으면 많을수록, 부모 컴포넌트를 사용하는 쪽에서 내려줘야하는 Props의 개수는 증가합니다. 예를 들어

```js
const Usage = () => {
  ...
  return <MediumClap
		  	onClap={handleClap}
		  	handleCount={handleCount}
		  	updateTotal={updateTotal}
		  	count={count}
		  	total={total}
	  	/>
}
```

위와 같은 모습이겠죠.

위 컴포넌트는 너무 많은 props를 부모컴포넌트에 넘기고 있고, prop를 자식 컴포넌트로 넘기기 위해 prop drilling 문제가 발생하고 있습니다.

부모컴포넌트 `MediumClap`에선 사용하지도 않는 props를 단순 자식에게 전달하려는 목적으로 넘기기 때문에 코드에 불필요한 결합도도 많이 생기게 되고, 불필요한 렌더링을 유발할 수도 있습니다.

```js
const Usage = () => {
...
  return (
      <MediumClap onClap={handleClap}>
        <MediumClap.Icon />
        <MediumClap.Count count={count} handleCount={handleCount} />
        <MediumClap.Total total={total} updateTotal={updateTotal} />
      </MediumClap>
  )
}
```

컴포넌트 패턴을 활용하면 불필요하게 부모 컴포넌트를 거치지 않고 곧바로 자식들에게 Props를 전달할 수 있습니다.

이를 통해 prop drilling 문제를 해결하고 간편하게 props를 넘길 수 있습니다.

## 3. 관심사의 분리

2번 문항 연장선으로 부모 컴포넌트와 자식 컴포넌트 관심사 분리가 가능해 핵심이 되는 비지니스 로직은 부모 컴포넌트가 가져가고 자식 컴포넌트들은 자연스럽게 비즈니스 로직과 분리됩니다.

이렇게 작성될 수록, 컴포넌트의 비즈니스 로직으로부터 독립성이 보장되기 때문에 재사용될 확률이 높아집니다.

## 4. headless component 구현 가능

headless component란, props로 내려오는 데이터가 없고, 내부에서 데이터를 처리하는 컴포넌트를 의미합니다.

contextAPI를 활용해 데이터를 props로 넘기는 것이 아닌 내부에서 처리하도록 구현하면 props로 인한 불필요한 렌더링을 줄일 수 있고`(useMemo 활용)` 컴포넌트 독립성을 보장할 수 있습니다.

```js
const MediumClapContext = createContext()
const { Provider } = MediumClapContext

const MediumClap = ({ children, onClap }) => {
  const [clapState, setClapState] = useState()
  ...

  const memoizedValue = useMemo(
    () => ({
      ...clapState,

    }),
    [clapState]
  )

  return (
    <Provider value={memoizedValue}>
      <button
        className={styles.clap}
        onClick={handleClapClick}
      >
        {children}
      </button>
    </Provider>
  )
}
```

아래 코드와 같이 자식컴포넌트에서 props없이 내부에서 데이터를 처리할 수 있습니다.

```js
const Icon = () => {
  const { isClicked } = useContext(MediumClapContext)
  //context api를 활용해  isClicked 값 활용
  return (
	...
  )
}
```

<br>
<br>
<br>

<details>

<summary>참고문헌</summary>

<div markdown="1">

https://velog.io/@rjsdnql123/%EC%BB%B4%ED%8C%8C%EC%9A%B4%EB%93%9C-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8%EB%9E%80#%EC%9A%B0%EB%A6%AC%EB%8A%94-%EA%B0%9C%EB%B0%9C%EC%9D%84-%ED%95%98%EB%A9%B0-%EB%8B%A4%EC%96%91%ED%95%9C-%EC%83%81%ED%99%A9%EC%97%90-%EC%A7%81%EB%A9%B4%ED%95%A9%EB%8B%88%EB%8B%A4

https://velog.io/@yesbb/%EA%B0%9D%EC%B2%B4%EC%A7%80%ED%96%A5%EC%9D%98-%EA%B4%80%EC%A0%90%EC%9C%BC%EB%A1%9C-%EB%B0%94%EB%9D%BC%EB%B3%B8-%EB%A6%AC%EC%95%A1%ED%8A%B8-%EA%B3%A0%EA%B8%89-%ED%8C%A8%ED%84%B4-Compound-component-Render-props

</div>

</details>
