---
date: "2024-01-27"
title: "[HTML] role="alert" 속성"
categories: ["HTML"]
summary: "role="alert"는 웹 접근성을 개선하기 위해 사용되는 ARIA (Accessible Rich Internet Applications) 속성 중 하나입니다."
thumbnail: "./HTML.png"
---

**`role="alert"`**는 웹 접근성을 개선하기 위해 사용되는 ARIA (Accessible Rich Internet Applications) 속성 중 하나입니다. 이 속성은 스크린 리더 및 다른 보조 기술을 사용하는 사용자에게 중요한 내용 또는 오류 메시지를 자동으로 전달하는 데 사용됩니다.

 사용자가 웹 페이지를 탐색하다가 중요한 정보나 오류 메시지를 놓치지 않도록 도와줍니다.

예를 들어, 아래와 같이 **`role="alert"`**를 사용하여 오류 메시지를 나타낼 수 있습니다:

```html

<div role="alert">
  이메일 주소를 입력하세요.
</div>

```

이렇게 하면 이메일 주소를 입력해야 하는 경우 스크린 리더가 "이메일 주소를 입력하세요"라고 읽어 주고, 사용자가 이메일 주소를 입력하면 다시 "이메일 주소를 입력하세요"라고 읽어줄 필요가 없습니다. 즉, **`role="alert"`**를 사용하여 중요한 정보나 오류 메시지를 명확하게 전달할 수 있으며, 웹 페이지의 접근성을 향상시킬 수 있습니다.