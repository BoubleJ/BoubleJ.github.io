---
date: "2024-05-26"
title: "[키워드 프로젝트] localhost:5173 리다이렉트"
categories: ["Keyword"]
summary: "localhost:5173 페이지가 불필요해 리다이렉트를 구현했습니다."
thumbnail: "./리액트리다이렉트.png"
---

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
          <Route path="/" element={<SearchPage />}>
            <Route path="keyword" element={<KeywordInput />}></Route>
            <Route path="categories" element={<CategoryList />}>
              <Route path=":categoryId" element={<></>}></Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </Layout>
    </>
  );
}
```

현재 리액트 프로젝트 라우팅 구조입니다.

`http://localhost:5173` 페이지가 필요없어 리다이렉트를 아래와 같이 구현했습니다.

```tsx
//App.tsx

      <Layout>
        <Routes>
          <Route path="/" element={<Navigate replace to="/categories" />} />
          <Route path="/categories" element={<CategoryList />}>
            <Route path=":categoryId" element={<></>} />
          </Route>
          <Route path="keyword" element={<KeywordInput />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </>

export default App;
```

# 문제점

`<Route path="/" element={<Navigate replace to="/categories" />} />`

크게 어렵지 않을 줄 알았습니다. 위 코드처럼 / 경로에 할당된 컴포넌트를 `Navigate` 로 리다이렉트 시켜주면 되는 줄 알았습니다.

하지만 생각해보니 문제점이 있었습니다.

현재 / 주소는 `SearchPage.tsx` 컴포넌트를 렌더링하고 있습니다. 그리고 `SearchPage.tsx` 컴포넌트 내부에는 Outlet 컴포넌트가 존재하고 이는 각각 url이 categoreis, keyword 경로로 이동할 때마다 `<KeywordInput />`, `<CategoryList />` 를 렌더링합니다.

<br>

```tsx
<Layout>
  <Routes>
    <Route path="/" element={<Navigate replace to="/categories" />} />
    <Route path="/categories" element={<CategoryList />}>
      <Route path=":categoryId" element={<></>} />
    </Route>
    <Route path="keyword" element={<KeywordInput />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</Layout>
```

위 코드처럼 구현하면 / 경로인 `SearchPage.tsx` 컴포넌트가 사라지게 됩니다. 즉 / 주소 접속 시 렌더링되는 컴포넌트는 `<Layout>` 가 전부입니다. 이 상태에서 리다이렉트가 일어나 /categories 페이지로 이동하면서

`<Route path="/categories" element={<CategoryList />}>` 라우팅 설정에 의해

`<Outlet />` 위치에 `<CategoryList />` 가 렌더링되게 됩니다.

즉 리다이렉트는 되지만 렌더링 되는 페이지는

```tsx
<Layout>
  <CategoryList />
</Layout>
```

가 됩니다. 이는 제가 원하는 결과가 아닙니다.

# 해결

```tsx
//App.tsx

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate replace to="/categories" />} />
          <Route path="/" element={<SearchPage />}>
            <Route path="keyword" element={<KeywordInput />} />
            <Route path="categories" element={<CategoryList />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </>
  );
}
```

라우팅 구조를 수정함으로써 해결했습니다.

` <Route path="/" element={<Navigate replace to="/categories" />} />` 를 통해 리다이렉트를 구현하고

`<Route path="/" element={<SearchPage />}>` 별도로 / 경로에 `<SearchPage />` 컴포넌트를 할당해줍니다. 그리고 `<Outlet />` 위치에 `<CategoryList />` 컴포넌트를 렌더링하도록 하였습니다.

즉 / 경로는 `<SearchPage />` 가 할당되어 존재하지만 리다이렉트 되기 때문에 렌더링되지는 않습니다. `<Outlet />` 자식 라우트를 렌더링하는 구조를 유지하기 위해 위와 같이 설계했습니다.

<br>
<br>

# 결과

![리다이렉트구현](리다이렉트구현.gif)

정상적으로 동작합니다!
