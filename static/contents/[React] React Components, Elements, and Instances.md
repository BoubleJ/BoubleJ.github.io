---
date: "2024-10-07"
title: "[React] React의 Components Elements 기반 동작 원리"
categories:
  [
    "React"
  ]
summary: "React의 동작원리를 컴포넌트, 엘리먼트로 분석해봅시다."
thumbnail: "/image/reacticon.png"
---

우리가 자주 사용하는 리액트는 어떤 원리로 컴포넌트를 브라우저에 렌더링하는걸까요?? 자세히 알아봅시다.

# 기존 ui 모델이 가지고 있던 한계점

```js
class Form extends TraditionalObjectOrientedView {
  render() {
    const { isSubmitted, buttonText } = this.attrs;
    if (!isSubmitted && !this.button) {
      this.button = new Button({
        children: buttonText,
        color: "blue",
      });
      //button 인스턴스를 직접 생성 후 할당
      this.el.appendChild(this.button.el);
      //생성한 버튼 인스턴스를 appendChild를 활용해 DOM에 mount
    }
    if (this.button) {
      // 버튼이 화면에 띄워지면. 버튼 텍스트를 업데이트
      this.button.attrs.children = buttonText;
      this.button.render();
    }
    if (isSubmitted && this.button) {
      //isSubmitted 과 this.button(인스턴스) 이 존재한다면
      this.el.removeChild(this.button.el);
      //mount했던 button 인스턴스를 removeChild하고
      this.button.destroy();
      //destroy한다
    }
    if (isSubmitted && !this.message) {
      this.message = new Message({ text: "Success!" });
      this.el.appendChild(this.message.el);
    }
  }
}
```

위 코드는 `form 클래스` 내부에서 `button` 이라는 인스턴스를 `mount`하고 `remove`하는 과정을 **직접 다루는** `기존 ui 모델`입니다.

프로젝트 규모가 작을 경우 문제가 되지 않지만 코드가 점점 많아지고 프로젝트 규모가 커지면 문제가 발생합니다.

### 문제점

1. 각각 인스턴스를 제때 수작업으로 `appendChild`, `removeChild` 등 해줘야하는데 컴포넌트가 많아지면 관리할 코드가 너무 많아집니다.

2. form 클래스가 button을 **직접 생성 및 조작**하고 있기 때문에 `button 인스턴스`와 form 클래스 사이 `decoupling`이 어려워집니다. 즉 클래스와 인스턴스간의 결합이 강해진다는 뜻입니다.

# 리액트 엘리먼트

위 문제점을 해결하기 위해 리액트는 `리액트 엘리먼트` 라는 친구를 사용합니다.

리액트 엘리먼트는 `DOM 엘리먼트`와 `Component 엘리먼트` 2가지 종류가 있습니다.

## 특징 및 역할

리액트 엘리먼트는 DOM Tree를 그리기 위해 필요한 정보들을 가지고 있는 자바스크립트 객체입니다. (인스턴스 X)

DOM Tree를 그리는데 필요한 dom node 정보를 가지고 있기 때문에 리액트에게 화면을 어떻게 그려라~ 라고 전달할 수 있습니다.

## 리액트 엘리먼트 분류

엘리먼트가 생성되면 **2개의 프로퍼티**가 생성됩니다.

1. type : string | ReactClass

타입이 string 혹은 ReactClass인 타입 프로퍼티

2. props : object
   타입이 object인 props 프로퍼티

<br>

그리고 type 프로퍼티의 타입은 엘리먼트의 종류에 따라 달라집니다.

### dom 엘리먼트

```js
//타입이 button인 dom 엘리먼트
{
  type: 'button',
  //타입이 button이라는 string이 할당
  //이 button은 html의 이름
  props: {
    className: 'button button-blue',
    children: {
      type: 'b',
      props: {
        children: 'OK!'
      }
    }
  }
}

//이 버튼 html의 타입은 button이라는 string 타입
<button class='button button-blue'>
  <b>
    OK!
  </b>
</button>
```

### 리액트 컴포넌트

리액트 컴포넌트일때 엘리먼트의 type은 `ReactClass`가 됩니다.

```js
{
  type: Button,
  //type에 Button이 할당
  //type은 ReactClass
  props: {
    color: 'blue',
    children: 'OK!'
  }
  //props에 리액트 컴포넌트가 dom 트리에 어떤 정보를 전달해야 브라우저가 컴포넌트를 렌더링할지에 대한 정보를 담고 있다.
  //ex. color, 등등
}

```

즉 리액트 dom 엘리먼츠는 **dom tree에 전달할 정보를 담고 있는 객체** 입니다.

## 그렇다면 리액트 dom 엘리먼츠는 상술한 기존 ui 모델이 가지고 있는 한계점을 어떻게 극복했을까요?

```js
{
  type: Button,
  props: {
    color: 'blue',
    children: 'OK!'
  }
  //children을 가지고 있음 -> 다른 엘리먼트를 children으로 가질 수 있다 -> 트리구조 가능
}
```

리액트 dom 엘리먼트는 children를 가지고 있기 때문에 리액트 컴포넌트와 실제 dom에 있는 dom 엘리먼트가 같은 위계(같은 레벨)에서 관리될 수 있습니다.

### 예시

```js
const DeleteAccount = () => ({
  type: 'div',
  props: {
    children: [{
        //div 태그 children에 p태그,  DangerButton, Button가 존재
      type: 'p',
      props: {
        children: 'Are you sure?'
      }
    }, {
      type: DangerButton,
      props: {
        children: 'Yep'
      }
    }, {
      type: Button,
      props: {
        color: 'blue',
        children: 'Cancel'
      }
   }]
});
//DeleteAccount 함수는 엘리먼츠를 리턴하는 함수


//우리가 자주 사용하는 함수형 컴포넌트와 동일
const DeleteAccount = () => (
  <div>
    <p>Are you sure?</p>
    <DangerButton>Yep</DangerButton>
    <Button color='blue'>Cancel</Button>
  </div>
  //위 엘리먼트 코드랑 똑같은 역할
  //DangerButton은 html 태그가 아니지만 html태그와 똑같은 레벨상에서 관리된다.
);
```

리액트 dom 엘리먼트는 children이 존재하기 때문에 중첩이 가능한 구조입니다.

또한 위 상술한 class form과 다르게 연결이 끊어져있기 때문에 서로 아무 정보도 공유하지 않아 `decoupling`이 가능합니다.

DeleteAccount 함수가 리턴하는 `엘리먼트 트리`안에는 `dom 트리에 전달할 정보`만 `encapsulation (캡슐화)` 되어 있습니다.

언제 render, remove, mount 되는지는 리액트가 알아서 합니다.

리액트 dom 엘리먼트는 관여하지 않습니다.

## 그렇다면 리액트는 어떻게 컴포넌트를 마운트하고 제거하고 다할까?

```js
const DeleteAccount = () => ({
  type: 'div',
  props: {
    children: [{
      type: 'p',
      props: {
        children: 'Are you sure?'
      }
    }, {
      type: DangerButton,
      props: {
        children: 'Yep'
      }
    }, {
      type: Button,
      props: {
        color: 'blue',
        children: 'Cancel'
      }
   }]
}});
```

위와 같은 React는 DeleteAccount(리액트 컴포넌트)가 있다고 가정해봅시다. 리액트는 해당 컴포넌트를 읽으면서 컴포넌트에게 어떤 엘리먼트를 줄지 물어봅니다.



```js
{
  type: 'div',
  props: {
    children: [{
      type: 'p',
      props: {
        children: 'Are you sure?'
      }
    }, {
      type: DangerButton,
      props: {
        children: 'Yep'
      }
    }, {
      type: Button,
      props: {
        color: 'blue',
        children: 'Cancel'
      }
   }]
}}

```

리액트 컴포넌트는 리액트에게 위 엘리먼트 정보를 전달해줍니다. 

<br>

엘리먼트 정보를 전달받은 리액트는 한 depth 들어가 컴포넌트 발견 시 해당 컴포넌트에게 어떤 엘리먼트를 전달해줄거냐 물어봅니다.

```js
{
      type: 'p',
      props: {
        children: 'Are you sure?'
      }
    }, {
      type: DangerButton,
      props: {
        children: 'Yep'
      }
    }, {
      type: Button,
      props: {
        color: 'blue',
        children: 'Cancel'
      }
   }
```

위 엘리먼트에선 DangerButton 가 리액트 컴포넌트이므로 리액트는 해당 컴포넌트에게 물어봅니다.

<br>

즉, 리액트는 type이 리액트 클래스인 모든 컴포넌트를 순회하면서 모든 컴포넌트가 하나도 빠짐없이 dom 엘리먼츠를 return할 때까지 엘리먼츠 트리를 읽습니다.

모든 트리를 다 읽으면 리액트는 dom tree에 어떤 정보를 전달해야하는지 정확하게 알고 있는 상태이기 때문에 엘리먼트의 create, update, destory가 가능해집니다.

<BR>
<BR>

이러한 과정을 거치기 때문에 위 상술한 기존 ui 모델(form class)을

```js
const Form = ({ isSubmitted, buttonText }) => {
  if (isSubmitted) {
    return {
      type: Message,
      props: {
        text: "Success!",
      },
    };
  }

  return {
    type: Button,
    props: {
      children: buttonText,
      color: "blue",
    },
  };
};
```

위와 같이 간단하게 구현할 수 있습니다.

React element 를 활용하여, 기존에 DOM structure(실제 dom 구조) 을 모두 활용하지 않고(remove, destory와 같은 메서드 활용안함), 필요한 정보만 독립적으로 UI 를 관리할 수 있게 되는 겁니다.

## 1차 정리

엘리먼츠는 dom tree에게 전달할 정보를 가지고 있는 자바스크립트 객체입니다.

이 객체가 엘리먼트 트리를 이루게 되는데 이 구조를 리액트가 알고 있고 리액트가 이 구조를 보면서 알아서 렌더링을 하는 원리입니다.

<BR>
<BR>

# 리액트 재조정(Reconciliation)

```js
ReactDOM.render(
  {
    type: Form,
    props: {
      isSubmitted: false,
      buttonText: "OK!",
    },
  },
  document.getElementById("root")
);
```

`ReactDOM.render 함수`를 호출하면

리액트는 form 이라는 컴포넌트에게 어떤 엘리먼츠를 줄래? 하면서 물어보고 return element를 요청합니다.

이때 form 이라는 컴포넌트는

```js
const Form = ({ isSubmitted, buttonText }) => {
  if (isSubmitted) {
    return {
      type: Message,
      props: {
        text: "Success!",
      },
    };
  }

  return {
    type: Button,
    props: {
      children: buttonText,
      color: "blue",
    },
  };
};
```

조건문에 따라 dom 엘리먼트를 return합니다.

그럼 이 dom 엘리먼츠도 컴포넌트 이기 때문에 리액트는 다시 또 해당 컴포넌트에게 물어봅니다. 어떤 엘리먼츠를 줄래??

그럼 이 Button 컴포넌트는

```js
{
  type: 'button',
  props: {
    className: 'button button-blue',
    children: {
      type: 'b',
      props: {
        children: 'OK!'
      }
    }
  }
}
```

이 dom 엘리먼트를 return합니다.

Form → Button → DOM node element(button) 순서로 return element 진행되는 것이죠.

이렇게 하위 하위 엘리먼츠로 읽어가는 과정을 `Top-Down Reconciliation` 이라 합니다.

# 정리

ReactDom.render(), setState() 호출 시 React가 reconcilation을 콜합니다. reconcilation를 수행하는 것이죠.

reconcilation 이 끝나면 React 는 DOM tree(엘리먼츠 트리)의 결과물을 알게 되고 이 DOM tree(엘리먼츠 트리)를 renderer(e.g. react-dom)에게 전달하고 최소한의 변화를 실제 DOM node 업데이트에 적용합니다.

위와 같은 점진적 변화 덕분에 쉽게 optimization(최적화)이 가능하고, props는 immutabl하기 때문에 DOM tree 변화를 빠르게 파악할 수 있습니다.

<br>
<br>
<br>

<details>

<summary>참고문헌</summary>

<div markdown="1">

https://www.youtube.com/watch?v=QSJUTS9PScY&t=167s

https://withboaz.medium.com/react-components-elements-and-instances-%EB%B2%88%EC%97%AD%EA%B8%80-b5744930846b

</div>

</details>
