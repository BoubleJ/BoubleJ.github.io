---
date: "2024-03-09"
title: "[React] setState함수의 매개변수, state값"
categories: ["React"]
summary: "setState함수의 매개변수에 대해 알아보겠습니다."
thumbnail: "./reacticon.png"
---

```jsx
setToDos(*currentArray* => [])

setToDos(function(*currentArray){
return []}

//둘은 상응하는 표현
//둘다 currentArray를 매개변수로 가지고 []을 반환한다.*
```

```jsx
const [toDo, setToDo] = useState("");
const [toDos, setToDos] = useState([]);
setToDos((currentArray) => [toDo, ...currentArray]);
//여기서 currentArray는 toDos의 이전 state값이다. 그냥 그렇구나 알아둬라.
//만약 setToDos((currentArray, 1,2,3) => [toDo, ...currentArray]);
//이렇게 다수의 매개변수를 받아온다면 에러가 난다. 1개의 값만 받아올 수 있기 때문
```
