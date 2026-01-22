---
date: "2023-12-24"
title: "[Javascript] URLSearchParams"
categories: ["Javascript"]
summary: "URLSearchParams API는 URL query parameter에서 자료를 가져오는 방법을 제공합니다."
thumbnail: "/image/자바스크립트로고.png"
---


URLSearchParams API는 URL query parameter에서 자료를 가져오는 방법을 제공합니다.

# URLSearchParams 객체 생성

세가지 방법으로 URLSearchParams 객체를 생성할 수 있습니다.

## 1. URL 객체 사용

```jsx
let url= new URL('https://sisiblog.tistory.com?mode=night&page=2');
let params = new URLSearchParams(url.search);
//new URLSearchParams -> URLSearchParams 객체를 생성하는 메서드 
console.log(params)
// URLSearchParams {size : 2} 
// size : 2 은 URLSearchParams라는 객체가 2개라는 뜻 (mode=night  /  page=2)
```

위의 코드와 같이 직접 URL 객체를 만들어서 URLSearchParams 객체를 생성할 수도 있고 

url.search 대신 window.location.search를 사용해 브라우저에서 입력받은 값을 사용해 URLSearchParams 객체를 생성할 수 있습니다.

→ 현재 브라우저 위치의 URLSearchParams 객체 생성 가능

## 2. 쿼리 문자열 사용

```jsx
let params1 = new URLSearchParams("mode=night&page=2");
let params2 = new URLSearchParams("?mode=night&page=2");

console.log(params1, params2)
// 둘 다 URLSearchParams {size: 2} 출력
//하지만 params2는 ? 를 포함하므로 둘은 다른 값이다. 
```

&로 구분하는 URI 리소스 값을 문자열 그대로 입력할 수도 있고 '?'까지 포함해서 URLSearchParams 객체를 만들 수 있습니다.

## 3. 리소스 항목 사용

```jsx
let params1 = new URLSearchParams([["mode", "night"],["page", "2"]]);
//배열형태
let params2 = new URLSearchParams({mode: "night", page : "2"});
//객체 형태
```

key, value 쌍의 배열을 입력해 URLSearchParams를 생성하거나 객체의 형태로 입력하여 만들 수 있습니다.

# 유틸리티 메소드

다음의 모든 예제는 아래 코드의 params를 사용했습니다.

```jsx
let url= new URL('https://sisiblog.tistory.com?mode=night&page=2&mode=day');
let params = new URLSearchParams(url.search);
```

## 1. get

매개변수로 전달 받은 값으로 첫 번째로 검색되는 값을 가져옵니다. 만일 찾지 못한 경우 null을 반환합니다.

```jsx
let mode = params.get('mode'); // night
let time = params.get('time'); // null
```

mode는 두개의 항목이 있지만 첫 번째 항목의 값이 반환됐고, time 이라는 키는 존재하지 않으므로 null을 반환합니다.

## 2. getAll

get() 메소드와는 다르게 전달 받은 매개변수 값으로 모든 항목을 검색합니다.

```jsx
let modes = params.getAll('mode'); // ["night", "day"]
```

위의 예제는 키가 mode인 모든 값을 반환합니다.

## 3. has

query parameter에 특정한 이름이 존재하는지 확인합니다.

```jsx
let hasMode = params.has('mode'); // true
let hasTime = params.has('time'); // false
```

mode와 time이 리소스에 존재하는지 여부를 반환합니다.

## 4. toString

쿼리 문자열 자체를 출력합니다.

```jsx
params.toString(); // mode=night&page=2&mode=day
```

## 5. append

search params에 key-value 쌍으로 항목을 추가합니다.

```jsx
params.append('tag', "js");
params.toString(); // mode=night&page=2&mode=day&tag=js
```

쿼리에 tag=js 라는 항목이 추가된 것을 확인할 수 있습니다. 만일 같은 key가 여러번 추가되면 append() 메소드는 쿼리에 항목을 여러번 추가합니다.

```jsx
params.append('tag', "tricks");
params.toString(); // mode=night&page=2&mode=day&tag=js&tag=tricks
```

## 6. set

set() 메소드는 매개변수로 전달된 값으로 쿼리 내용을 수정합니다.

```jsx
params.set('page', 3);
params.toString(); // mode=night&page=3&mode=day&tag=js&tag=tricks
```

만일 key가 여려개 존재할 경우 set() 메소드는 다른 항목은 지워버리고 하나로 세팅합니다.

```jsx
params.set('tag', "javascript")
params.toString(); // mode=night&page=3&mode=day&tag=javascript
```

여기서 입력받은 매개변수 key가 쿼리에 존재하지 않는다면 새 항목을 추가합니다.

```jsx
params.set('n',"J") // mode=night&page=3&mode=day&tag=javascript&n=J
```

## 7. entries

entries() 메소드는 쿼리 항목의 key-value 쌍을 루프돌 수 있도록 iterator를 반환합니다.

```jsx
console.log(...params.entries());

for(var [key, value] of params.entries()) {
   console.log(key+ ' => '+ value);
}

// mode => night
// page => 3
// mode => day
// tag => javascript
// n => j
```

## 8. keys

search params의 key 목록을 루프할 수 있는 iterator를 반환합니다.

```jsx
console.log(...params.keys()); // mode page mode tag n
```

## 9. values

search params의 value 목록을 루프할 수 있도록 iterator를 반환합니다.

```jsx
console.log(...params.values()); // night 3 day javascript j
```

## 10. forEach

forEach를 사용하면 params를 루프할 수 있습니다.

```jsx
params.forEach(function(value, key) {
  console.log(key,  value);
});
```

## 11. sort

sort() 메소드는 key-value 쌍을 정렬합니다.

```jsx
params.sort();
params.toString(); // mode=night&mode=day&n=j&page=3&tag=javascript
```

## 12. delete

delete() 메소드로 전달받은 매개변수에 해당하는 모든 항목을 삭제합니다.

```jsx
params.delete('mode');
params.toString(); // name=Jeep&page=3&tag=javascript
```