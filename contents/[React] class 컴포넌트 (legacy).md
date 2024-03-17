---
date: "2024-03-15"
title: "[React] class 컴포넌트 (legacy)"
categories: ["React"]
summary: "class App은 React 컴포넌트라는 뜻."
thumbnail: "./reacticon.png"
---


## 

```jsx
class App extends React.Component {
render() {
return <h1>hi<h1>
}
```

- class App은 React 컴포넌트라는 뜻
- 사용자가 컴포넌트를 만들때마다 모든 것을 구현하고싶지 않기에 extends를 사용 
→ react class 컴포넌트에서 원하는 것을 가져온다.
- app 컴포넌트는 react 컴포넌트
- class 컴포넌트는 return 이 없다. 함수가 아니니까
- 대신 render 메서드를 가지고 있다.
- react 컴포넌트는 render 메서드를 가지고 있다. 근데 사용자가 react 컴포넌트를 
extends 했기때문에 사용자도 render 메서드를 사용할 수 있다.
    
    

### class 컴포넌트 vs function 컴포넌트

1. 함수형 컴포넌트는 함수형태이고 무언가를 return(반환)한다 → 반환값이 렌더링된다
2. 클라스 컴포넌트는 클라스형태이다. 하지만 react 컴포넌트로부터 확장되고 render 메서드를
사용해 렌더링한다. 
3. react는 자동적으로 클라스 컴포넌트의 render 메서드를 실행한다. 
4. 클라스 컴포넌트를 사용하는 이유는 state때문
5. 컴포넌트에 state가 필요없다면 클라스 컴포넌트를 쓰지않아도 된다. 함수컴포넌트를 써도 된다. 

```jsx
class App extends React.Component {
  state = {
    count : 0
  }
render() {
  return (
    <div>
      <h1>i'm genius {this.state.count}</h1>
    </div>
  )
}
}
//클라스 컴포넌트는 this를 써야한다. 
```

```jsx
<button onClick={this.add}>add</button>
//버튼 클릭스 add 함수 실행

<button onClick={this.add()}>add</button>
//클릭 유무 관계없이 컴포넌트 mount 즉시 실행

```

클래스 컴포넌트는 usestate대신 setstate를 쓴다. 

```jsx
class App extends React.Component {
  state = {
    count: 0,
  };
  add = () => {
  this.setState(current => ({ count: current.count + 1 }));
  };
  minus = () => {
    this.setState(current => ({ count: current.count - 1 }));
//current는 usestate와 마찬가지로 state의 이전값(this.state)
  };
  render() {
    return (
      <div>
        <h1>i'm genius {this.state.count}</h1>
        <button onClick={this.add}>add</button>
        <button onClick={this.minus}>minus</button>
      </div>
    );
  }
}
```

## class 컴포넌트 life cycle

1. mount
    1. constructor 함수 실행
    (constructor 함수는 js에서 class 를 만들때 쓰이는 함수. 즉 리액트 함수가 아니다)
    class 컴포넌트의 render함수보다 먼저 실행됨
    정확히는 클래스 컴포넌트가 생성될 때 실행됨
        
        ```jsx
        constructor(){
            console.log('hello')
          }
        
        //~~~//
        
          render() {
            console.log('hi')
        //hello 출력 후 hi 출력된다. 
        ```
        
    2. render 함수 실행
    3. componentDidMount 함수 실행
    컴포넌트가 화면에 렌더링된 후 실행된다. 
    
    즉 constructor → render → componentDidMount 순으로 실행
    
2. update
    1. render 함수 실행
    2. componentDidUpdate 함수 실행
3. unmount
    1. componentWillUnmount 함수 실행 (컴포넌트가 죽을 때 호출)

```jsx
class App extends React.Component {
  state = {
    isLoading: true,
    movies: []
  };
  componentDidMount() {
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 6000);
  }

  render() {
    const { isLoading } = this.state;
//render 이전 부분은 const 를 못 쓴다. 

    return <div>{isLoading ? "Loading..." : "We are ready"}</div>;
  }
}
```