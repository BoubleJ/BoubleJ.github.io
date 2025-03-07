---
date: "2023-12-26"
title: "[Javascript] Fetch함수와 Promise(+콜백지옥)"
categories: ["Javascript"]
summary: "url.search를 알아봅시다."
thumbnail: "./자바스크립트로고.png"
---

`[URL](https://developer.mozilla.org/ko/docs/Web/API/URL)` 인터페이스의 **`search`** 속성은 맨 앞의 `'?'`와 함께 URL의 쿼리 문자열, 즉 검색 매개변수를 나타내는 `[USVString](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String)`입니다.

```jsx
const url = new URL(
  "https://developer.mozilla.org/ko/docs/Web/API/URL/search?q=123",
);
console.log(url.search);
// ?q=123
```
