---
date: "2023-01-30"
title: "[CSS] 폰트(font) 적용"
categories: ["CSS"]
summary: "구글 폰트가면 다양한 폰트가 있다. 트래픽도 줄일 수 있다."
thumbnail: "./css-logo.png"
---

```css
@font-face {
  font-family: "자유롭게 작명";
  src: url(../font/폰트이름.tts);
}

body {
  font-family: "자유롭게 작명";
}
```

src는 폰트파일 경로, font-family는 폰트 이름

이렇게 만들면 폰트를 쓸 수 있다.

한글 폰트 tts는 파일 사이즈가 크니까 1,2개만 쓰도록하자.

woff 파일은 용량이 작으니 woff를 쓰도록하자.

구글 폰트가면 다양한 폰트가 있다. 트래픽도 줄일 수 있다.
