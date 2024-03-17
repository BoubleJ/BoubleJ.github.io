---
date: "2023-12-05"
title: "[Javascript] Fetch 함수의 두 번째 매개변수"
categories: ["Javascript"]
summary: "Post 요청을 예시로 Fetch 함수의 두 번째 매개변수를 알아봅시다."
thumbnail: "./자바스크립트로고.png"
---

```jsx
// POST 메서드 구현 예제
async function postData(url = "", data = {}) {
  // 옵션 기본 값은 *로 강조
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE 등
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body의 데이터 유형은 반드시 "Content-Type" 헤더와 일치해야 함
  });
  return response.json(); // JSON 응답을 네이티브 JavaScript 객체로 파싱
}

postData("https://example.com/answer", { answer: 42 }).then((data) => {
  console.log(data); // JSON 데이터가 `data.json()` 호출에 의해 파싱됨
});
```

이렇게 다양한 옵션을 넣을 수 있다.

자세한 내용은 밑 링크를 참고

https://developer.mozilla.org/ko/docs/Web/API/Fetch_API/Using_Fetch