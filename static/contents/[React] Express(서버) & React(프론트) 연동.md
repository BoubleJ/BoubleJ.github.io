---
date: "2024-01-06"
title: "[React] Express(서버) & React(프론트) 연동"
categories: ["React"]
summary: "express와 react를 연동해봅시다."
thumbnail: "/image/reacticon.png"
---


```jsx
//<express> 서버

const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//express에서 req.body의 데이터를 사용하기 위해선 body-parser가 필요하다. 공식문서에서 가져옴

app.use(cors());

let id = 2;
const todoList = [
  {
    id: 1,
    text: "할일1",
    done: false,
  },
];

app.get("/api/todo", (req, res) => {
  res.json(todoList);
});
// api/todo 라는 url에서 데이터를 호출

app.post("/api/todo", (req, res) => {
  const { text, done } = req.body;
  //body에 담긴 데이터를 꺼냄
  todoList.push({
    id: id++,
    text,
    done,
  });
  // todoList에 데이터를 넣음
  return res.send("success");
});
//프론트에서는 body에 데이터(text, done)를 담아 서버로 보낸다.
//이걸 서버가 받기 위해선 req.body에 데이터가 들어있다.
// express에서 req.body의 데이터를 사용하기 위해선 body-parser가 필요하다.
//즉 parser는 클라이언트에서 body에 데이터를 담아 서버로 보내면 서버가 body에 담긴 데이터를 꺼내 쓰기 좋게 해주는 역할

app.listen(4000, () => {
  console.log("welcome server");
});
//서버 실행시 실행될 콜백함수

//app.js는 서버 파일
```

```jsx

//<리액트>

import { useEffect, useState } from "react";

function App() {
  const [todoList, setTodoList] = useState();
  const fetchData = () => {
    fetch("http://localhost:4000/api/todo")
      .then((response) => response.json())
      //데이터를 json형식으로 정제 후 response의 data를 넣음.  
//http 요청방식 아무것도 안적으면 get
      .then((data) => setTodoList(data));
    //받아온 데이터를 어떻게 처리할지
  };
  // then 은 하나의 요청을 의미

  useEffect(() => {
    fetchData();
  }, []);
  const onSubmitHandler = (e) => {
    e.preventDefault();
    //form 태그는 기본적으로 get 요청방식으로 동작하므로 이를 막기위해 preventDefault를 실행
    const text = e.target.text.value;
    const done = e.target.done.checked;
    //done 은 checkbox 이므로 checked를 사용 -> 체크하면 true, 안하면 false 출력
    fetch("http://localhost:4000/api/todo", {
//post 요청에서 데이터를 넣는 곳은 두번 째 인자
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      //post 요청을 보냈는데 id값만 서버에 도착했다. headers 어쩌구를 넣으니 해결됐다. -> 데이터를 서버에 추가할떄 보낸 데이터가 json 데이터
      //라는 것을 알려줘야 body에서 파싱할 때 json 형태로 파싱해서 사용가능하다.
      body: JSON.stringify({
        text,
        done,
      }),
    }).then(() => fetchData());
    //post 요청이 끝나면 fetchData 함수 (get 요청) 실행
  };
  //서버에 전달하고 싶은 데이터를 body에 담아서 전달. 단 데이터 형식을 문자열(json)로 직렬화(stringify)해서 보내야한다.

  return (
    <div>
      <h1>TODO LIST</h1>
      <form onSubmit={onSubmitHandler}>
        <input name="text" />
        <input name="done" type="checkbox" />
        <input type="submit" value="추가" />
      </form>
      {/*   //form 태그의 기본 동작 : onsubmit 동작시 query-parameter에 name이랑 값을 넣고 get 요청을 한다.  
    때문에 preventdefault로 해당 동작을 막아야한다. */}
      {todoList?.map((todo) => (
        <div key={todo.id} style={{ display: "flex" }}>
          <div>{todo.id}</div>
          <div>{todo.text}</div>
          <div>{todo.done ? "Y" : "N"}</div>
        </div>
      ))}
    </div>
  );
}

export default App;

//서버에 데이터를 요청하기위해선 1. 서버 주소 2. 어떤 http method를 사용할지 알아야한다.
```