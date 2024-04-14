---
date: "2024-04-14"
title: "[키워드 프로젝트] input 숫자만 입력가능하게 설정"
categories: ["Web"]
summary: "input 태그에 오로지 숫자만 입력 가능하도록 설정해봅시다!."
thumbnail: "./프로젝트input요소.png"
---

프로젝트 내에서 상품 가격 및 개수를 조회하는 input 요소가 존재합니다.
이 input에 한글, 영어, 특수문자 등 숫자를 제외한 글자가 들어가면 에러가 발생하므로 input에 오로지 숫자만 들어가도록 설정하겠습니다.

<br><br>

# input 숫자만 입력 방법

```tsx
//PriceRange

//생략

const minPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  let inputValue = e.target.value;

  inputValue = inputValue.replace(/[^0-9]/g, "");

  setMinPrice(inputValue);
};

//생략

<Input
  type="text"
  name="minPrice"
  value={minPrice}
  onChange={minPriceChange}
  placeholder="최소 가격"
  disabled={isFetching}
  maxLength={12}
  onKeyUp="this.value=this.value.replace(/[^0-9]/g,'')"
></Input>;
```

다음과 같이 정규표현식을 이용해 속성과 `minPriceChange` 함수를 정의하면 됩니다.

<br>

### 결과

![](https://velog.velcdn.com/images/dogmnil2007/post/515b95b6-5777-45a1-84e9-c55576b324f7/image.gif)

잘 적용된 것 같습니다. (숫자 입력 후 아무것도 안하는 것 같지만 열심히 한글, 영어, 특수문자를 입력중입니다..ㅎㅎ)

<br>
<br>

# 숫자 쉼표(,) 추가

뭔가 좀 아쉽습니다. 가격을 입력하는 칸이니 쉼표도 넣어주도록 합시다.

```tsx
//PriceRange

//생략

const minPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  let inputValue = e.target.value;

  inputValue = inputValue.replace(/[^0-9]/g, "");

  inputValue = inputValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  //다음과 같은 정규표현식을 추가해줍니다.

  setMinPrice(inputValue);
};

//생략

<Input
  type="text"
  name="minPrice"
  value={minPrice}
  onChange={minPriceChange}
  placeholder="최소 가격"
  disabled={isFetching}
  maxLength={12}
  onKeyUp="this.value=this.value.replace(/[^0-9]/g,'')"
></Input>;
```

위 코드처럼 정규표현식을 이용해 세 번째 자리수 마다 쉼표를 추가해줬습니다.

<br>

### 결과

![](https://velog.velcdn.com/images/dogmnil2007/post/17686f38-329f-4811-9b64-4080a3ba7dcb/image.gif)

쉼표까지 잘 생성됩니다!!

<br><br>
<br>
<br>

음,,, 하지만 쉼표 처리는 폐기했습니다.

![](https://velog.velcdn.com/images/dogmnil2007/post/0eb3a950-bcb8-496d-a453-9f5efc24e782/image.png)

가격 설정 후 데이터 조회하니 가격이 전혀 반영이 되지 않았습니다...

<br>

api호출 주소 또한 쿼리스트링으로 숫자만 넘어가야하는데 , (쉼표) 까지 넘어가서 백엔드에서 필터링 처리가 안된 것 같습니다. 아쉽지만 쉼표 처리는 제거해야할 것 같네요.

![](https://velog.velcdn.com/images/dogmnil2007/post/3d3f38cf-6810-49f4-9a2a-4dd4d6606510/image.png)

<details>

<summary>출처</summary>

<div markdown="1">

https://selinak.tistory.com/35

https://mong-blog.tistory.com/entry/input%EC%97%90-%EC%9E%85%EB%A0%A5%EB%90%9C-%EC%88%AB%EC%9E%90%EC%97%90-%EC%BD%A4%EB%A7%88-%EC%B0%8D%EA%B8%B0

</div>

</details>
