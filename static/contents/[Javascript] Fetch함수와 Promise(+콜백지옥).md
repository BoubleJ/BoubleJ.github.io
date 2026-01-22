---
date: "2023-12-04"
title: "[Javascript] Fetch함수와 Promise(+콜백지옥)"
categories: ["Javascript"]
summary: "ES6에서 Promise가 도입되어 지금처럼 널리 사용되기 이전에는 주로 콜백 함수를 다른 함수의 인자로 넘겨서 비동기 처리를 코딩을 했었습니다."
thumbnail: "/image/자바스크립트로고.png"
---


## 콜백 함수를 통한 비동기 처리의 문제점

ES6에서 Promise가 도입되어 지금처럼 널리 사용되기 이전에는 주로 콜백 함수를 다른 함수의 인자로 넘겨서 비동기 처리를 코딩을 했었습니다. 

예를 들어, 다음 코드를 보시면 `findUserAndCallBack()` 함수를 호출할 때, 두번째 인자로 콜백 함수가 넘어갑니다. 

그리고 `findUserAndCallBack()` 함수 안에서 인자로 넘어온 콜백 함수가 호출되고 있습니다.

```jsx
findUserAndCallBack(1, function (user) {
  console.log("user:", user);
});

function findUserAndCallBack(id, cb) {
  setTimeout(function () {
    console.log("waited 0.1 sec.");
    const user = {
      id: id,
      name: "User" + id,
      email: id + "@test.com",
    };
    cb(user);
  }, 100);
}
//waited 0.1 sec.
//user: {id: 1, name: "User1", email: "1@test.com"}
```

단순한 코드를 작성할 때는 위와 같이 전통적인 방식으로 콜백 함수를 통해 비동기 처리를 해도 큰 문제가 발생하지 않습니다. 

하지만, 콜백 함수를 중첩해서 연쇄적으로 호출해야하는 복잡한 코드의 경우, 계속되는 들여쓰기 때문에 코드 가독성이 현저하게 떨어지게 됩니다. 

자바스크립트 개발자들 사이에서 소위 콜백 지옥이라고 불리는 이 문제를 해결하기 위해 여러 가지 방법들이 논의 되었고 그 중 하나가 Promise 입니다.

## Promise란?

Promise는 현재에는 당장 얻을 수는 없지만 가까운 미래에는 얻을 수 있는 어떤 데이터에 접근하기 위한 방법을 제공합니다. 당장 원하는 데이터를 얻을 수 없다는 것은 데이터를 얻는데까지 지연 시간(delay, latency)이 발생하는 경우를 말합니다. 

I/O나 Network를 통해서 데이터를 얻는 경우가 대표적인데, CPU에 의해서 실행되는 코드 입장에서는 엄청나게 긴 지연 시간으로 여겨지기 때문에 Non-blocking 코드(코드가 아무것도 안하는 시기)를 지향하는 자바스크립트에서는 비동기 처리가 필수적입니다.

예를 들면, 위에서 봤던 코드는 Promise를 이용해서 아래와 같이 재작성할 수 있습니다.

```jsx
findUser(1).then(function (user) {
  console.log("user:", user);
});
//리턴받은 Promise 객체에 then() 메서드를 호출하여 
//결과값을 가지고 실행할 로직을 넘겨주고 있습니다. 

function findUser(id) {
  return new Promise(function (resolve) {
//콜백 함수를 인자로 넘기는 대신에 Promise 객체를 생성하여 리턴
    setTimeout(function () {
      console.log("waited 0.1 sec.");
      const user = {
        id: id,
        name: "User" + id,
        email: id + "@test.com",
      };
      resolve(user);
    }, 100);
  });
}
//waited 0.1 sec.
//user: {id: 1, name: "User1", email: "1@test.com"}
```

위 코드는 콜백 함수를 인자로 넘기는 대신에 Promise 객체를 생성하여 리턴하였고, 호출부에서는 리턴받은 Promise 객체에 `then()` 메서드를 호출하여 결과값을 가지고 실행할 로직을 넘겨주고 있습니다. 

콜백 함수를 통해 비동기 처리를 하던 기존 코드와 가장 큰 차이점은 함수를 호출하면 Promise 타입의 결과값이 리턴되고, 이 결과값을 가지고 다음에 수행할 작업을 진행한다는 것입니다. 

따라서 기존 스타일보다 비동기 처리 코드임에도 불구하고 마치 동기 처리 코드 처럼 코드가 읽히기 때문에 좀 더 직관적으로 느껴지게 됩니다.

## Promise 생성 방법

먼저 Promise 객체를 리턴하는 함수를 작성하는 방법에 대해서 알아보겠습니다.

Promise는 객체는 `new` 키워드와 생성자를 통해서 생성할 수 있는데 이 생성자는 함수를 인자로 받습니다. 

그리고 이 함수 인자는 `reslove`와 `reject`라는 2개의 함수형 파라미터를 가집니다.

따라서 아래와 같은 모습으로 Promise 객체를 생성해서 변수에 할당할 수 있습니다.

```jsx
const promise = new Promise(function(resolve, reject) { ... } );
```

실제로는 변수에 할당하기 보다는 어떤 함수의 리턴값으로 바로 사용되는 경우가 많고, ES6의 화살표 함수 키워드를 더 많이 사용하는 것 같습니다.

```jsx
function returnPromise() {
  return new Promise((resolve, reject) => { ... } );
}
```

생성자의 인자로 넘어가는 함수 인자의 바디에서는 `resolve()`나 `reject()` 함수를 정상 처리, 예외 발생 여부에 따라 적절히 호출해줘야 합니다. 일반적으로 `resolve()` 함수의 인자로는 미래 시점에 얻게될 결과를 넘겨주고, `reject()` 함수의 인자로는 미래 시점에 발생할 예외를 넘겨줍니다.

예를 들어, 나눗셈 함수를 Promise를 리턴하도록 구현해보겠습니다. (나눗셈을 비동기 처리할 이유는 없지만 이해하기 쉬운 간단한 예시를 위해서…)

```jsx
function devide(numA, numB) {
  return new Promise((resolve, reject) => {
    if (numB === 0) reject(new Error("Unable to devide by 0."));
    else resolve(numA / numB);
  });
}

//그리고 먼저 정상적인 인자를 넘겨 devide() 함수를 호출해서
// Promise 객체를 얻은 후 결과값을 출력해보겠습니다.

devide(8, 2)
  .then((result) => console.log("성공:", result))
  .catch((error) => console.log("실패:", error));
//성공: 4

//이번에는 비정상적인 인자를 넘겨보겠습니다.
devide(8, 0)
  .then((result) => console.log("성공:", result))
  .catch((error) => console.log("실패:", error));`
//실패: Error: Unable to devide by 0.
   // at Promise (<anonymous>:4:20)
   // at new Promise (<anonymous>)
   // at devide (<anonymous>:2:12)
   // at <anonymous>:1:1

```

출력 결과를 통해 정상적인 인자를 넘긴 경우 `then()` 메서드가 호출되고, 비정상적인 인자를 넘긴 경우 `catch()` 메서드가 호출되었다는 것을 알 수 있습니다.

## Promise 사용 방법

실제 코딩을 할 때는 위와 같이 Promise를 직접 생성해서 리턴해주는 코드 보다는 어떤 라이브러리의 함수를 호출해서 리턴 받은 Promise 객체를 사용하는 경우가 더 많을 것입니다.

REST API를 호출할 때 사용되는 브라우저 내장 함수인 `fetch()`가 대표적인데요. (NodeJS 런타임에서는 `node-fetch` 모듈을 설치해야 사용 가능) `fetch()` 함수는 API의 URL을 인자로 받고, 미래 시점에 얻게될 API 호출 결과를 Promise 객체로 리턴합니다. 

network latency 때문에 바로 결과값을 얻을 수 없는 상황이므로 위에서 설명한 Promise를 사용 목적에 정확히 부합합니다.

Promise 객체로 부터 얻게 될 미래 시점의 결과값이나 예외값을 접근하기 위해 사용해 `then()`과 `catch()` 메서드를 사용합니다.

Promise 객체의 `then()` 메소드는 결과값을 가지고 수행할 로직을 담은 콜백 함수를 인자로 받습니다. 그리고 `catch()` 메서드는 예외 처리 로직을 담은 콜백 함수를 인자로 받습니다.

예를 들어, `fetch()` 함수를 이용해서 어떤 서비스의 API를 호출 후, 정상 응답 결과를 출력해보겠습니다.

```jsx
fetch("https://jsonplaceholder.typicode.com/posts/1")
  .then((response) => console.log("response:", response))
  .catch((error) => console.log("error:", error));

// response: Response {type: "cors", url: 
// "https://jsonplaceholder.typicode.com/posts/1", redirected: false, status: 200, ok: true, …}`
```

인터넷 상에서 유효한 URL을 `fetch()` 함수의 인자로 넘겼기 때문에 예외가 발생하지 않고 `then()`에 인자로 넘긴 콜백 함수가 호출되어 상태 코드 200의 응답이 출력되었습니다.

이번에는 `fetch()` 함수의 인자로 아무 URL을 넘기지 않아보겠습니다.

```jsx
fetch()
  .then((response) => console.log("response:", response))
  .catch((error) => console.log("error:", error));

//error: TypeError: Failed to execute 'fetch' on 'Window': 1 argument required, but only 0 present.
   // at main-sha512-G7qgGx8Wefk5JskAfRw2DfBPNPQTxDC23DcZ+KQTmNoSr2S6pZ3IJgYs1ThvLvvH7uI_KhycDx_FIDNlu5KhOw==.bundle.js:9070
   // at <anonymous>:1:1`
```

이번에는 `catch()` 메서드의 인자로 넘긴 콜백 함수가 호출되어 에러 정보가 출력되었음을 알 수 있습니다.

이와 같이 Promise는 `then()`과 `catch()` 메서드를 통해서 동기 처리 코드에서 사용하던 `try-catch` 블록과 유사한 방법으로 비동기 처리 코드를 작성할 수 있도록 해줍니다.

## Promise의 메서드 체이닝(method chaining)

`then()`과 `catch()` 메서드는 또 다른 Promise 객체를 리턴합니다. 그리고 이 Promise 객체는 인자로 넘긴 콜백 함수의 리턴값을 다시 `then()`과 `catch()` 메서드를 통해 접근할 수 있도록 해줍니다. 다시 말하면 `then()`과 `catch()` 메서드는 마치 사슬처럼 계속 연결하여 연쇄적으로 호출을 할 수 있습니다.

예를 들어, 이전 섹션의 `fetch()` 메서드 사용 예제에서 단순히 응답 결과가 아닌 응답 전문을 json 형태로 출력하고 싶은 경우에는 `then()` 메서드를 추가로 연결해주면 됩니다.

```jsx
fetch("https://jsonplaceholder.typicode.com/posts/1")
  .then((response) => response.json())
  .then((post) => console.log("post:", post))
  .catch((error) => console.log("error:", error));

//post: {userId: 1, id: 1, title: 
// "sunt aut facere repellat provident occaecati excepturi optio reprehenderit", 
// body: "quia et suscipit↵suscipit recusandae consequuntur …strum rerum est autem sunt rem eveniet architecto"}`
```

또 다른 예로, 위의 포스팅를 작성한 userId 1을 가진 유저의 데이터가 필요한 경우, 다음과 같이 추가 메서드 체이닝을 할 수 있습니다. 

3번째 줄의 콜백 함수는, `post` 객체에서 `userId` 필드만 추출하여 리턴하고 있으며, 4번째 줄의 콜백 함수는, 이 `userId`를 가자고 유저 상세 조회를 위한 API의 URL을 만들어서 리턴하고 있으며, 5번째 줄의 콜백 함수는, 이 `url`을 가지고 `fetch()` 함수를 호출하여 새로운 Promise를 리턴하고 있습니다.

```jsx
fetch("https://jsonplaceholder.typicode.com/posts/1")
  .then((response) => response.json())
  .then((post) => post.userId)
  .then((userId) => "https://jsonplaceholder.typicode.com/users/" + userId)
  .then((url) => fetch(url))
  .then((response) => response.json())
  .then((user) => console.log("user:", user))
  .catch((error) => console.log("error:", error));

//user: {id: 1, name: "Leanne Graham", username: "Bret", 
// email: "Sincere@april.biz", address: {…}, …}`
```

여기서 주의하실 점은 `then()`과 `catch()`의 인자로 넘긴 콜백 함수는 3, 4번째 줄처럼 일반 객체를 리턴하든 5번째 줄처럼 Promise 객체를 리턴하든 크게 상관이 없다는 것입니다. 

왜냐하면 일반 객체를 리턴할 경우, `then()`과 `catch()` 메소드는 항상 그 객체를 얻을 수 있는 Promise 객체를 리턴하도록 되어 있기 때문입니다.

사실 최근에는 이러한 Promise를 이용해서 계속해서 메서드 체이닝하는 코딩 스타일은 자바스크립트의 `async/await` 키워드를 사용하는 방식으로 대체되고 있는 추세입니다.

콜백대신 쓸 수 있는 Promise 디자인 패턴

```jsx
첫째함수().then(function(){
   그 담에 실행할거
}).then(function(){
   그 담에 실행할거
});
```

옆으로 길어지지 않고 then이라는 키워드 덕분에 뭘 하는지도 파악이 쉬워집니다.