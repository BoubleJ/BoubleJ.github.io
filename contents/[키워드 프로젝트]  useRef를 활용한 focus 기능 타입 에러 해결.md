---
date: "2024-05-09"
title: "[키워드 프젝트] useRef를 활용한 focus 기능 타입 에러 해결"
categories: ["Keyword"]
summary: "useRef를 활용한 focus 기능을 구현했는데 타입 에러가 발생했습니다."
thumbnail: "./타입스크립트아이콘.png"
---

# 전체 코드

```tsx
//KeywordInput.tsx

//스타일컴포넌트는 생략

export default function KeywordInput() {
  const dispatch = useDispatch();
  const keywordRef = useRef("");
  useEffect(() => {
    keywordRef.current.focus();
  }, []);

  const keywordNameChange = () => {
    dispatch(pathNameFetch(keywordRef.current.value));
  };

  return (
    <>
      <InputDiv>
        <Input
          ref={keywordRef}
          placeholder="검색할 상품/키워드를 입력해주세요."
          onBlur={keywordNameChange}
        />
        <StyledMagnifier width="22" height="22" />
      </InputDiv>
    </>
  );
}
```

전체 코드입니다. 컴포넌트가 렌더링되면 자동으로 해당 input에 focus가 적용되고 입력한 값이 `dispatch`를 통해 전역으로 넘어가는 구조입니다.
컴포넌트 최적화 및 focus 기능을 구현하기 위해 `useRef` 훅을 사용했습니다.

<br>
<br>

# 문제 발생

```tsx
useEffect(() => {
  keywordRef.current.focus();
}, []);
```

해당 코드에서 다음과 같은 에러가 발생했습니다.

> Property 'focus' does not exist on type 'string'.

# 원인 및 해결

useRef가 문자열 ("")로 잘못 초기화되어 발생한 에러입니다. DOM 요소의 경우, `useRef<HTMLInputElement>(null)`을 사용하여 초기화 및 타입지정해야합니다.

```tsx
const keywordRef = useRef<HTMLInputElement>(null);
```

올바른 타입지정을 해준 뒤

<br>

```tsx
useEffect(() => {
  keywordRef.current?.focus();
}, []);

const keywordNameChange = () => {
  dispatch(pathNameFetch(keywordRef.current?.value || ""));
};
```

`keywordRef`가 null 값이면 `focus()` 할 수 없습니다. 즉, 에러가 발생하므로 옵션 체이닝을 사용하여 타입을 체크하고 접근하도록 했습니다.

그리고 `dispatch`를 통해 전역으로 넘길 경우 값이 존재하거나, null값이 아닌 빈 문자열 ("")을 넘겨야합니다. 때문에 `(keywordRef.current?.value || "")`을 사용하여 타입을 체크하고 접근하도록 했습니다.

<br>
<br>

# 최종 코드

```tsx
export default function KeywordInput() {
  const dispatch = useDispatch();
  const keywordRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    keywordRef.current?.focus();
  }, []);

  const keywordNameChange = () => {
    dispatch(pathNameFetch(keywordRef.current?.value || ""));
  };

  return (
    <>
      <InputDiv>
        <Input
          ref={keywordRef}
          placeholder="검색할 상품/키워드를 입력해주세요."
          onBlur={keywordNameChange}
        />
        <StyledMagnifier width="22" height="22" />
      </InputDiv>
    </>
  );
}
```

위 코드처럼 수정하니 에러가 사라졌습니다.
