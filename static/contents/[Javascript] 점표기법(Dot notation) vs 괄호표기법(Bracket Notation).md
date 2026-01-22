---
date: "2025-02-24"
title: "[Javascript] 점표기법(Dot notation) vs 괄호표기법(Bracket Notation)"
categories: ["Javascript"]
summary: "객체 속성 접근법인 점표기법, 괄호표기법을 알아봅시다."
thumbnail: "/image/점괄호표기법차이점.png"
---

객체의 프로퍼티에 접근하는 방법에는 2가지가 있습니다. 점표기법(Dot notation)과 괄호표기법(Bracket Notation)입니다.

# 점표기법(Dot notation)

```js
let myself = {
  name: "Code Kim",
  country: "South Korea",
  age: 30,
  cats: ["냥순", "냥돌"],
};

myself.name; // 'Code Kim'
myself.age; // 30
```

객체의 이름 뒤에 점을 찍어주고 그 뒤에 key를 넣어주면 그 key에 해당하는 value값이 출력됩니다.

# 괄호표기법(Bracket Notation)

```js
let myself = {
  name: "Code Kim",
  country: "South Korea",
  age: 30,
  cats: ["냥순", "냥돌"],
};

myself["name"]; // 'Code Kim'
myself["age"]; // 30
```

객체의 이름 뒤에 대괄호 [ ]를 써주고 안에 key를 넣어주면 그 key에 해당하는 value값이 출력됩니다.

# 차이점

## 1. 가독성

점 표기법이 괄호 표기법에 비해 간결하게 작성할 수 있어 가독성 측면에서 좋습니다.

때문에 보통 점 표기법이 자주 쓰입니다.

## 2. 프로퍼티 식별자 규칙

점 표기법의 식별자는 오직 알파벳과 특수문자 \_ & $로 시작해야합니다.

```js
let obj = {
  prop_1: "meow",
  prop$: "woof",
};

//가능
obj.prop_1; //meow
obj.prop$; //woof
```

숫자, 나머지 특수문자로 시작하거나 공백이 포함되어있을 경우 접근할 수 없습니다.

```js
let obj = {
	1prop : 'meow',
	prop name: 'woof',
};


 obj.1prop  //에러
 obj.prop name  //에러
 //불가능
```

반면, 괄호표기법은 특수문자, 숫자, 공백 모두 사용할 수 있습니다.

괄호표기법의 프로퍼티 식별자는 문자열을 갖기 때문입니다. 어떤 문자든 공백을 포함할 수 있습니다.

```js
obj.['cat'];
obj.[''];
obj.['112ac'];
obj.['_*&&*'];

// 모두 접근 가능

```

## 3. 변수를 활용한 접근 가능 여부

괄호 표기법은 객체의 프로퍼티에 변수를 활용하여 접근할 수 있습니다.

<br>

객체의 프로퍼티에 접근하여 원하는 값(: changingValue)으로 변경하는 함수 changeProperty() 가 있습니다.

점 표기법으로 likelion 의 member 값(21 -> 300)을 변경해보겠습니다.

```js
const changeProperty = (object, property, changingValue) => {
  object.property = changingValue;
};

changePropery(likelion, member, 300);
// Uncaught ReferenceError: member is not defined
```

changeProperty의 인자 member가 정의되지 않았다는 에러메시지가 발생합니다.

즉 member 를 변수로서 사용하고 싶었지만, 점 표기법에서는 이런 방법이 불가능합니다.

<br>

반면, 괄호 표기법을 사용하면 "member" 변수를 활용하여 객체의 프로퍼티에 접근할 수 있습니다.

```js
const changeProperty = (object, property, changingValue) => {
  object[property] = changingValue;
};

changePropery(likelion, "member", 300);

// likelion = {number: '9th', member: 300, univ: "pnu"}
```

likelion 객체의 member 값이 21 에서 300 으로 변경 된 것을 확인할 수 있습니다.

## 다른 예시

```js
let myself = {
  name: "Code Kim",
  country: "South Korea",
  age: 30,
  cats: ["냥순", "냥돌"],
};

let myKey = "cats";

console.log(myself["cats"]); // ['냥순', '냥돌']
console.log(myself[myKey]); // ['냥순', '냥돌']
// 변수 myKey 활용 가능
console.log(myself.myKey); // undefined
// 변수 myKey 활용 불가능
```

`myself[myKey]` 는 myself 객체의 'cats' 값에 접근합니다.

반면 `myself.myKey` 는 undefined가 뜹니다.

```js
let myself = {
  name: "Code Kim",
  country: "South Korea",
  age: 30,
  cats: ["냥순", "냥돌"],
  myKey: "Hello, world!",
};

let myKey = "cats";
console.log(myself["cats"]); // ['냥순', '냥돌']
console.log(myself[myKey]); // ['냥순', '냥돌']
// 여기서 myKey는 객체 밖에 있는 변수에 해당한다.
console.log(myself.myKey); // "Hello world!"
// 여기서 myKey는 객체 안에 있는 key값에 해당한다.
```

`myself[myKey]` 는 마찬가지로 myself 객체의 `cats` 값에 접근하지만

`myself.myKey` 는 myself 객체의 `myKey` 값에 접근합니다.

### 비동기 데이터에서 괄호표기법

이렇게 괄호 표기법을 사용하면, 아직 객체 내부가 정의되지 않은 경우에도 접근할 수 있는 이점이 있습니다.

예를 들어 API 통신으로 어떤 객체(= result)를 받아올 때, 해당 객체의 내부 값을 변경하는 코드를 작성한다고 생각해봅시다.

result 객체의 a 라는 property 가 존재한다해도, API 통신 이전에는 해당 property 는 정의되지 않은 상태입니다.

점 표기법은 정의되지 않은 result 객체에 접근할 수 없지만, 괄호 표기법은 해당 프로퍼티를 변수화하기 때문에 접근이 가능해집니다.

비동기로 데이터를 호출하는 경우, 프로퍼티에 접근하고 싶다면 괄호 표기법을 사용합시다 !

<br>
<br>
<br>

<details>

<summary>참고문헌</summary>

<div markdown="1">

https://junior-datalist.tistory.com/157

https://velog.io/@ktg6360/TIL-015-%EC%A0%90%ED%91%9C%EA%B8%B0%EB%B2%95Dot-Notation-vs-%EA%B4%84%ED%98%B8%ED%91%9C%EA%B8%B0%EB%B2%95Bracket-Notation

https://youngban.tistory.com/46

</div>

</details>
