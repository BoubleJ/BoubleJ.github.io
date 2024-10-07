---
date: "2024-09-28"
title: "[Javascript] nullish 병합 연산자"
categories:
  ["Javascript", "??연산자", "nullish", "병합 연산자", "truthy", "ES6"]
summary: "nullish 병합 연산자 ?? 문법을 알아봅시다."
thumbnail: "./병합연산자.png"
---

# nullish 병합 연산자(nullish coalescing operator) ?? 란

?? 를 사용한 연산자 문법입니다. 이런 문법은 말로 설명하면 어려우니 예시를 봅시다.

```js
a ?? b;

//a가 null도 아니고 undefined도 아니면 a
//그 외의 경우는 b
```

위 코드를 nullish 병합 연산자 ??없이 x = a ?? b와 동일한 동작을 하는 코드를 작성하면 다음과 같습니다.

```js
x = a !== null && a !== undefined ? a : b;
```

비교 연산자와 논리 연산자만으로 작성하려니 코드가 길어집니다. 병합연산자를 사용하면 가독성을 높일 수 있겠군요.

## 다른 예시

다른 예시도 살펴봅시다.

```js
let firstName = null;
let lastName = null;
let nickName = "바이올렛";

console.log(firstName ?? lastName ?? nickName ?? "익명의 사용자");
// 바이올렛
```

동작원리를 살펴보면

1. `firstName ?? lastName` 에서 firstName 가 `null` 이므로 평가 결과 lastName가 할당됩니다.
2. `lastName ?? nickName` 에선 lastName 도 `null` 이므로 평가 결과 nickName가 할당됩니다.
3. `nickName ?? "익명의 사용자"` 에선 `nickName`가 `null` 또는 `undefined`가 아니므로 `nickName` 값 바이올렛이 출력됩니다.

## '??'와 '||'의 차이

이쯤에서 드는 생각

nullish 병합 연산자는 OR 연산자 ||와 상당히 유사해 보입니다. 실제로 위 예시에서 ??를 ||로 바꿔도 그 결과는 동일합니다.

```js
let firstName = null;
let lastName = null;
let nickName = "바이올렛";

console.log(firstName || lastName || nickName || "익명의 사용자");
// 바이올렛
```

그런데 두 연산자 사이에는 중요한 차이점이 있습니다.

바로

||는 첫 번째 **truthy 값**을 반환합니다.
??는 첫 번째 **정의된(undefined)** 값을 반환합니다.

`null`과 `undefined`, 숫자 0을 구분 지어 다뤄야 할 때 이 차이점은 매우 중요한 역할을 합니다.

예시를 살펴봅시다.

### '??'와 '||'의 차이 예시

```js
let height = 0;

console.log(height || 100); // 100
console.log(height ?? 100); // 0
```

height || 100은 height에 0을 할당했지만 0을 `falsy` 한 값으로 취급했기 때문에 null이나 undefined를 할당한 것과 동일하게 처리합니다.

따라서 height || 100의 평가 결과는 100입니다.

반면 height ?? 100의 평가 결과는 height가 **정확하게 null이나 undefined일 경우**에만 100이 됩니다.

예시에선 height에 0이라는 값을 할당했기 때문에 0이 출력됩니다.

이런 특징 때문에 높이처럼 0이 할당될 수 있는 변수를 사용해 기능을 개발할 땐 ||보다 ??가 적합합니다.

## ?? 우선순위

??의 연산자 우선순위는 **5**로 꽤 낮습니다.

따라서 ??는 =와 ? 보다는 먼저, 대부분의 연산자보다는 나중에 평가됩니다.

그렇기 때문에 복잡한 표현식 안에서 ??를 사용해 값을 하나 선택할 땐 괄호를 추가하는 게 좋습니다.

```js
let height = null;
let width = null;

// 괄호를 추가!
let area = (height ?? 100) * (width ?? 50);

console.log(area);
// 5000
```

만약 괄호를 추가하지 않는다면 우선 순위가 높은 \*가 먼저 동작하기 때문에 원치 않는 결과가 출력됩니다.

```js
let area = height ?? 100 * width ?? 50;
//위 코드는 아래 코드처럼 괄호 * 먼저 동작하게 됩니다.
let area = height ?? 100 * width ?? 50;

//위 아래 코드의 결과는 동일합니다.

console.log(area);
// 0
```

## 그 외 유의 사항

??엔 자바스크립트 언어에서 규정한 또 다른 제약사항이 있습니다.

안정성 관련 이슈 때문에 ??는 &&나 ||와 함께 사용하지 못합니다.

아래 예시를 실행하면 문법 에러가 발생합니다.

```js
let x = 1 && 2 ?? 3;
// SyntaxError: Unexpected token '??'
```

제약을 피하기 위해선 꼭 괄호를 사용해주시길 바랍니다.

```js
let x = (1 && 2) ?? 3;
// 제대로 동작합니다.
```

<br>
<br>
<br>

<details>

<summary>참고문헌</summary>

<div markdown="1">

https://ko.javascript.info/nullish-coalescing-operator

</div>

</details>
