---
date: "2024-01-21"
title: "[React] React 반복문(ex.map) key"
categories: ["React"]
summary: "리액트jsx 반복문을 통해 렌더링할 경우 props로 key를 넣어줘야한다."
thumbnail: "/image/reacticon.png"
---


### 리액트 list key

- 리액트jsx 반복문을 통해 렌더링할 경우 props로 key를 넣어줘야한다.
- key 미적용시 에러를 발생시키진 않지만 리액트에서 권유하는 방법이므로 이행하는 것이 좋다.

```jsx
<ul>
        {toDos.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
```