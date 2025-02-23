---
date: "2025-02-20"
title: "[React] className 라이브러리 (+ bind())"
categories: ["React", "css-module"]
summary: "className 라이브러리를 활용해 편하게 조건부 스타일링을 구현해봅시다."
thumbnail: "./classname.png"
---

classnames는 CSS Module을 사용할 때 클래스 조건부 설정 시 (여러 클래스를 적용할 때) 매우 유용한 라이브러리입니다.

# 설치

classnames은 라이브러리이기 때문에 설치가 필요합니다.

```shell
npm install classnames --save
```

설치해줍니다.

만약, 타입스크립트를 사용한다면

```shell
npm install --save @types/classnames
```

도 설치해줍니다.

# 사용법

사용법은 간단합니다. `classNames` 라이브러리를 import 한 뒤 `bind` 함수로 css 객체를 감싸 클래스에 적용하면 됩니다.

```js
import classNames from 'classnames/bind';
import st from './Modal.module.scss';

const cn = classNames.bind(st);
//작명은 자유

export default function Modal() {
  return (
    <>
<div className={cn('wrap')}>
    <strong className={cn('title', 'text')}>점핑패스 무료쿠폰 안내</strong>  //title, text 선택자 모두 적용
</div>
</>

```

```scss
.wrap {
  margin-bottom: 20px;

  .title {
    margin-right: 4px;
    font-size: 20px;
    font-weight: bold;
    color: black;
  }

  .text {
    font-size: 50px;
  }
}
```


### props 혹은 객체 값에 따라 조건부 클래스 적용

```js
const MyComponent = ({ highlighted, theme }) => (
  <div className={classNames('MyComponent', { highlighted }, theme)}>Hello</div>
);
```

위 컴포넌트의 경우 클래스의 highlighted 값이 true이면 highlighted 클래스가 적용되고, false이면 적용되지 않습니다. \

추가로 theme으로 전달받는 문자열은 내용 그대로 클래스에 적용됩니다.


## className 미사용과 비교

### 쌩 css 적용


```js
import st from "./Modal.module.scss";

export default function Modal() {
  return (
    <>
      <div className={st.wrap}>
        <strong className={`${st.title} ${st.text}`}>
          점핑패스 무료쿠폰 안내
        </strong>
      </div>
    </>
  );
}
```

가장 일반적인 css 적용 방법입니다. 조건문, 혹은 여러 선택자 적용시 템플릿 리터럴을 활용해줘야합니다. 

위 예시야 간단하기 때문에 가독성에 문제가 없지만... 

복잡한 조건문, 여러 클래스 적용 시 가독성이 급격히 떨어집니다.

```html
<img
   className={`${css.pannelTriangle} 
   ${isOpen && path.length !== 3? css.pannelOpen: css.pannelClose} 
   ${path.length === 3 && css[`pannelArrow`]}
   ${!title && css[`imgNotFound`]} } />

```
네.. 코드가 매우 더러워졌군요.

<br>

**라이브러리 사용 시**

```html
<img
  className={cn(
  "pannelTriangle",
  isOpen && path.length !== 3 ? "pannelOpen" : "pannelClose",
  path.length === 3 && "pannelArrow",
  !title && "imgNotFound" )} />
```

템플릿 리터럴을 안쓰니 가독성이 훨씬 좋아졌습니다.


또한 상술한 클래스객체 존재 유무에 따른 조건문도 복잡해집니다.\

```js
const MyComponent = ({ highlighted, theme }) => (
  <div className={`MyComponent ${theme} ${highlighted ? 'highlighted' : ''}`}>
    Hello
  </div>
);
```

확실히 className 라이브러리를 사용했을 때가 가독성이 좋습니다.



### bind() 함수로 감싸지 않고 사용 시

bind() 함수로 css 객체를 감싸느냐 마느냐에 따라서 가독성이 달라집니다.

```js
import cn from 'classnames';
import st from './Modal.module.scss';

export default function Modal() {
 return (
   <>
    <div className={cn(st['wrap'])}>
        <strong className={cn(st['title'], st['text'])}>점핑패스 무료쿠폰 안내</strong>
        {/* <strong className={cn(st.title, st.text)} 도 가능 */}
    </div>
    </>
```

사실 st 객체의 속성인 선택자를 불러오는 키워드만 추가된거라 큰 차이없지만

굳이 클래스 부여할때마다 st 객체를 표기할 필요가 없습니다.

`classNames.bind` 함수로 감싸주면 클래스를 넣어 줄 때마다 styles.[클래스 이름] 형태를 사용할 필요가 없습니다.

선택자 키워드만 넣어주면 됩니다.

```js
import classNames from 'classnames/bind';
import st from './Modal.module.scss';

const cn = classNames.bind(st);

export default function Modal() {
  return (
    <>
<div className={cn('wrap')}>
    <strong className={cn('title', 'text')}>점핑패스 무료쿠폰 안내</strong>
</div>
</>

```

성능상 치이는 없지만 굳이 번거롭게 클래스마다 st 객체를 넣어줄 필요가 없으니 bind 함수를 사용하는게 더 편리합니다.

<br>
<br>
<br>

<details>

<summary>참고문헌</summary>

<div markdown="1">

https://velog.io/@dooreplay/classNamesCSS-Modules



</div>

</details>
