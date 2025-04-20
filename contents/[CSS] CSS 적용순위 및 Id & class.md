---
date: "2023-02-10"
title: "[CSS] CSS 적용순위 및 Id & class"
categories: ["CSS"]
summary: "CSS 적용순위를 알아봅시다."
thumbnail: "./css-logo.png"
---

# 적용 순위

!important
inline style (html 파일내 태그안에 쓴 경우)
#id
.class
tag
상속되는 속성

앵간해선 id, class 선에서 css 를 끝내는게 좋다

(id는 거의 사용안함 걍 참고만할 것)

id는 .
class는 #

같은 클래스는 더 밑에 있는 코드에 적용된다. 링크 태그도 마찬가지

ex. 

```html
<link rel="stylesheet" href="bootstrap.css">

    <link rel="stylesheet" href="bootstrap2.css">

```

이런구조면 겹치는 클래스가 있는 경우 bootstrap2.css 파일에 적용된다. 

specificity 점수 높이면 우선순위가 높아진다.

```css
.size .black{
    width: 500px;
    height: 500px;
}

.black {
    width: 300px;
}
```

클래스명을 더 많이 쓴 셀렉터(.size .black)가 더 우선순위

근데 셀렉터는 길면 가독성이 안좋으니 지양할 것