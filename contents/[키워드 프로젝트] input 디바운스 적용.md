---
date: "2024-04-14"
title: "[키워드 프로젝트] input 디바운스 적용"
categories: ["Keyword"]
summary: "lodash의 debounce 기능을 활용해 input value 입력 시 불필요한 리렌더링 방지하고 프로젝트 최적화를 이룩해봅시다."
thumbnail: "./lodash.jpeg"
---

불필요한 리렌더링 방지를 위한 debounce 기능을 적용시켜보겠습니다.

# 개요

본 프로젝트에는 input 요소가 대략 4개 정도 존재합니다.

1. keyword 검색 input
2. 최소 가격, 최대 가격 입력 input
3. 상품 조회 개수 입력 input

현재 모든 input은 onchange 속성을 사용해 input value 값이 변할 때마다 리렌더링을 일으키고 있습니다. 불필요한 리렌더링 방지를 위해 모든 input에 debouce를 적용시키려했으나...

<br>

```tsx
//PriceRange.tsx

export default function PriceRange({
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  isFetching,
}) {
  const maxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    inputValue = inputValue.replace(/[^0-9]/g, "");

    setMaxPrice(inputValue);
  };
  const minPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    inputValue = inputValue.replace(/[^0-9]/g, "");

    setMinPrice(inputValue);
  };

  return (
    <>
      <PriceContainer>
        <InputTitle>상품 가격</InputTitle>
        <Input
          type="text"
          name="minPrice"
          value={minPrice}
          onChange={minPriceChange}
          placeholder="최소 가격"
          disabled={isFetching}
          maxLength={12}
          onKeyUp="this.value=this.value.replace(/[^0-9]/g,'')"
        ></Input>
        <span> - </span>
        <Input
          type="text"
          onKeyUp="this.value=this.value.replace(/[^0-9]/g,'')"
          name="maxPrice"
          maxLength={12}
          value={maxPrice}
          onChange={maxPriceChange}
          placeholder="최대 가격"
          disabled={isFetching}
        ></Input>
        <NotEnterdDescription>
          미입력 시 10000~무한 범위 내 <br></br> 조회됩니다.
        </NotEnterdDescription>
      </PriceContainer>
    </>
  );
}
```

최소 및 최대 가격을 받아오는 input 요소의 경우
`onKeyUp="this.value=this.value.replace(/[^0-9]/g,'')"`

`inputValue = inputValue.replace(/[^0-9]/g, "");`

와 같은 오로지 숫자만 입력하기 위해 실시간으로 input에 입력된 값을 확인하고 정규표현식에 의해 걸러져야하기 때문에 debounce를 적용하지 않는게 좋다고 판단했습니다.

<br>

# keyword input만 적용

때문에 어떠한 문구가 와도 상관없고 input에 값이 입력될때마다 별도로 실행되는 함수도 없는 keyword input만 debounce를 적용하기로 했습니다.

```tsx
//KeywordInput.tsx


export default function KeywordInput() {
    const dispatch = useDispatch();

  const debouncedKeywordNameChange = useCallback(
    debounce((value: string) => {
      dispatch(pathNameFetch(value));
           console.log("디바운스 적용");![](https://velog.velcdn.com/images/dogmnil2007/post/265b0572-26da-4931-8274-f79f5976c560/image.gif)

    }, 300), // Debounce 딜레이 간격을 0.3로 설정했습니다.
    []
  );


  const keywordNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    debouncedKeywordNameChange(value);

  };




  return (
    <>
      <InputDiv>
        <Input
          placeholder="검색할 상품/키워드를 입력해주세요."
          onChange={keywordNameChange}
        />
        <StyledMagnifier width="22" height="22" />
      </InputDiv>
    </>
  );
}


```

### 결과

![](https://velog.velcdn.com/images/dogmnil2007/post/12e750c9-bf8d-403e-8448-94d8583259ad/image.gif)

정상적으로 적용됐습니다!!

<details>

<summary>출처</summary>

<div markdown="1">

https://kyounghwan01.github.io/blog/React/debounce/#debounce%E1%84%85%E1%85%A1%E1%86%AB

</div>

</details>
