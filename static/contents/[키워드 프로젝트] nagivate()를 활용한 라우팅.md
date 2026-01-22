---
date: "2024-04-29"
title: "[키워드 프로젝트] nagivate()를 활용한 라우팅"
categories: ["Keyword"]
summary: "nagivate()는 특정 행동을 했을 때 해당 페이지로 이동하게 해주는 함수입니다. "
thumbnail: "/image/리액트nagivate이미지.jpg"
---

nagivate() 함수를 이용해 url에 쿼리스트링을 띄워주도록 합시다.
url에 쿼리스트링 값을 표시하는 이유는 사용자가 주소창을 활용할 수도 있기 때문입니다.

```tsx
//SearchPage.tsx


import { useLocation, Outlet, useNavigate } from "react-router-dom";

//생략..

  const navigate = useNavigate();

  //생략..

  
  const commonURL = `${pathName}${startDate ? `&startDate=${startDate}` : ""}&${
    los ? `&los=${los}` : ""
  }${minPrice ? `&minPrice=${minPrice}` : ""}${
    maxPrice ? `&maxPrice=${maxPrice}` : ""
  }${searchSize ? `&searchSize=${searchSize}` : ""}`;

  let apiURL = "";
  let queryURL = "";

  if (typeof pathName == "string") {
    apiURL = "http://localhost:3000/api/v1/keyword?q=" + `${commonURL}`;
    queryURL = "keyword?q=" + `${commonURL}`;
  } else if (typeof pathName == "number") {
    apiURL = "http://localhost:3000/api/v1/categories/" + `${commonURL}`;
    queryURL = "categories/" + `${commonURL}`;
  }

  //생략

 const handleSearch = () => {
    if (pathName == "") {
      console.log("keyword를 입력하세요");
    } else {
      setResultVisible(true);
      refetch();
    }
  };


return 


//생략..

<InquiryButton
          disabled={isFetching}
          onClick={() => {
            handleSearch();
            navigate(queryURL);
          }}
        >

        {/* 생략..   */}



```

queryURL 이라는 변수를 만들어 navigate 함수로 전달해 url에 쿼리스트링값이 나오도록 구현했습니다. 

![alt text](/image/image-60.png)

잘 동작하는것을 확인할 수 있습니다!!

> url 분기처리하는 코드를 컴포넌트와 분리해서 독립적으로 관리하려했는데 의존성이 너무 높아서 포기했습니다... 차후 리팩토링 과정 때 다시 고민해봐야겠습니다... 


