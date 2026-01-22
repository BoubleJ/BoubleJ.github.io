---
date: "2024-03-03"
title: "[키워드 프로젝트] 달력 날짜값 query string 전달"
categories: ["Keyword"]
summary: "달력 날짜값을 query-string으로 전달"
thumbnail: "/image/axiosicon.png"
---



```jsx

//CustomCalendar.tsx

import { useState } from "react";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";
import { useDispatch } from "react-redux";
import { dateFetch } from "components/feature/FetchSlice";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function CustomCalendar() {
  const dispatch = useDispatch();
  const [value, onChange] = useState<Value>([new Date(), new Date()]);

  return (
    <div>
      <DateRangePicker
        onChange={onChange}
        value={value}

 {/*   여기서 value값은 배열로 출력되며
 value[0]은 시작날짜
value[1]은 종료날짜 이다  */}
        onCalendarClose={() => {
//캘린더가 닫히면
          dispatch(
            dateFetch({
              startDate: value[0].toISOString(),
              los: value[1].toISOString(),
            })
          );

						{/*  redux를 이용해 
		  startDate에 value[0].toISOString() 값을 저장
			los에 value[1].toISOString() 값을 저장한다.
여기서 value 그 자체 값은 직렬화 할 수 없는 값이므로 
toISOString()를 통해 직렬화가 가능하도록 해야한다.
 */}
 

        }}
      />
    </div>
  )
}

```

```jsx

import { useSelector } from "react-redux";
import { fetchCategoryData } from "api/categorySearchApi/route";

export default function SearchPage() {
  

  const date = useSelector((state) => state.queryString.date);
//CustomCalendar.tsx 에서 저장한 date값을 date 객체에 할당 
const startDate = date.startDate.split("T")[0]
//date 객체의 프로퍼티인 startDate 값을 
//ex. '2024-02-06' 이러한 날짜형식으로 변경
const los = date.los.split("T")[0]
//date 객체의 프로퍼티인 los 값을 
//ex.'2024-02-06' 이러한 날짜형식으로 변경

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

  const keywordSearch = () => {
    setKeywordObj({
      q: pathName,
      minPrice: minPrice,
      maxPrice: maxPrice,
      searchSize: searchSize,
      startDate: startDate,
      los: los,
    });
//가져온 startDate,los 값을 query-string으로 서버 전송

    const getKeywordResult = async () => {
      const res = await fetchKeywordData(
        pathName,
        minPrice,
        maxPrice,
        searchSize,
        startDate,
        los
      );

      console.log("res", res);

      setList(res.body);
    };

    getKeywordResult();
  };

  const categorySearch = () => {
    setKeywordObj({
      q: pathName,
      minPrice: minPrice,
      maxPrice: maxPrice,
      searchSize: searchSize,
      startDate: startDate,
      los: los,
    });

    const getCategoryResult = async () => {
      const res = await fetchCategoryData(
        pathName,
        minPrice,
        maxPrice,
        searchSize,
        startDate,
        los
      );

      console.log("res", res);

      setList(res.body);
    };

    getCategoryResult();
  };

  const [list, setList] = useState([]);

  return (
    <>
   {/*  ... 나머지 코드  */}
    </>
  );
}

```