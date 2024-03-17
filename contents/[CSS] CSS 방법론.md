---
date: "2023-11-20"
title: "[CSS] CSS 방법론"
categories: ["CSS"]
summary: " CSS에서 클래스 네임을 지을 때 작성하는 방식으로 일종의 naming convention입니다."
thumbnail: "./css-logo.png"
---

CSS에서 클래스 네임을 지을 때 작성하는 방식으로 일종의 **naming convention**이다

웹에서 CSS의 영향력이 높아지게 되면서 CSS사용시 클래스 이름을 어떻게 작성할지, 어떠한 방식으로 스타일을 작성할지 등 CSS를 보다 효율적으로 작성하기 위해 정의된 일종의 규칙이다.

CSS방법론에는 다양한 방법론들이 존재하지만 크게 **OOCSS, BEM, SMACSS**로 나눠지게 되며 상황에 따라 다르게 적용된다.

# **OOCSS**

OOCSS(Object Oriented CSS)는 CSS를 **모듈(module) 방식**으로 작성하여 중복을 줄이는 방식의 방법론이다

OOCSS는 가장 많이 사용되는 방법론으로 구조와 스타일을 분리하여 작성한다.
중복되는 디자인 요소를 따로 빼내어 작성하기 때문에 반복적으로 사용가능하다. 또한 코드의 재사용성이 높아져 적은 코드량으로 최적의 성능을 보인다.

공통된 부분을 찾아 어디서나 재활용 할 수 있다는 장점이 있지만 다중 클래스 사용으로 인해 코드의 가독성이 떨어질 수 있는 단점이 존재한다.

컨테이너와 컨텐츠 분리하기

```html
<div class="header common-width">Header</div>
<div class="footer common-width">Footer</div>
```

```css
.header {
  position: fixed;
  top: 0;
}
.footer {
  position: relative;
  bottom: 0;
}
.common-width {
  width: 800px;
  margin: 0;
}
```

```html
<!-- 구조와 모양을 분리하거나 결합시키기  -->

<!--  기존 방식 -->
<a class="”instagram_btn" instagram_skin”>Instagram</a>
<a class="”facebook_btn" facebook_skin”>Facebook</a>

<!--  OOCSS 적용  -->
<a class="”btn" skin instagram”>Instagram</a>
<a class="”btn" skin facebook”>Facebook</a>

<!--    .btn -> 공통 버튼 스타일 정의      -->
<!--     .skin -> 공통 스킨 스타일 정의     -->
```

# **BEM 네이밍**

BEM(Block Element Modifier)은 **블록(block), 요소(element), 상태(modifier)**로 구분하여 클래스 이름을 작성하는 방식의 방법론이다

BEM은 `블록(block)`, `요소(element)`, `상태(modifier)` 3가지로 구성하고,

각 부분을 `__`와 `--`로 구분하여 짓게 된다. 어떻게 보일지에 초점을 두기보단 *'어떠한 목적인가'* 에 초점을 두어 이름을 짓는다.

엄격한 네이밍 규칙을 따르며 클래스명이 용도와 형태를 잘 표현해주어 직관적으로 알 수 있는것이 장점이나, 클래스명이 길고 복잡해 질 수 있다는 단점이 존재한다.

- 블록(block): 재사용성이 가능하고 기능적으로 독립이 가능한 컴포넌트이다. 일반적으로 하나의 단어를 사용하되 길어질 경우엔 ``를 사용한다.

```css
.header {
  ..;
}
.block {
  ..;
}
```

- 요소(element): 블록을 구성하는 단위이다. `__`를 사용한다.

```css
.header {
  ..;
}
.header__tap {
  ..;
}
.header__content {
  ..;
}
.header__logo__button {
  ..;
}
```

- 상태(modifier): 블록이나 요소의 속성으로 ``를 사용한다.

```css
.header--hide {
  ..;
}
.header__tap--big {
  ..;
}
.header__content--disabled {
  ..;
}
```

# **SMACSS**

SMACSS(Scalable and Modular Architecture for CSS)는 CSS를 **범주화(Categorization)**로 패턴화 하고자 하는 방법론이다

SMACSS는 작성할 CSS를 비슷한 종류끼리 모아 5가지 스타일로 나누고 각 유형에 맞는 선택자와 작명법, 코딩 기법을 제시한다. *기본(base), 레이아웃(layout), 모듈(module), 상태(state), 테마(theme)* 다섯가지의 범주를 제시한다.

- 기본(base): Reset, Variable 등을 포함하고 !important를 쓰지 않는다.

```css
body,
form,
p,
table,
button,
fieldset,
input ... {
  margin: 0;
  padding: 0;
}
```

- 레이아웃(layout): 주요 요소(id)와 하위 요소(class)로 구분하고 접두사를 사용한다.

```css
// layout => l-

// 주요 요소 작성
#header {
  width: 400px;
}
#aside {
  width: 40px;
}

// 하위 요소 작성
.l-width #header {
  width: 650px;
  padding: 10px;
}
.l-width #aside {
  width: 100px;
}
```

- 모듈(module): 재사용성이 높은 구성 요소를 정의한다.

```css
.stick {
  ...;
}
.stick-name {
  ...;
}
.stick-number {
  ...;
}
```

- 상태(state): 요소의 상태 변화를 표현하고 접두사 “is-“나 “s-“를 사용한다.

```css
.is-error {
  ...;
}
.is-hidden {
  ...;
}
.is-disabled {
  ...;
}
```

- 테마(theme): 사용자가 선택 가능 하도록 스타일을 재선언하여 사용한다.

```css
// base.css
.header {
  background-color: red;
}
// theme.css
.header {
  background-color: orange;
}
```

**SMACSS** 사용시에는 지켜야 할 **유의사항**이 몇 가지 존재하는데, 대표적으로 아래의 4가지 유의사항들이 존재한다.

1. 파생된 CSS셀렉터 사용금지
2. Id 셀렉터 사용금지
3. !Important 사용금지
4. 다른 개발자들이 이해할 수 있도록 class 이름을 의미있게 지어야 함
