---
date: "2023-01-19"
title: "[Javascript] window.location"
categories: ["Javascript"]
summary: "현재 페이지의 URL을 알아오기 위해 window.location 속성을 사용할 수 있습니다."
thumbnail: "./자바스크립트로고.png"
---

현재 페이지의 URL을 알아오기 위해 window.location 속성을 사용할 수 있습니다.

window.location 속성에 접근하면 Location 객체에 접근할 수 있는데

이 Location 객체의 속성들을 사용해서 현재 페이지의 URL 정보를 알아낼 수 있습니다.

```jsx
//현재 내가 위치한 웹사이트 주소 
//"https://hianna.tistory.com/325?category=764998"
// 라 한다면

console.log(window.location.href)
// "https://hianna.tistory.com/325?category=764998"
//전체 URL 문자열을 가져옵니다.
 
console.log(window.location.protocol)
// "https:"
//마지막 ':'를 포함한 프로토콜 정보를 가져옵니다.

 

console.log(window.location.host)
// "hianna.tistory.com"
//URL의 호스트 정보를 가져옵니다.
//예제는 포트번호가 없지만, 만약 URL에 포트번호가 있으면 ':'과 포트번호를 포함합니다.

 

console.log(window.location.hostname)
// "hianna.tistory.com"
//URL의 호스트명을 가져옵니다.
//이 값은 ':'과 포트번호를 포함하지 않습니다.

//예제는 URL에 포트번호를 포함하지 않기 때문에 window.location.host와 
//window.location.hostname이 같습니다.

//만약 URL이 'https://hianna.tistory.com:8080/325?category=764998"이라면
//window.location.host는 "hianna.tistory.com:8080"이 되고,
//window.location.hostname은 "hianna.tistory.com"이 됩니다.

 
console.log(window.location.port)
// ""
//URL의 포트 번호입니다.

 

console.log(window.location.pathname)
// "/325"
//hostname 뒤의 '/'문자 뒤의 경로를 가져옵니다.

 

console.log(window.location.search)
// ?category=764998"
//'?' 뒤의 쿼리스트링을 가져옵니다.

```