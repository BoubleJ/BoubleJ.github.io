---
date: "2024-06-29"
title: "[키워드 프로젝트] UI컴포넌트, 비즈니스 로직 컴포넌트 분기처리 리팩토링"
categories: ["Keyword"]
summary: "한 가지 책임만 수행해는 컴포넌트가 좋은 컴포넌트입니다. "
thumbnail: "./리액트아이콘.png"
---

```tsx

//SearchPage.tsx

import { useEffect, useState } from "react";
import CustomCalendar from "components/feature/filter/CustomCalendar";
import styled from "styled-components";
import { useSelector } from "react-redux";
import Result from "components/feature/result/Result";
import { useLocation, Outlet } from "react-router-dom";
import { RootState } from "main";
import ItemSearchCount from "components/feature/filter/ItemSearchCount";
import PriceRange from "components/feature/filter/PriceRange";
import EmptyResult from "components/feature/result/EmptyResult";
import { createPortal } from "react-dom";
import ModalContent from "components/feature/filter/ModalContent";
import SearchButton from "components/feature/filter/SearchButton";
import { useNavigate } from "react-router-dom";
import media from "styles/media";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import ErrorField from "components/feature/result/ErrorField";

//스타일 컴포넌트 생략

export default function SearchPage() {
  const [resultVisible, setResultVisible] = useState(false);
  const [maxPrice, setMaxPrice] = useState<string | number>("");
  const [minPrice, setMinPrice] = useState<string | number>("");
  const [searchSize, setSearchSize] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [clickedFirstCategory, setClickedFirstCategory] = useState(null);
  const [clickedSecondCategory, setClickedSecondCategory] = useState(null);
  const [clickedThirdCategory, setClickedThirdCategory] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const url = new URL(window.location.href);
  const queryString = url.search;

  const { pathname } = useLocation();
  useEffect(() => {
    if (queryString) {
      setResultVisible(true);
    }
  }, [queryString]);

  const { reset } = useQueryErrorResetBoundary();

  useEffect(() => {
    if (!queryString) {
      setResultVisible(false);
    }
  }, [pathname]);

  const { startDate, los } = useSelector(
    (state: RootState) => state.queryString.date
  );

  const keywordInputValue = useSelector(
    (state: RootState) => state.queryString.pathName
  );

  const navigate = useNavigate();

  const newSearchParams = new URLSearchParams();

  const setQuery = () => {
    if (startDate) newSearchParams.set("startdt", startDate);
    if (los) newSearchParams.set("los", los.toString());
    if (minPrice) newSearchParams.set("minPrice", minPrice.toString());
    if (maxPrice) newSearchParams.set("maxPrice", maxPrice.toString());
    if (searchSize) newSearchParams.set("searchSize", searchSize.toString());
    if (!minPrice) newSearchParams.delete("minPrice");
    if (!maxPrice) newSearchParams.delete("maxPrice");
    if (!searchSize) newSearchParams.delete("searchSize");
    if (!startDate) newSearchParams.delete("startdt");
    if (!los) newSearchParams.delete("los");
  };

  const fetchHandler = () => {
    if (pathname == "/categories") {
      setShowModal(true);
      setErrorMessage("카테고리 목록을 선택해주세요.");
    } else if (/^\/categories\/\d+$/.test(pathname)) {
      if (Number(maxPrice) != 0 && Number(maxPrice) < Number(minPrice)) {
        setShowModal(true);
        setErrorMessage("최대가격이 최소가격보다 커야합니다.");
      } else if (!Number(minPrice) && Number(maxPrice)) {
        if (Number(maxPrice) < 10000) {
          setShowModal(true);
          setErrorMessage(
            "최소가격 미 입력 시\n최대가격이 10000보다 커야합니다."
          );
        }
      } else {
        setQuery();
        const updatedPathname = `${pathname}?${newSearchParams.toString()}`;
        navigate(updatedPathname);
        setResultVisible(true);
      }
    }

    if (pathname == "/keyword") {
      if (keywordInputValue === "") {
        setShowModal(true);
        setErrorMessage("키워드를 입력해주세요.");
      } else {
        if (Number(maxPrice) != 0 && Number(maxPrice) < Number(minPrice)) {
          setShowModal(true);
          setErrorMessage("최대가격이 최소가격보다 커야합니다.");
        } else if (!Number(minPrice) && Number(maxPrice)) {
          if (Number(maxPrice) < 10000) {
            setShowModal(true);
            setErrorMessage(
              "최소가격 미 입력 시\n최대가격이 10000보다 커야합니다."
            );
          }
        } else {
          setQuery();

          const updatedPathname = `keyword?q=${keywordInputValue}&${newSearchParams.toString()}`;
          navigate(updatedPathname);
          setResultVisible(true);
        }
      }
    }
  };

  return (
    <>
      <ButtonNSearchField>
        <Outlet
          context={{
            setClickedFirstCategory,
            setClickedSecondCategory,
            setClickedThirdCategory,
            setSelectedCategoryId,
          }}
        />
        <SearchButton fetchHandler={fetchHandler} />
      </ButtonNSearchField>
      <FilterBox>
        <CustomCalendar />
        <ItemSearchCount setSearchSize={setSearchSize} />
        <PriceRange setMinPrice={setMinPrice} setMaxPrice={setMaxPrice} />
      </FilterBox>

      {showModal &&
        createPortal(
          <ModalContent
            onClose={() => setShowModal(false)}
            errorMessage={errorMessage}
          />,
          document.body
        )}
      <SearchResultWord>상품 검색 결과</SearchResultWord>
      {selectedCategoryId == pathname.split("/")[2] && (
        <div>
          {clickedFirstCategory && (
            <SelectedCategory>{clickedFirstCategory}</SelectedCategory>
          )}
          {clickedSecondCategory && (
            <SelectedCategory>
              {" "}
              {">"} {clickedSecondCategory}
            </SelectedCategory>
          )}
          {clickedThirdCategory && (
            <SelectedCategory>
              {" "}
              {">"} {clickedThirdCategory}
            </SelectedCategory>
          )}
        </div>
      )}
      {resultVisible ? (
        <ErrorBoundary
          onReset={() => {
            reset();
          }}
          FallbackComponent={({ resetErrorBoundary }) => (
            <div>
              <ErrorField
                resetErrorBoundary={resetErrorBoundary}
                setResultVisible={setResultVisible}
              />
            </div>
          )}
        >
          <Result setResultVisible={setResultVisible} />
        </ErrorBoundary>
      ) : (
        <EmptyResult />
      )}
    </>
  );
}
```

네... 믿기지않으시겠지만 하나의 컴포넌트입니다.

컴포넌트 한 곳에 비즈니스 로직과 UI, State 저장 등 온갖 작업을 몰아넣는 것은 아주 건강치 못한 코딩습관입니다.

이번 포스팅을 기회로 리팩토링을 거쳐보겠습니다.

<br>
<br>

# 비즈니스 로직와 UI 분리

https://www.youtube.com/watch?v=FvRtoViujGg&t=204s

토스 유튜브 영상에서 말씀하시길 UI와 비즈니스 로직이 분리된 컴포넌트가 좋은 컴포넌트라고 합니다. 

컴포넌트 역할 별로 잘 분리해놓아야 가독성이 좋고 유지보수 또한 용이해지기 때문이죠.


```tsx
   <FilterBox>
        <CustomCalendar />
        <ItemSearchCount setSearchSize={setSearchSize} />
        <PriceRange setMinPrice={setMinPrice} setMaxPrice={setMaxPrice} />
      </FilterBox>
```

일단 이 filter 영역부터 분리해봅시다.

```tsx

import React from 'react'
import ItemSearchCount from "components/feature/filter/ItemSearchCount";
import PriceRange from "components/feature/filter/PriceRange";
import CustomCalendar from "components/feature/filter/CustomCalendar";

export default function FilterField() {


  return (
    <div>
        <ItemSearchCount />
        <PriceRange />
        <CustomCalendar />
    </div>
  )
}


```