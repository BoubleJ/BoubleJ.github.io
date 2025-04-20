---
date: "2024-03-13"
title: "[키워드 프로젝트] 엑셀 파일 다운로드 및 내부 content 설정"
categories: ["Keyword"]
summary: "엑셀 다운로드는 CSVLink라는 라이브러리를 사용했다."
thumbnail: "./image-45.png"
---



엑셀 다운로드는 CSVLink라는 라이브러리를 사용했다.

```jsx
import { CSVLink } from "react-csv";

export default function Result({ queryData }) {

  
  //기타등등 내용
  
  return (
  
  //기타등등

 <ExcelDownloadBtnDiv>
          {transformedData != undefined && (
            <ExcelButton>
              <FontAwesomeIcon icon={faDownload} />
						{/*  styled component 적용시킨  CSVLink이다.  */}
              <StyledCSVLink **data={}**>엑셀 다운로드</StyledCSVLink>
            //(styled compo)
            </ExcelButton>
          )}
        </ExcelDownloadBtnDiv>
```

CSVLink 컴포넌트 내부 속성인 `data`에 객체 프로퍼티를 가지고있는 배열 객체를 넣어주면 된다. 

api 호출로 받아오면 데이터는 유저가 사용할 수 없는 데이터이므로 가공처리 후 `data`에 넣어줘야한다. 

```jsx

export default function Result({ queryData }) {

  
  //기타등등 내용
  
  let transformedData ;
  if (sortedData != undefined) {
  //axios로 fetch 함수가 실행되면 sortedData에 데이터가 할당된다. 
  // 데이터를 불러오는 동안 sortedData 값은 undefined 이므로 if문을 사용해
  //데이터를 불러온 이후에 유저가 사용할 수 있는 데이터로 가공해준다.
   transformedData = sortedData.map(item => ({
      '키워드': item.name,
      '가격': item.priceValue,
      "총 리뷰 수": item.ratingTotalCount,
      "상품경쟁력": `${((item.ratingVipCount / item.ratingTotalCount) * 100).toFixed(1)}%`,
      "로켓배송": item.dataIsRocket ? '가능' : '불가능'
    }));
    //다음과 같이 새로운 배열을 만들어준다.
    
    console.log('transformedData',transformedData);
  }
  
  return (
  
  //기타등등
  
   <ExcelDownloadBtnDiv>
          {transformedData != undefined && (
          //transformedData가 존재하지 않는데 렌더링을 시도하면 에러가 나므로 
          //&& 문법을 이용해준다.  
            <ExcelButton>
              <FontAwesomeIcon icon={faDownload} />
			
							{/* 가공한 새로운 배열 transformedData 데이터를 넣어준다. */}
              <StyledCSVLink data={transformedData}>엑셀 다운로드</StyledCSVLink>
            //(styled compo)
            </ExcelButton>
          )}
        </ExcelDownloadBtnDiv>

```