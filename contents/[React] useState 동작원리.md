---
date: "2024-07-03"
title: "[React] useState 동작원리"
categories: ["React"]
summary: "useState 동작원리에 대해 알아보겠습니다."
thumbnail: "./useState아이콘.png"
---

비동기적으로 동작하는 useState의 성질로 인한 State 값 업데이트 이슈를 해결하면서 문득 useState의 동작원리에 대해 궁금해졌습니다.


<BR>

# 함수형 컴포넌트의 상태 관리

클래스형 컴포넌트는 render() 메서드를 통해 상태 변경을 감지할 수 있지만 함수형 컴포넌트는 렌더링이 발생하면 함수 자체가 다시 호출됩니다.

때문에 상태를 관리하려면 함수가 다시 호출되었을 때 **이전 상태를 기억**하고 있어야 합니다.

useState는 이 문제를 **클로저**를 통해 해결합니다.

<br>
<br>

# useState는 어디서 오나?

본격적으로 useState 모듈을 분석해봅시다. 

우리는 useState를 사용할 때 import 구문을 사용합니다. 

```js
import {useState} from 'react'
```
즉 'react'라는 모듈에서 useState를 가져온다는 뜻 입니다. 그럼 react'라는 모듈로 이동해볼까요?

![리액트모듈장소](리액트모듈장소.png)

위 사진은 node_modules/react/cjs/react.development.js 내부에 각종 hooks 함수가 선언된 곳입니다.

모든 리액트 훅들이 여기서부터 만들어진다 생각하면 될 것 같습니다. 

<br>

# function useState 분석

```js

export function useState(initialState) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}

```

리액트 모듈에서 찾아본 useState의 초기 상태입니다. 

resolveDispatcher의 리턴 값을 dispatcher에 할당한 뒤 dispatcher의 useState 메서드에 initialState를 인자로 전달하는 구조입니다.

<BR>

# resolveDispatcher 함수

```js
function resolveDispatcher() {
  const dispatcher = ReactCurrentDispatcher.current;

  if (__DEV__) {
    if (dispatcher === null) {
      console.error('Some error msg...');
    }
  }

  return ((dispatcher: any): Dispatcher);
}
```
그럼 resolveDispatcher 함수는 어떤 구조인지 알아보겠습니다. 

resolveDispatcher 함수는 어디선가 ReactCurrentDispatcher 라는 친구를 가져와 ReactCurrentDispatcher의 current 값을 할당받습니다.

<br>

# ReactCurrentDispatcher 함수

```js

const ReactCurrentDispatcher = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: (null: null | Dispatcher),
};
```

그렇다면 ReactCurrentDispatcher는 또 뭘까요?

ReactCurrentDispatcher.current는 **전역**에 선언된 객체의 프로퍼티입니다.

여기서 알 수 있는 것은 useState의 리턴 값의 출처(ReactCurrentDispatcher.current)가 전역에서 온다는 점입니다.

즉 리액트가 실제로 클로저를 활용해 함수 외부의 값에 접근하는 사실을 알 수 있습니다.

<br>

# 정리

- useState를 포함한 hooks는 react 모듈에 선언되어있는 함수입니다.
- 실행 될 때 마다 dispatcher를 선언하고 useState 메소드 실행해서 그 값을 반환합니다. 
- dispatcher는 전역 변수 ReactCurrentDispatcher로부터 가져옵니다.

<br>
<br>
<br>



<details>

<summary>참고문헌</summary>

<div markdown="1">

https://seokzin.tistory.com/entry/React-useState%EC%9D%98-%EB%8F%99%EC%9E%91-%EC%9B%90%EB%A6%AC%EC%99%80-%ED%81%B4%EB%A1%9C%EC%A0%80

https://velog.io/@jjunyjjuny/React-useState%EB%8A%94-%EC%96%B4%EB%96%BB%EA%B2%8C-%EB%8F%99%EC%9E%91%ED%95%A0%EA%B9%8C#-%EB%A7%88%EB%AC%B4%EB%A6%AC

</div>

</details>
