---
date: "2024-03-08"
title: "[키워드 프로젝트] keyword 검색 & category 검색 분기 구현"
categories: ["Keyword"]
summary: "keyword 검색과 category 검색 시 api호출 주소가 다르다."
thumbnail: "/image/image-39.png"
---

keyword 검색과 category 검색 시 api호출 주소가 다르다.

```jsx
//keyword검색
`http://localhost:3000/api/v1/keyword?q=${queryData.pathName}${
  queryData.startDate ? `&startDate=${queryData.startDate}` : ""
}&${queryData.los ? `&los=${queryData.los}` : ""}${
  queryData.minPrice ? `&minPrice=${queryData.minPrice}` : ""
}${queryData.maxPrice ? `&maxPrice=${queryData.maxPrice}` : ""}${
  queryData.searchSize ? `&searchSize=${queryData.searchSize}` : ""
}` //category검색
`http://localhost:3000/api/v1/categories/${queryData.pathName}?${
  queryData.startDate ? `&startDate=${queryData.startDate}` : ""
}&${queryData.los ? `&los=${queryData.los}` : ""}${
  queryData.minPrice ? `&minPrice=${queryData.minPrice}` : ""
}${queryData.maxPrice ? `&maxPrice=${queryData.maxPrice}` : ""}${
  queryData.searchSize ? `&searchSize=${queryData.searchSize}` : ""
}`;
```

여기서 queryData.pathName은 keyword 입력값이거나 category 선택 id값으로 할당된다.

처음엔 keyword 입력값은 string이고 id값은 number니까 타입으로 분기하면 될것이라 생각했지만..

url params는 무조건 string타입으로 구분되기 때문에 문제가 생겼다.

![alt text](/image/image-39.png)

때문에 중간에 number로 한번 바꿔주는 과정이 필요했다.

```jsx
//searchPage.tsx

let pathName = "";

const keywordInputValue = useSelector((state) => state.queryString.pathName);
// console.log(typeof keywordInputValue)

const { pathname } = useLocation();
// console.log(pathname);
const slug = pathname.split("/")[2];

if (slug == undefined) {
  pathName = keywordInputValue;
} else if (typeof slug == "string") {
  pathName = Number(slug);
}
//여기서 url params(id값, 코드는 slug에 할당했다)를 number로 변경 후
// queryData 객체 내부 pathName 값에 할당되도록 설정했다.

const fetchQueryData = () => {
  setQueryData({ pathName, minPrice, maxPrice, searchSize, startDate, los });
};
```

이제 category 검색시 queryData.pathName은 number타입

keyword 검색 시 queryData.pathName은 string 타입임을 명시해놨으니

타입에 맞춰 api를 호출해주면된다.

```jsx

export default function Result({ queryData }) {
  const [list, setList] = useState([]);

let url = ''
//string타입일경우
  if (typeof queryData.pathName == "string") {
    url =  `http://localhost:3000/api/v1/keyword?q=${queryData.pathName}${
      queryData.startDate ? `&startDate=${queryData.startDate}` : ""
    }&${queryData.los ? `&los=${queryData.los}` : ""}${
      queryData.minPrice ? `&minPrice=${queryData.minPrice}` : ""
    }${queryData.maxPrice ? `&maxPrice=${queryData.maxPrice}` : ""}${
      queryData.searchSize ? `&searchSize=${queryData.searchSize}` : ""
    }`
    //number타입일 경우
  } else if (typeof queryData.pathName == "number") {
    url = `http://localhost:3000/api/v1/categories/${queryData.pathName}?${
                queryData.startDate ? `&startDate=${queryData.startDate}` : ""
              }&${queryData.los ? `&los=${queryData.los}` : ""}${
                queryData.minPrice ? `&minPrice=${queryData.minPrice}` : ""
              }${queryData.maxPrice ? `&maxPrice=${queryData.maxPrice}` : ""}${
                queryData.searchSize ? `&searchSize=${queryData.searchSize}` : ""
              }`
  }

  const problemData = useGetData(url);

```

사실 이전에 문제가 하나 더 있었다.

바로 어떤 기준으로 queryData.pathName의 pathName에 값을 할당하느냐는 것이었다.

```jsx
//위에 작성한 코드와 동일한 코드

let pathName = "";

const keywordInputValue = useSelector((state) => state.queryString.pathName);
// keyword input value값

const { pathname } = useLocation();

const slug = pathname.split("/")[2];
//category id값만 추출
```

이 코드는 pathName에 어떤 값을 할당할지 판단하는 역할을 한다.

예를 들어

만약 keyword 입력칸에 숫자를 적고 상품조회를 누른다면 어떻게 될 지 생각해보자.

123이라는 값을 입력했다면

123은 keywordInputValue에 할당된다. 이제 keywordInputValue값을

let pathName = "";

에 할당해야하는데 categoryid를 넣어야하는지 keyword value값을 넣어야하는지 기준이 없다.

기준을 만들어야하는데 keyword에 숫자를 입력하면 결국 그 값도 string이기떄문에 위에 코드처럼 number로 타입변경이 진행된다면 category 검색으로 취급되는 참사가 발생할 수 있다.

때문에 api 호출함수를 완벽하게 분기할 수 있는 방법이 필요했다.

오랜고민끝에 url params를 이용하기로했다.

![alt text](/image/image-40.png)

![alt text](/image/image-41.png)

사진을 보면 uri 구조가 살짝 다르다는 것을 알 수 있다.

구조가 다르다는 것을 이용

```jsx
const { pathname } = useLocation();
console.log(pathname);
const slug = pathname.split("/")[2];
console.log(slug);

//pathname 즉url params를 출력하면
```

![alt text](/image/image-42.png)

카테고리 검색의 경우 id값(숫자형태의 string)이 나오지만

![alt text](/image/image-43.png)

keyword 검색의 경우 undefined가 나온다.

`const slug = pathname.split("/")[2];`

이 코드를 이용해 undefined 혹은 string으로 타입을 분기할 수 있다.

이 점을 활용해

```jsx
let pathName = "";

const keywordInputValue = useSelector((state) => state.queryString.pathName);
// console.log(typeof keywordInputValue)

const { pathname } = useLocation();
console.log(pathname);
const slug = pathname.split("/")[2];
console.log(slug);
//undefinded면 keyword 검색
//id값이 나오면 category검색

if (slug == undefined) {
  pathName = keywordInputValue;
} else if (typeof slug == "string") {
  pathName = Number(slug);
}
//slug값에 따라 pahName을 다르게 할당
```

이렇게 로직을 만들면 url params로 pathName 할당값을 결정하기 떄문에 keyword에 어떠한 값(number, string 특수문자 등)을 넣어도 정상적으로 keyowrd api호출을 실행한다.
