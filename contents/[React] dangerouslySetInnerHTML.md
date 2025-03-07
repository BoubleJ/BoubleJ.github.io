---
date: "2024-09-30"
title: "[React] dangerouslySetInnerHTML"
categories:
  [
    "React",
    "innerHTML",
    "dangerouslySetInnerHTML",
    "크로스 사이트 스크립팅",
    "XSS",
    "DOM 노드",
  ]
summary: "리액트에선 innerHTML 대신 dangerouslySetInnerHTML를 사용해봅시다."
thumbnail: "./dangerouslySetInnerHTML썸네일.png"
---

# dangerouslySetInnerHTML 이란

dangerouslySetInnerHTML은 브라우저 DOM에서 innerHTML을 사용하기 위한 React의 대체 방법입니다.

일반적으로 코드에서 HTML을 설정하는 것은 사이트 간 스크립팅 공격에 쉽게 노출될 수 있기 때문에 위험합니다.

따라서 React에서 직접 HTML을 설정할 수는 있지만, 위험하다는 것을 상기시키기 위해 dangerouslySetInnerHTML을 작성하고 \_\_html 키로 객체를 전달해야 합니다.

## 잘못된 예시

```jsx
const App = () => {
	const str = 'Hello!';

    return(
    	<div>
        	{str}
        </div>
    )
};

ReactDOM.render(
	<App />, document.getElementById('root');
)
```

## dangerouslySetInnerHTML를 사용해 string을 파싱해서 HTML로 만든 예시

```jsx
const App = () => {
	const str = 'Hello!';

    return(
    	<div dangerouslySetInnerHTML={{__html: str}}></div>
    )
};

ReactDOM.render(
	<App />, document.getElementById('root');
)
```

```jsx
const App = () => {
    const markup = () => {
    	return {__html : 'Hello'}
    };

    return(
    	<div dangerouslySetInnerHTML={markup()}></div>
    )
};

ReactDOM.render(
	<App />, document.getElementById('root');
)

```

<br>
<br>
<br>

<details>

<summary>참고문헌</summary>

<div markdown="1">

https://okayoon.tistory.com/entry/React-DOM%EC%97%98%EB%A6%AC%EB%A8%BC%ED%8A%B8%EC%97%90-%ED%85%8D%EC%8A%A4%ED%8A%B8-%EC%82%BD%EC%9E%85%ED%95%98%EA%B8%B0-innerHTML%EB%A7%90%EA%B3%A0-dangerouslySetInnerHTML%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EC%9E%90

</div>

</details>
