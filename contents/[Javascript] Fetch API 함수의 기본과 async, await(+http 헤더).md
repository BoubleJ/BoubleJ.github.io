---
date: "2023-02-28"
title: "[Javascript] Fetch API 함수의 기본과 async, await(+http 헤더)"
categories: ["Javascript"]
summary: "Fetch API는 HTTP 파이프라인을 구성하는 요청과 응답 등(GET, POST 요청 등등)의 요소를 JavaScript에서 접근하고 조작할 수 있는 인터페이스를 제공합니다."
thumbnail: "./자바스크립트로고.png"
---







Fetch API는 HTTP 파이프라인을 구성하는 요청과 응답 등(GET, POST 요청 등등)의 요소를 JavaScript에서 접근하고 조작할 수 있는 인터페이스를 제공합니다. 

Fetch API가 제공하는 전역 `[fetch()](https://developer.mozilla.org/ko/docs/Web/API/fetch)` 메서드로 네트워크의 리소스(백엔드 API 등)를 쉽게 비동기적(async, await 등 활용)으로 취득할 수도 있습니다.

참고로

```jsx
const logJSONData = async () {
  const response = await fetch("http://example.com/movies.json");
  const jsonData = await response.json();
  console.log(jsonData);
}

async function logJSONData() {
  const response = await fetch("http://example.com/movies.json");
  const jsonData = await response.json();
  console.log(jsonData);
}

//두 코드는 같은 코드다. 
```

```jsx
//기본예제

async function logJSONData() {
  const response = await fetch("http://example.com/movies.json");
  const jsonData = await response.json();
  console.log(jsonData);
}
//네트워크를 통해 JSON 파일을 취득해서 콘솔에 출력
```

가장 단순한 형태의 `fetch()`는 가져오고자 하는 리소스의 경로를 나타내는 하나의 인수(위 코드의 경우 "http://example.com/movies.json" 이 url 주소가 된다.) 만 받습니다.

응답은 `[Response](https://developer.mozilla.org/ko/docs/Web/API/Response)` 객체로 표현되며, JSON 응답 본문을 바로 반환하지는 않습니다. 

즉

console.log(response) 하면 데이터가 출력되지 않는다. 

왜냐하면

fetch 로 인해 반환되는 값은 데이터가 아닌, Promise로 감싸져 있는 Response 객체 이기 떄문. 

그리고 이 Reponse 객체는 json 이라는 메소드를 가지고 있는데, 이 메소드를 실행 시켜야 비로서 우리가 원하는 데이터가 Promise 에 감싸져서 나오게 됩니다.

## **요약**

전체 플로우를 도식화 하면 아래와 같습니다.

1. fetch 요청
2. Promise<Response> 가 반환 됨
3. Response 를 꺼냄 (Promise 패턴 혹은 async await 패턴)
4. Response 의 json 메소드를 실행
5. Promise<data> 가 반환 됨
6. data를 꺼냄

실제 활용 예시 (프레임워크는 NEXT.JS)

```jsx

//이 코드는 next.js 서버에서 'http://localhost:8080/oauth/loginInfo 이 주소의 스프링서버로 
//get요청을 하는 코드이다. 
//위치는 next 서버

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
// 매개변수 request
//async는 GET 함수 내부에서 실행되는 내용은 async로 실행되라는 뜻.
    console.log(request.headers)
//여기서 request.headers는 next 브라우저에서 요청받은 header다. 즉 next 브라우저에서 get요청하면 
//http 형식으로 요청(request)이 오는데 이 요청안에 다양한 것들이 있고 그중 header를 출력하라는 뜻. 
    const res = await fetch('http://localhost:8080/oauth/loginInfo', {
//await는 async로 실행되는 와중에 await를 설정한 작업은 마무리될 때까지 기다리라는뜻.
//res 함수는 백엔드에서 데이터를 요청하는 fetch 함수작업이 끝날때까지(데이터를 다 불러올때까지)
//기다려라. -> 다른 일 하고있어라. 근데 이 데이터를 사용하는 작업은 하지말아라 라는 뜻.
        method: 'GET',
        headers: request.headers,
    })
//이 부분은 fetch에 대한 옵션 -> method는 get요청, 필요한 데이터는 request의 헤더(request.headers)

    if (res.ok) {
        const bodyText = await res.text()
        console.log(bodyText)
      
        return NextResponse.json({ bodyText })
    }
}
//여기서 catch를 안쓴이유. catch는 오류시 동작하는 함수 -> 즉 뭐가되었건 데이터를 받아왔다면 catch가
//실행되지 않는다. 근데 if(res.ok) -> 제대로 된 데이터가 들어왔을 경우  const bodyText = await res.text()
//를 실행해라 라는 뜻. 

```

```jsx
const onClickGetInfo = async () => {
        const res = await fetch('http://localhost:3000/apitest/api')
//async await를 썼으므로 'http://localhost:3000/apitest/api'에서 데이터를 다 받아온 후
//console.log(res)를 실행한다. res 데이터를 쓰는 작업이니까!

        console.log('res')
        console.log(res.text)
      //'http://localhost:3000/apitest/api 에서 데이터를 요청하고 그 값을 console에 출력한다.
    }

    return (
        <>
            <div className="m-10">
                <h1> Firebase 사용하기</h1>
                <button onClick={onClickGetInfo}>firebase에 입력하기 </button>
{/* 버튼 클릭시 onClickGetInfo 함수가 실행된다. */}
            </div>

```

---

```jsx
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const res = await fetch(
            'https://api.epicktrees.net/api/product/accommodation/all',
        )
        await setTimeout(() => {
            console.log('after')
        }, 500);
        console.log('기다려줌')
        console.log(res)
    
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

//출력 결과값
- wait compiling...
- event compiled successfully in 279 ms (1342 modules)
기다려줌
// console.log('기다려줌')에 의해 실행. 
// 비동기 함수니까 시간이 오래걸리는 
 //const res = await fetch(
      //      'https://api.epicktrees.net/api/product/accommodation/all',
     //   )
     //   await setTimeout(() => {
     //       console.log('after')
     //   }, 500);
//이 함수들은 일단 다른 곳(Web API)에서 처리하게하고 

Response {
  [Symbol(realm)]: { settingsObject: {} },
  [Symbol(state)]: {
    aborted: false,
    rangeRequested: false,
    timingAllowPassed: false,
    requestIncludesCredentials: false,
    type: 'default',
    status: 200,
    timingInfo: null,
    cacheState: '',
    statusText: '',
    headersList: HeadersList {
      cookies: null,
      [Symbol(headers map)]: [Map],
      [Symbol(headers map sorted)]: null
    },
    urlList: [],
    body: { stream: undefined, source: [Uint8Array], length: 97018 }
  },
  [Symbol(headers)]: HeadersList {
    cookies: null,
    [Symbol(headers map)]: Map(10) {
      'cache-control' => [Object],
      'connection' => [Object],
      'content-type' => [Object],
      'date' => [Object],
      'expires' => [Object],
      'pragma' => [Object],
      'transfer-encoding' => [Object],
      'vary' => [Object],
      'x-content-type-options' => [Object],
      'x-xss-protection' => [Object]
    },
    [Symbol(headers map sorted)]: null
  }
}
//  console.log(res) 실행 -> 왜 이건 정상적으로 출력됐느냐. 위 fetch 함수에 await를 걸어놨기 때문
// await는 res 데이터를 다 불러들여오면 실행하고 그 전에는 대기하라는 뜻이니까.
- error TypeError: Cannot read properties of undefined (reading 'headers')
    at eval (webpack-internal:///(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.js:266:61)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
//에러는 잘 모르겠음 생략

after
// 마지막 setTimeout()에 의해 5초 뒤 console.log('after') 실행 
```