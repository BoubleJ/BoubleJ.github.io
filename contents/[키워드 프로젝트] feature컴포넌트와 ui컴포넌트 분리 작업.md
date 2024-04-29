---
date: "2024-04-29"
title: "[키워드 프로젝트] feature컴포넌트와 ui컴포넌트 분리 작업"
categories: ["Keyword"]
summary: "비즈니스 로직과 ui 컴포넌트 분리작업을 통해 클린코드에 조금이라도 근접해봅시다."
thumbnail: "./reacticon.png"
---

# 리팩토링 리스트 분석

프로젝트의 윤관이 잡힌 후 리팩토링을 하면서 컴포넌트 분리 작업을 하려했으나.. 테스트코드 도입과정에서 코드가 너무 개판이라는 것을 깨닫고 일단 이거부터 손봐야겠더라구요...

가장 문제인 SearchPage.tsx 의 코드입니다.

```tsx
import { useState } from "react";
import CustomCalendar from "components/feature/filter/CustomCalendar";
import styled from "styled-components";
import { useSelector } from "react-redux";
import Result from "components/feature/result/Result";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { RootState } from "main";
import ItemSearchCount from "components/feature/filter/ItemSearchCount";
import PriceRange from "components/feature/filter/PriceRange";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import EmptyResult from "components/feature/result/EmptyResult";

const SearchResultWord = styled.p`
  margin-top: 10px;
  font-size: var(--font-size-medium);
  font-weight: bold;
`;

const FilterBox = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #f5f8fb;
  padding-top: 40px;
  width: 100%;
`;

const Input = styled.input`
  border-radius: 10px;
  width: 97px;
  height: 41px;
  border-color: #bdbdbd;
  border-style: solid;
  border-width: 2px;
  padding-left: 8px;
  font-weight: 500;
  font-size: var(--font-size-primary);
  box-shadow: 0px 4px 10px 0px gray;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const InquiryButton = styled.button`
  border-radius: 10px;
  color: white;
  font-size: 15px;
  margin-top: 40px;
  padding: 0px 10px;
  width: 100px;
  font-weight: bold;
  height: 41px;
  border: none;
  background-color: var(--Gray700);
`;

export default function SearchPage() {
  const [resultVisible, setResultVisible] = useState(false);
  const { error, data, refetch, isFetching } = useQuery({
    queryKey: ["repoData"],
    queryFn: async () => {
      const res = await axios.get(url);
      console.log(res.data);
      return res.data;
    },
    refetchOnWindowFocus: false,
    enabled: false,
  });

  const navigate = useNavigate();

  const handleButtonClick = () => {
    // 쿼리 문자열 업데이트
    history.push("/watch?v=46YNAP5Gg3k");
  };

  const problemData = data;

  let pathName: string | number = "";

  const keywordInputValue = useSelector(
    (state: RootState) => state.queryString.pathName
  );

  const { pathname } = useLocation();
  // console.log(pathname);
  const slug = pathname.split("/")[2];
  // console.log(slug);

  if (slug == undefined) {
    pathName = keywordInputValue;
  } else if (typeof slug == "string") {
    pathName = Number(slug);
  }

  const [maxPrice, setMaxPrice] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [searchSize, setSearchSize] = useState("");

  const date = useSelector((state: RootState) => state.queryString.date);

  const startDate = date.startDate.split("T")[0];
  const startDateByLos = new Date(date.startDate.split("T")[0]);

  const endDate = new Date(date.endDate.split("T")[0]);

  const differenceMs = Math.abs(endDate.valueOf() - startDateByLos.valueOf());

  const los = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

  const searchSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchSize(e.target.value);
  };

  let url = "";
  if (typeof pathName == "string") {
    url = `http://localhost:3000/api/v1/keyword?q=${pathName}${
      startDate ? `&startDate=${startDate}` : ""
    }&${los ? `&los=${los}` : ""}${minPrice ? `&minPrice=${minPrice}` : ""}${
      maxPrice ? `&maxPrice=${maxPrice}` : ""
    }${searchSize ? `&searchSize=${searchSize}` : ""}`;
  } else if (typeof pathName == "number") {
    url = `http://localhost:3000/api/v1/categories/${pathName}?${
      startDate ? `&startDate=${startDate}` : ""
    }&${los ? `&los=${los}` : ""}${minPrice ? `&minPrice=${minPrice}` : ""}${
      maxPrice ? `&maxPrice=${maxPrice}` : ""
    }${searchSize ? `&searchSize=${searchSize}` : ""}`;
  }

  const handleSearch = () => {
    if (pathName == "") {
      console.log("keyword를 입력하세요");
    } else {
      setResultVisible(true);
      refetch();
    }
  };

  return (
    <>
      <Outlet context={{ isFetching }} />
      <FilterBox>
        <CustomCalendar />
        <ItemSearchCount isFetching={isFetching} />
        <PriceRange
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          isFetching={isFetching}
        />

        <InquiryButton
          disabled={isFetching}
          onClick={() => {
            handleSearch();
          }}
        >
          {isFetching ? "로딩중.." : "상품조회"}
        </InquiryButton>
      </FilterBox>

      <Input
        placeholder="상품 검색 개수"
        type="number"
        name="itemSize"
        value={searchSize}
        onChange={searchSizeChange}
        disabled={isFetching}
      />
      <button
        onClick={() => {
          navigate("/category?v=46YNAP5Gg3k");
        }}
      >
        어바웃 페이지로 이동하기
      </button>
      <SearchResultWord>상품 검색 결과</SearchResultWord>

      {resultVisible ? (
        <Result
          problemData={problemData}
          error={error}
          isFetching={isFetching}
        />
      ) : (
        <EmptyResult />
      )}
    </>
  );
}
```

네.. 코드가 말도 안되게 깁니다. 제가 대규모 프로젝트를 하는거면 모르겠지만 정말 간단한 프로젝트인데 이 정도 길이의 코드가 나왔다는건 제가 생각없이 코드를 짰다는 의미입니다. 반성하고 리팩토링을 시작해보겠습니다.

리액트 컴포넌트의 핵심 개념 중 하나는 1개의 컴포넌트는 1가지 일만 한다는 것 입니다.

ui를 렌더링하는 컴포넌트는 ui를 띄우는 작업만하고, api를 호출하는 컴포넌트는 api만 호출해야합나디.

하지만 제 코드를 보면 React-Query도 있고 ui도 띄우고 url을 정의하고... 온갖 기능이 짬뽕되어있습니다. 프론트인원이 저밖에 없어서 다행이지 협업하는 동료가 있었다면 전 이미 오함마로 후두부를 가격당했을 것 입니다.

<br>
<br>

## 1. React-Query 호출 로직 분리

일단 api 호출 로직을 분리해봅시다.

```ts
//api/route.ts

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const FetchData = (url) => {
  const { error, data, refetch, isFetching } = useQuery({
    queryKey: ["repoData"],
    queryFn: async () => {
      const res = await axios.get(url);
      console.log(res.data);
      return res.data;
    },
    refetchOnWindowFocus: false,
    enabled: false,
  });
  return { error, data, refetch, isFetching };
};

export default FetchData;
```

제 프로젝트에서 api를 호출하는 2개밖에 없습니다. 심지어 이 2개조차 단순 get 요청이고 구조는 똑같아서 하나의 로직으로 사용하고 url만 매개변수로 전달받게 했습니다.

```tsx
//SearchPage.tsx

import FetchData from "api/route";

//생략...

let url = "";
if (typeof pathName == "string") {
  url = `http://localhost:3000/api/v1/keyword?q=${pathName}${
    startDate ? `&startDate=${startDate}` : ""
  }&${los ? `&los=${los}` : ""}${minPrice ? `&minPrice=${minPrice}` : ""}${
    maxPrice ? `&maxPrice=${maxPrice}` : ""
  }${searchSize ? `&searchSize=${searchSize}` : ""}`;
} else if (typeof pathName == "number") {
  url = `http://localhost:3000/api/v1/categories/${pathName}?${
    startDate ? `&startDate=${startDate}` : ""
  }&${los ? `&los=${los}` : ""}${minPrice ? `&minPrice=${minPrice}` : ""}${
    maxPrice ? `&maxPrice=${maxPrice}` : ""
  }${searchSize ? `&searchSize=${searchSize}` : ""}`;
}

const { error, data, refetch, isFetching } = FetchData(url);

const problemData = data;

//생략...
```

한결 코드가 가벼워졌습니다. 물론 아직 갈길이 멉니다.

<br>

## 2. 달력 비즈니스 로직 분리

```tsx
//SearchPage.tsx

//생략..

const date = useSelector((state: RootState) => state.queryString.date);

const startDate = date.startDate.split("T")[0];
const startDateByLos = new Date(date.startDate.split("T")[0]);

const endDate = new Date(date.endDate.split("T")[0]);

const differenceMs = Math.abs(endDate.valueOf() - startDateByLos.valueOf());

const los = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

//생략..
```

달력 날짜를 선택하면 쿼리스트링으로 전달할 형식에 맞게 변환하는 코드인데 이 로직이 `SearchPage.tsx` 컴포넌트에 존재합니다. 달력컴포넌트에서 처리 후 받아오는 것으로 바꿔줍시다.

```tsx
//CustomCalendar.tsx

//생략..

export default function CustomCalendar() {
  const CalculateDateGap = (startDate, endDate) =>{
return Math.abs(startDate.valueOf() - endDate.valueOf());
  }

  const onCalendarClose = () => {
    if (isValuePieceArray(value)) {

const startDate = value[0]?.toISOString().split("T")[0]

  const differenceMs = CalculateDateGap(value[0], value[1])

  const los = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
console.log('startDate', startDate)
  console.log('los', los)

      dispatch(
        dateFetch({
          startDate: startDate,
          endDate: los,
        })
      );
    }
  };

  //생략..

```

달력 컴포넌트를 닫으면 쿼리스트링으로 넘겨줄 값들을 자동으로 계산하도록 로직을 수정했습니다.

```tsx

  dispatch(
        dateFetch({
          startDate: startDate,
          endDate: endDate,
        })

```

초기 redux는 시작날짜값, 끝날짜을 전역으로 사용하게 설게했는데 두 날짜 사이 차이값을 달력컴포넌트에서 계산했으니 차이값을 전역으로 전달하는 방법으로 수정해야겠군요.

<br>

```tsx
//fetchSlice.tsx

interface Date {
  startDate: string;
  los: number;
}

export const FetchSlice = createSlice({
  name: "queryString",
  initialState: {
    pathName: "",
    date: { startDate: "", los: 0 },
  },
  reducers: {
    pathNameFetch: (state, action: PayloadAction<string>) => {
      state.pathName = action.payload;
    },
    dateFetch: (state, action: PayloadAction<Date>) => {
      state.date = action.payload;
    },
  },
});
```

redux 전역 객체의 값이 바뀜에 따라 타입과 초기값도 수정해줬습니다.

```tsx
//SearchPage.tsx

//생략...

const { startDate, los } = useSelector(
  (state: RootState) => state.queryString.date
);

//생략...

let url = "";
if (typeof pathName == "string") {
  url = `http://localhost:3000/api/v1/keyword?q=${pathName}${
    startDate ? `&startDate=${startDate}` : ""
  }&${los ? `&los=${los}` : ""}${minPrice ? `&minPrice=${minPrice}` : ""}${
    maxPrice ? `&maxPrice=${maxPrice}` : ""
  }${searchSize ? `&searchSize=${searchSize}` : ""}`;
} else if (typeof pathName == "number") {
  url = `http://localhost:3000/api/v1/categories/${pathName}?${
    startDate ? `&startDate=${startDate}` : ""
  }&${los ? `&los=${los}` : ""}${minPrice ? `&minPrice=${minPrice}` : ""}${
    maxPrice ? `&maxPrice=${maxPrice}` : ""
  }${searchSize ? `&searchSize=${searchSize}` : ""}`;
}

//생략...
```

구조분해문법을 이용해 startDate, los 값을 꺼내 사용해줬습니다.

<br>
<br>

일단 여기까지 리팩토링하도록 하겠습니다. 아직 손봐야할 곳이 많지만 테스트코드, sentry, storybook 등 해야할 일이 산더미니 잠시 미뤄두겠습니다...

<br>
<br>
<br>

<details>

<summary>참고자료</summary>

<div markdown="1">

https://www.youtube.com/watch?v=64Fx5Y1gEOA&list=WL&index=116&t=12s

https://velog.io/@jay/fsd#fsd%EC%99%80-fda

</div>

</details>
