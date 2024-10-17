---
date: "2024-10-17"
title: "[Next.JS] Next.JS 라우팅 방식"
categories: ["Next.JS"]
summary: "Next.JS 라우팅 방식을 알아봅시다."
thumbnail: "./NEXT.png"
---

2024년 기준 next.js 14 버전은 앱라우팅 방식을 채택하고 있습니다. 

그렇다면 어떤 방식으로 앱라우팅이 구현되고 왜 앱라우팅 방식을 채택했는지 알아봅시다. 

# CSR & SSR 라우팅 차이점

SSR을 채택한 Next.js 의 라우팅 방식을 알아보기 위해 먼저 CSR과 SSR의 차이점을 알아볼 필요가 있습니다.

## CSR (Client Side Rendering)

말그대로 클라이언트에서 렌더링된다는 뜻입니다. 

리액트를 써보신 분들은 아시겠지만 리액트 프로젝트 속 서버에서 받아오는 `html`은 단 하나입니다. 

```js
<div id='root'></div>
```
위와 같이 텅빈 div 태그하나만 달랑 가지고 오죠. 

`html`이 하나기 때문에 서버로 요청하는 `Endpoint (path)`가 단 하나일 수 밖에 없습니다. 

`html`을 `응답(response)`하고 html 내부의 스크립트를 통해 번들링된 자바스크립트 파일을 가져오는 형식으로 렌더링을 진행하죠.


## SSR (ServerSide Rendering)

서버사이드 렌더링은 반대로 서버에서 html을 만든 뒤 클라이언트로 보내주는 형태입니다. 

SSR은 HTML이 여러개이기 때문에 `Endpoint (path)`도 여러 개 입니다. 

> 물론 CSR도 여러 개의  endpoint(path)를 가질 수 있습니다. <BR> 지금은 보편적인 경우를 기반으로 설명하겠습니다. 

즉 path가 여러개로 나눠었다는 것이 CSR과의 차이점입니다. 

그에 반해 CSR은 path가 하나이기 때문에 selecting 할 필요가 없습니다. 

SSR은 path가 여러개이기 때문에 `selecting process` 과정을 거쳐야합니다.

여기서 말하는 `selecting process`가 바로 라우팅입니다. 


# 라우팅 방식 종류

## 1. 명시적 라우팅

리액트의 `React-Router` 라이브러리가 대표적입니다. 

```js
<Route path='/' components={<Home/>}>
<Route path='/about' components={<About/>}>
<Route path='/detail' components={<Datail/>}>
```

path와 매핑되는 컴포넌트를 명시적으로 구현한 형태입니다. 


## 코드 기반 라우팅

express 라이브러리가 대표적입니다.


```js
app.get('/', (req, res) =>{ 
    res.send('homepage~~')
})
```

/ path값으로 요청을 보내면 응답으로 'homepage~~' 이라는 json 타입이 반환되죠.



그 외 데코레이터 기반 라우팅 방식도 있습니다. 



## 파일구조 기반

파일구조 기반 라우팅이 바로 next.js에서 채택한 라우팅 기법입니다. 


### page라우팅 방식

next.js 12이전 버전에선 page 라우팅 기법을 채택했죠.

`about.jsx` 가 있으면 이 파일 자체가 주소가 됩니다. 

즉 브라우저가 `localhost:3000/about` 이라고 요청을 보내면 next.js를 띄운 앱에서 `about.jsx` 파일을 응답해줍니다.

매우 직관적이라는 장점이 있습니다.


### app 라우팅 방식

next.js 13이후 버전에선 **app 라우팅 기법**을 채택했습니다.

`app`이라는 디렉토리 내부에 폴더를 만들고 폴더 내부에 `page.tsx` 파일을 만들면 `page.tsx` 컴포넌트가 응답가는 페이지가 됩니다. 

`about`이라는 디렉토리 내부에 `page.tsx` 컴포넌트가 있다면 

`localhost:3000/about`으로 요청을 보내면 next.js를 띄운 앱에서 `page.tsx` 파일을 응답해줍니다. 

### 따지고보면 page라우팅이 더 직관적인데 바꾼 이유가 뭘까?

바로 디렉토리 내부에 `layout.tsx`, `template.tsx`, `error`, `loading` 등등 추가하는 경우가 있기 때문입니다.

이런것들을 쉽게 사용할 수 있도록 추상화 해놓은 파일 컨벤션이 존재한다는 의미죠.

### app 라우팅의 장점

1. 직관적
2. 추상화를 통해 쉽게 사용 가능
3. path가 디렉토리별로 자동으로 나눠져있기 때문에 자동 코드 스플리팅
4. 콜로케이션(같은 맥락에 사용되는 코드들을  같은 위치에 두자 라는 원칙) -> 유지보수가 쉬워지고 명확한 프로젝트 구조 형성


<br>
<br>
<br>

<details>

<summary>참고문헌</summary>

<div markdown="1">

https://www.youtube.com/watch?v=S5Rl3EtBaA0&list=PLpq56DBY9U2AyFtF0ajuFZX3IGgDIXgcb&index=2

</div>

</details>