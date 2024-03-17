---
date: "2024-01-09"
title: "[React] UseReducer"
categories: ["React"]
summary: "리액트 훅 중 하나인 useReducer에 대해 알아보겠습니다."
thumbnail: "./reacticon.png"
---


## useReducer

- 철수가 은행에 만원을 출금하면 은행은 철수에게 만원을 준 뒤 철수의 은행계좌를 업데이트한다.
- 철수가 은행에서 하고싶은 일 (요구) : dispatch(본 예시에선 출금행위) → state를 업데이트하는 역할
철수가 은행에 만원을 출금해달라 요청하는 행위 : action → 요구의 내용
은행 : reducer → state 업데이트를 위한 요구
철수의 은행 계좌 : state
- **즉 철수의 요구(dispatch)에 만원을 출금해달라는 요청(action)넣으면 은행(reducer)는 계좌내역(state)를 변경시켜준다. 
dispatch에 action을 담는 구조**
- **usereducer함수는 state값을 업데이트 해주는 함수이다.**

예시

```jsx

const reducer = (state, action)=> {
어쩌구 저쩌구
}
//2개 인자를 받는다. 첫번째는 state, 두번 째는 action
//reducer 함수가 불리는 시점에 state에는 usereducer 함수의 state 값이 들어간다. 본 예시는 money 값이 들어간다.
//action은 우리가 reducer에게 state 값을 변경해달라 요구할 때 그때 요구의 값이 들어간다. 

fucntion Money () {

const [money, dispatch] = useReducer(reducer, 0)
//money(state) : 상태값, dispatch : 위에 언급한 역할을 할 함수
//useReducer() 의 인자는 2개 첫번 째 원소는 함수(위에 만든reducer함수), 두번 째 원소는 money(state)의 초기값
//dispatch 는 usereducer가 만든 함수
//dispatch를 사용할 때 인자로 action을 넣어준다. dispatch를 실행하면 reducer 함수가 호출된다. reducer의 인자인 action이 전달되고 
//action을 토대로 reducer는 state를 변경
return (

<div> 
<button onclick={dispatch()}/>
//dispatch의 인자가아무것도 없으므로 action은 undefined가 나온다. 

</div>

} 
```

같은 내용

```jsx
const reducer = (state, action)=> {
console.log('입금해주세요', state, action)
// 입금해주세요, 0, {type:'deposit'} 이 콘솔에 출력된다. 
}

fucntion Money () {

const [money, dispatch] = useReducer(reducer, 0)

return (

<div>
<button onclick={dispatch({type : "deposit"})}/>
//dispatch 인자는 object 형태로 전달

</div>

}
```

payload 추가

```jsx
const reducer = (state, action)=> {
console.log('입금해주세요', state, action)
// 입금해주세요, 0, {type:'deposit'} 이 콘솔에 출력된다. 
}

fucntion Money () {

const [money, dispatch] = useReducer(reducer, 0)

return (

<div>
<input value={number}/>
<button onclick={dispatch({type : "deposit", payload : number})}/>
//dispatch 인자는 object 형태로 전달
//payload에 input의 value값인 number를 넣어주면 input에 3000값을 넣고 버튼을 클릭하면 payload에 3000이 저장된다. 

</div>

}
```

reducer return을 이용해 값 업데이트

```jsx
const reducer = (state, action)=> {
console.log('입금해주세요', state, action)
//보통 여기엔 if, if else 문이나 switch 문을 많이쓴다.
//예시
switch (action.type) {
//action 타입에 따라 state 값이 바뀐다.
case 'deposit'
return state + action.payload
//action 타입이 deposit 이면 state(0) + action.payload(3000) = 3000이 된다.

------------------------
return 
state + action.payload
//새로 업데이트 될 state값을 여기에 적으면 된다.
//현재 state값은 0 patload는 3000이 들어있으므로 리턴된(업데이트된) state는 3000이 된다.

}

fucntion Money () {

const [money, dispatch] = useReducer(reducer, 0)

return (

<div>
<p>{state}원<p/>
// 3000원이출력된다. 
<input value={number}/>
<button onclick={dispatch({type : "deposit", payload : number})}/>
 

</div>

}
```