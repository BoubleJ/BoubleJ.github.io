---
date: "2024-06-29"
title: "[키워드 프로젝트] createBrowserRouter 적용"
categories: ["Keyword"]
summary: "리액트 라우팅 방식을 기존 BrowserRouter 에서 createBrowserRouter로 변경해봅시다."
thumbnail: "./리액트라우터아이콘.png"
---

`createBrowserRouter`은 `React router v6.4`에서 새로 나온 라우팅 기법입니다.

새로 나왔다고 마냥 다 좋은 것은 아닙니다. 프로젝트 환경 및 목적에 따라 적용할지 말지를 판단해야합니다.

<br>

> This is the recommended router for all React Router web projects. It uses the DOM History API to update the URL and manage the history stack. <br> -React router 공식문서-

<br>

음 근데 공식문서에 모든 react router 웹 프로젝트에 적용하는 것이 좋다고 하네요?

그럼 적용해야겠군요,,,ㅎㅎ

<br>
<br>

# 적용방법

기존 프로젝트에서 사용하던 BrowserRouter와 createBrowserRouter를 비교해서 확인해보겠습니다.

### 기존 BrowserRouter 적용

```js
// React Router v6에서의 Route 사용 예
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="about" element={<AboutPage />} />
      {/* 추가 Route 정의 */}
    </Routes>
  );
}
```

위 라우팅 구조에 따라 `localhost:8000` 을 예로들어

path: "/": 이 경로는 `localhost:8000` URL에 매칭되어 `<HomePage />` 컴포넌트를 렌더링합니다.

path: "/about": 이 경로는 `localhost:8000/about` URL에 매칭되어 `<AboutPage />` 컴포넌트를 렌더링합니다.

### createBrowserRouter 적용

위 라우팅 구조를 createBrowserRouter 로 적용해보겠습니다.

```js
// React Router v6에서의 createBrowserRouter 사용 예
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    // 여기에 하위 라우트나 로더(loader), 액션(action) 등을 추가할 수 있습니다.
  },
  {
    path: "about",
    element: <AboutPage />,
  },
  // 추가 라우트 정의
]);

function App() {
  return <RouterProvider router={router} />;
}
```

createBrowserRouter는 라우터 구성을 객체 형태로 선언적으로 만들 수 있게 해주며, route에 대한 상세한 정의와 route에 대한 여러 가지 추가 설정을 할 수 있습니다.

<br>
<br>

## 중첩 라우팅

BrowserRouter과 마찬가지로 중첩 라우팅을 구현할 수 있습니다.

```js
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "team",
        element: <Team />,
      },
    ],
  },
]);
```

children 요소를 이용해 중첩 라우팅을 구현할 수 있습니다. `/team` 경로의 `<Team />`는 `/` 경로 `<Root />` 의 자식요소가 됩니다.

### Outlet

BrowserRouter와 동일하게 `<Outlet/>` 컴포넌트를 사용할 수 있습니다. 위 코드에서는 `<Team />` 컴포넌트가 `<Outlet/>` 역할을 하겠죠?

<br>
<br>

# 왜 좋은걸까요?

여기까진 별다른 차이가 없어보입니다. 하지만 여기서 끝내버리면 createBrowserRouter를 적용한 의미가 없어집니다. 적어도 왜 좋은지는 알고 넘어가보도록 합시다.

이번주 목요일에 프론트엔드 면접을 봤는데 프로젝트 기능 구현 부분에서 왜 적용했는지 어떤 원리인지 정확하게 인지하고 있는지 많이 물어보시더군요.

그 동안 기능구현하고 대충 넘어가는 주먹구구식으로 공부해왔는데 지금껏 수박 겉핥기 식으로 공부하고 있었구나 많이 반성하게 되는 시간이었습니다.

앞으로는 한 가지 기능을 추가하더라도 왜 추가하는지 어떠 원리로 적용되는지 정확하게 인지하고 넘어가도록 하겠습니다.

<br>

## Data API

> It also enables the v6.4 data APIs like loaders, actions, fetchers and more. <br> -React router 공식문서-

loader, action, fetchers 등과 같은 Data API를 사용할 수 있다고 합니다.

Data API가 뭔지 간단하게 알아보도록합시다.

### loaders

각 경로에 loader 함수를 정의해 라우팅 전 데이터를 제공할 수 있는 기능입니다.

```js
createBrowserRouter([
  {
    element: <Teams />,
    path: "teams",
    loader: async () => {
      return fakeDb.from("teams").select("*");
    },
    children: [
      {
        element: <Team />,
        path: ":teamId",
        loader: async ({ params }) => {
          return fetch(`/api/teams/${params.teamId}.json`);
        },
      },
    ],
  },
]);
```

위 코드를 보시면 각 경로마다 라우팅 전 비동기함수 호출을 통해 return한 데이터를 렌더링할 때 사용하도록 처리되어있습니다.

위와 같은 설정을 통해 각 페이지를 load하기 전부터 loader를 통해서 에러, 혹은 데이터 처리를 수행할 수 있습니다.

### action

다음은 action Data API입니다.

```js
<Route
  path="/song/:songId/edit"
  element={<EditSong />}
  action={async ({ params, request }) => {
    let formData = await request.formData();
    return fakeUpdateSong(params.songId, formData);
  }}
  loader={({ params }) => {
    return fakeGetSong(params.songId);
  }}
/>
```

action 함수는 폼 제출이나 기타 데이터 변경 작업을 처리합니다.

위 코드에서 action 함수는 비동기 함수로, params와 request 객체를 인자로 받습니다.

- params: URL 파라미터를 포함하는 객체입니다. 여기서는 params.songId를 통해 songId를 접근할 수 있습니다.

- request: 요청 객체로, 폼 데이터나 기타 요청 데이터를 포함합니다.

- request.formData()를 사용하여 폼 데이터를 추출하고 formData 변수에 할당합니다.

그리고 fakeUpdateSong 함수를 호출하여 songId와 폼 데이터(formData)를 사용해 서버에 데이터를 업데이트합니다.

### 라우팅 전 loader는 데이터 읽기 작업(get요청)을 처리하고, actions은 데이터 변경 작업(post, put, patch 요청)을 처리한다고 보면 될 것 같습니다.

<br>
<br>

## 장점

그럼 페이지가 로드 되기 전 위와 같은 처리를 하는 것이 어떠한 이점을 가져다 주는걸까요??

### 1. 빠른 초기 로딩

loader는 페이지가 로드되기 전에 필요한 데이터를 미리 가져오기 때문에 사용자에게 빠른 로딩 경험을 선사합니다.

### 2. 단순화된 비동기 처리

비동기 데이터 페칭과 상태 관리를 라우터 레벨에서 처리하여 코드가 단순해집니다.

또한 loader와 action에서 발생하는 에러를 라우터 레벨에서 처리할 수 있어, 에러 핸들링이 일관되고 중앙 집중화됩니다.

### 3. 데이터 일관성

action을 통해 데이터를 변경한 후, loader를 다시 호출하여 최신 데이터를 가져올 수 있고,

컴포넌트가 렌더링될 때 필요한 모든 데이터가 이미 준비되어 있어 데이터 일관성을 유지할 수 있습니다.

### 4. SEO 및 접근성

loader를 사용하면 서버 사이드 렌더링 시에도 데이터를 미리 가져올 수 있어, 검색 엔진이 페이지를 크롤링할 때 완전한 데이터를 제공할 수 있습니다.

이는 SEO(검색 엔진 최적화)에 유리합니다.

### 5. 사용자 인터랙션 최적화

빠른 피드백과 비동기 UI 관리를 통해 더 나은 사용자 경험을 제공합니다.

<br>
<br>

이러한 장점들이 있다고 합니다. 나름 채신 문법이고 공식문서에서 앵간해선 좋다고 하니 적용하는 것이 mz스럽고 좋아보입니다.

<br>
<br>
<br>

# 실제 적용

이제 실제로 적용해봐야겠죠??

```tsx
//App.tsx

import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, Navigate } from "react-router-dom";
import KeywordInput from "components/feature/filter/KeywordInput";
import NotFound from "components/pages/NotFound";
import SearchPage from "components/pages/SearchPage";
import Layout from "Layout";
import CategoryList from "components/feature/filter/CategoryList";

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate replace to="/categories" />} />
          <Route path="/" element={<SearchPage />}>
            <Route path="keyword" element={<KeywordInput />} />
            <Route path="categories" element={<CategoryList />}>
              <Route path=":categoryId" element={<></>} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
```

<br>

```tsx
//main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "App.tsx";
import { Provider } from "react-redux";
import store from "store/store.js";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GlobalStyles } from "styles/GlobalStyle";
export type RootState = ReturnType<typeof store.getState>;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 0,
      retry: 0,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <GlobalStyles />
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
```

BrowserRouter로 라우팅 구성한 제 프로젝트입니다.

라우팅 방식을 createBrowserRouter로 변경하면 다음과 같이 작성해야합니다.

```tsx
//App.tsx

import "bootstrap/dist/css/bootstrap.min.css";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import KeywordInput from "components/feature/filter/KeywordInput";
import SearchPage from "components/pages/SearchPage";
import Layout from "Layout";
import CategoryList from "components/feature/filter/CategoryList";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <SearchPage />
      </Layout>
    ),
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        loader: async () => redirect("/categories"),
      },
      {
        path: "categories",
        element: <CategoryList />,
        children: [
          {
            path: ":categoryId",
            element: <></>,
          },
        ],
      },
      {
        path: "keyword",
        element: <KeywordInput />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
```

```tsx
//main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "App.tsx";
import { Provider } from "react-redux";
import store from "store/store.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GlobalStyles } from "styles/GlobalStyle";
export type RootState = ReturnType<typeof store.getState>;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3000,
      gcTime: 0,
      retry: 0,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <GlobalStyles />
      <Provider store={store}>
        <App />
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>,
);
```

<br>

변화된 점은 다음과 같습니다.

### 1. main.tsx 파일 내 BrowserRouter 제거

이제 App.tsx 파일에서 라우팅을 설게하기 때문에 `BrowserRouter`를 제거했습니다.

<br>

### 2. App.tsx 파일 createBrowserRouter 적용

위에 작성한 예제 코드를 기반으로 제 프로젝트에 `createBrowserRouter`를 적용해보았습니다.

<br>

### 3. Layout컴포넌트 children 구현

Layout컴포넌트는 children 요소를 가지고 있기 때문에

```tsx
 <Layout>
      <SearchPage />
    </Layout>,
```

다음과 같이 컴포넌트 구조를 작성해줬습니다.

<br>

### 4. redirect 메서드 적용

홈페이지 접속하면 자동으로 `/categories` 경로로 리다이렉트 시키기 위해 `redirect` 메서드를 사용하였습니다.

```tsx
 {
    path: "/",
    element: <Layout>
      <SearchPage />
    </Layout>,
    children: [
      {
        index: true,
        loader: async () => redirect('/categories'),
    },

```

<br>

### 5. 404 페이지 적용

```tsx
{
    path: "/",
    element: <Layout>
      <SearchPage />
    </Layout>,
    errorElement: <NotFound />,
    }

```

errorElement 속성을 이용해 404 페이지도 정상적으로 구현했습니다.

<br>
<br>
<br>

<details>

<summary>출처</summary>

<div markdown="1">

https://velog.io/@adultlee/createBrowserRouter%EB%A5%BC-%ED%86%B5%ED%95%9C-Router%EA%B8%B0%EB%8A%A5-%EC%B6%94%EA%B0%80

https://reactrouter.com/en/main/routers/create-browser-router

https://velog.io/@dolfin/react-react-router-v6.4-createBrowserRouter-outlet

</div>

</details>
