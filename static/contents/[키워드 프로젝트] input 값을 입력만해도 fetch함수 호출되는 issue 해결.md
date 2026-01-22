---
date: "2024-03-07"
title: "[키워드 프로젝트] input 값을 입력만해도 fetch함수 호출되는 issue 해결"
categories:
  ["Keyword"]
summary: "input onchange 이벤트 때문에 input에 값을 입력할 때마다 state 값이 변하다보니 값을 입력하기만해도 서버에 get요청을 보내는 참사가 일어났다. "
thumbnail: "/image/onchange.png"
---

input onchange 이벤트 때문에 input에 값을 입력할 때마다 state 값이 변하다보니

값을 입력하기만해도 서버에 get요청을 보내는 참사가 일어났다.

```jsx
// SearchPage.tsx

import React, { useState, Suspense } from "react";

import { Outlet } from "react-router-dom";
import Button from "react-bootstrap/Button";
import CustomCalendar from "components/feature/filter/CustomCalendar";
import SearchTab from "components/feature/Tab/SearchTab";
import styled from "styled-components";
const Result = React.lazy(() => import("components/result/Result"));

//**1번** 레이지 로딩 덕에 첫 get요청은 버튼 클릭 후 실행되지만

const Input = styled.input`
  margin: 4px;
`;

export default function SearchPage() {
  const [isCalendar, setIsCalendar] = useState(false);

  const [maxPrice, setMaxPrice] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [searchSize, setSearchSize] = useState("");

  const searchSizeChange = (e) => {
    setSearchSize(e.target.value);
  };

  const maxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };
  const minPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  const csvData = [
    ["firstname", "lastname", "email"],
    ["Ahmed", "Tomi", "ah@smthing.co.com"],
    ["Raed", "Labes", "rl@smthing.co.com"],
    ["Yezzi", "Min l3b", "ymin@cocococo.com"],
  ];

  const [resultVisible, setResultVisible] = useState(false);

  return (
    <>
      <SearchTab />
      <Outlet></Outlet>
      <div>
        <p>날짜 설정</p>
        <div>
          <Button>최근 14일</Button>
          <Button
            variant="secondary"
            onClick={() => {
              setIsCalendar(!isCalendar);
            }}
          >
            기간 설정
          </Button>
        </div>
        <div>{isCalendar && <CustomCalendar />}</div>
        <div>
          <div>
            <p>상품 개수 입력</p>
            <Input
              type="number"
              name="itemSize"
              onChange={searchSizeChange}
            ></Input>
          </div>

          <div>
            <p>상품 가격 입력</p>
            <Input
              type="number"
              name="minPrice"
              onChange={minPriceChange}
            ></Input>
            <Input
              type="number"
              name="maxPrice"
              onChange={maxPriceChange}
            ></Input>
            {/* **2번** onchange 마다  maxPriceChange 실행되니 state값이 input 입력마다 변경이 되고   */}
          </div>
        </div>
        <p>상품 조회 결과</p>
        <button
          onClick={() => {
            setResultVisible(true);
            console.log("상품조회 클릭");
          }}
        >
          상품조회
        </button>

        <Suspense fallback={<div>데이터 로딩중</div>}>
          <Result
            searchSize={searchSize}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />
          {/* **3번** 그 변경된 값들이 result 컴포넌트로 바로바로 전달되니   */}
        </Suspense>
      </div>
    </>
  );
}
```

```jsx
// Result.tsx

import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { Link, useSearchParams } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { useSelector } from "react-redux";
import { CSVLink } from "react-csv";
import axios from "axios";

export default function Result({ minPrice, maxPrice, searchSize }) {
  //**4번** 전달받은 props state 값들이 변경되면 컴포넌트가 재렌더링되고
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [keywordObj, setKeywordObj] = useSearchParams();

  const pathName = useSelector((state) => state.queryString.pathName);

  const date = useSelector((state) => state.queryString.date);
  const startDate = date.startDate.split("T")[0];
  const los = date.los.split("T")[0];

  useEffect(() => {
    //**5번**재렌더링될때마대마다 fetch함수 실행 -> 데이터 불러옴
    setKeywordObj({
      q: pathName,
      minPrice: minPrice,
      maxPrice: maxPrice,
      searchSize: searchSize,
      startDate: startDate,
      los: los,
    });

    const fetchKeywordData = async (
      pathName: string | number,
      minPrice: number,
      maxPrice: number,
      searchSize: number,
      startDate: number,
      los: number
    ) => {
      console.log("fetchKeywordData");
      console.log(pathName, minPrice, maxPrice, searchSize, startDate, los);

      await axios
        .get(
          `http://localhost:3000/api/v1/keyword?q=${pathName}${
            startDate ? `&startDate=${startDate}` : ""
          }&${los ? `&los=${los}` : ""}${
            minPrice ? `&minPrice=${minPrice}` : ""
          }${maxPrice ? `&maxPrice=${maxPrice}` : ""}${
            searchSize ? `&searchSize=${searchSize}` : ""
          }`
        )
        .then((response) => {
          setList(response.data.body);
          setLoading(false);
        })

        .catch((error) => {
          console.error("Fail:", error);
          throw new Error("Fail");
        });
    };

    const fetchCategoryData = async (
      pathName: string | number,
      minPrice: number,
      maxPrice: number,
      searchSize: number,
      startDate: number,
      los: number
    ) => {
      console.log("fetchCategoryData");
      console.log(pathName, minPrice, maxPrice, searchSize, startDate, los);

      await axios
        .get(
          `http://localhost:3000/api/v1/categories/${pathName}?${
            startDate ? `&startDate=${startDate}` : ""
          }&${los ? `&los=${los}` : ""}${
            minPrice ? `&minPrice=${minPrice}` : ""
          }${maxPrice ? `&maxPrice=${maxPrice}` : ""}${
            searchSize ? `&searchSize=${searchSize}` : ""
          }`
        )
        .then((response) => {
          setList(response.data.body);
          setLoading(false);
        })

        .catch((error) => {
          console.error("Fail:", error);
          throw new Error("Fail");
        });
    };

    const resultRender = () => {
      if (typeof pathName == "string") {
        fetchKeywordData(
          pathName,
          minPrice,
          maxPrice,
          searchSize,
          startDate,
          los
        );
      } else if (typeof pathName == "number") {
        fetchCategoryData(
          pathName,
          minPrice,
          maxPrice,
          searchSize,
          startDate,
          los
        );
      }
    };

    resultRender();
  }, []);

  const sortByCompetitiveness = () => {
    const sorted = [...list].sort(
      (a, b) => b.ratingTotalCount - a.ratingTotalCount
    );
    setList(sorted);
  };

  // 가격순 정렬
  const sortByPrice = () => {
    const sorted = [...list].sort((a, b) => b.priceValue - a.priceValue);
    setList(sorted);
  };

  return (
    <>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <div>
          <CSVLink data={list}>Download me</CSVLink>;
          <Table responsive>
            <thead>
              <tr>
                <th>순위</th>
                <th>키워드</th>
                <th onClick={sortByPrice}>판매량</th>
                <th onClick={sortByCompetitiveness}>상품경쟁력</th>
                <th>배송방식</th>
              </tr>
            </thead>
            <tbody>
              {list?.map((item, idx) => {
                return (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <Link to={`https://www.coupang.com/${item.uri}`}>
                        {item.name}
                      </Link>
                    </td>
                    <td>{item.priceValue}</td>
                    <td>{item.ratingTotalCount}</td>
                    <td>
                      <img src={item.rocketImg} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
}
```

해결 방법

input value 값들을 한 객체에 모아 버튼을 클릭하면 그 객체 값이 input 입력값에 반영되어 변하도록 설정하니 해결됐다!!

```jsx

**//**SearchPage.tsx

****
export default function SearchPage() {
  const [isCalendar, setIsCalendar] = useState(false);

  //result로 전달할 객체 를 추가로 생성
  const [queryData, setQueryData] = useState({
    pathName: "",
    minPrice: "",
    maxPrice: "",
    searchSize: "",
    startDate: "",
    los: "",
  });

const [maxPrice, setMaxPrice] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [searchSize, setSearchSize] = useState("");

  const pathName = useSelector((state) => state.queryString.pathName);

  const date = useSelector((state) => state.queryString.date);
  const startDate = date.startDate.split("T")[0];
  const los = date.los.split("T")[0];
//queryData 프로퍼티로 쓰일 값들을 모두 한 컴포넌트로 불러옴

//버튼 클릭시 queryData 객체에 프로퍼티 값들 변경할 함수
 const fetchQueryData = () => {
    setQueryData({ pathName, minPrice, maxPrice, searchSize, startDate, los });
    console.log("Updated Info:", setQueryData);
  };

return (

// jsx 구조~~

//버튼 클릭시  fetchQueryData함수 실행
   <button
          onClick={() => {
            fetchQueryData();
            setResultVisible(true);
            console.log("상품조회 클릭");
          }}
        >
          상품조회
        </button>

//어쩌구 저쩌구

//변경된  queryData 객체값 Result컴포넌트로 전달
 <Suspense fallback={<div></div>}>
          {resultVisible && (
            <Result

              queryData={queryData}
            />
          )}
        </Suspense>
)

```

```jsx
//result.tsx

export default function Result({ queryData }) {
  //queryData를 받아온 후 query값으로 뿌려준다
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [keywordObj, setKeywordObj] = useSearchParams();

  //열심히 객체 프로터티들을 뿌리는 중
  useEffect(() => {
    setKeywordObj({
      q: queryData.pathName,
      minPrice: queryData.minPrice,
      maxPrice: queryData.maxPrice,
      searchSize: queryData.searchSize,
      startDate: queryData.startDate,
      los: queryData.los,
    });

    const fetchKeywordData = async (
      pathName: string | number,
      minPrice: number,
      maxPrice: number,
      searchSize: number,
      startDate: number,
      los: number
    ) => {
      console.log("fetchKeywordData");
      console.log(pathName, minPrice, maxPrice, searchSize, startDate, los);

      await axios
        .get(
          `http://localhost:3000/api/v1/keyword?q=${queryData.pathName}${
            queryData.startDate ? `&startDate=${queryData.startDate}` : ""
          }&${queryData.los ? `&los=${queryData.los}` : ""}${
            queryData.minPrice ? `&minPrice=${queryData.minPrice}` : ""
          }${queryData.maxPrice ? `&maxPrice=${queryData.maxPrice}` : ""}${
            queryData.searchSize ? `&searchSize=${queryData.searchSize}` : ""
          }`
        )
        .then((response) => {
          setList(response.data.body);
          setLoading(false);
        })

        .catch((error) => {
          console.error("Fail:", error);
          throw new Error("Fail");
        });
    };

    const fetchCategoryData = async (
      pathName: string | number,
      minPrice: number,
      maxPrice: number,
      searchSize: number,
      startDate: number,
      los: number
    ) => {
      console.log("fetchCategoryData");
      console.log(pathName, minPrice, maxPrice, searchSize, startDate, los);

      await axios
        .get(
          `http://localhost:3000/api/v1/categories/${queryData.pathName}?${
            queryData.startDate ? `&startDate=${queryData.startDate}` : ""
          }&${queryData.los ? `&los=${queryData.los}` : ""}${
            queryData.minPrice ? `&minPrice=${queryData.minPrice}` : ""
          }${queryData.maxPrice ? `&maxPrice=${queryData.maxPrice}` : ""}${
            queryData.searchSize ? `&searchSize=${queryData.searchSize}` : ""
          }`
        )
        .then((response) => {
          setList(response.data.body);
          setLoading(false);
        })

        .catch((error) => {
          console.error("Fail:", error);
          throw new Error("Fail");
        });
    };

    const resultRender = () => {
      if (typeof queryData.pathName == "string") {
        fetchKeywordData(
          queryData.pathName,
          queryData.minPrice,
          queryData.maxPrice,
          queryData.searchSize,
          queryData.startDate,
          queryData.los
        );
      } else if (typeof queryData.pathName == "number") {
        fetchCategoryData(
          queryData.pathName,
          queryData.minPrice,
          queryData.maxPrice,
          queryData.searchSize,
          queryData.startDate,
          queryData.los
        );
      }
    };

    resultRender();
  }, [queryData]);
  //queryData 객체가 변할때만 실행되도록 설정

  const sortByCompetitiveness = () => {
    const sorted = [...list].sort(
      (a, b) => b.ratingTotalCount - a.ratingTotalCount
    );
    setList(sorted);
  };

  // 가격순 정렬
  const sortByPrice = () => {
    const sorted = [...list].sort((a, b) => b.priceValue - a.priceValue);
    setList(sorted);
  };

  return (
    <>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <div>
          <CSVLink data={list}>Download me</CSVLink>;
          <Table responsive>
            <thead>
              <tr>
                <th>순위</th>
                <th>키워드</th>
                <th onClick={sortByPrice}>판매량</th>
                <th onClick={sortByCompetitiveness}>상품경쟁력</th>
                <th>배송방식</th>
              </tr>
            </thead>
            <tbody>
              {list?.map((item, idx) => {
                return (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <Link to={`https://www.coupang.com/${item.uri}`}>
                        {item.name}
                      </Link>
                    </td>
                    <td>{item.priceValue}</td>
                    <td>{item.ratingTotalCount}</td>
                    <td>
                      <img src={item.rocketImg} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
}
```
