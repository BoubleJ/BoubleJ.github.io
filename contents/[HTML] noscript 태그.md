---
date: "2024-03-03"
title: "[HTML] <noscript> 태그"
categories: ["Html"]
summary: "<noscript> 태그는 클라이언트 사이드 스크립트(client-side scripts)를 사용하지 않도록 설정했거나, 스크립트를 지원하지 않는 브라우저를 위한 별도의 콘텐츠를 정의할 때 사용합니다."
thumbnail: "./HTML.png"
---

`<noscript>` 태그는 클라이언트 사이드 스크립트(client-side scripts)를 사용하지 않도록 설정했거나, 스크립트를 지원하지 않는 브라우저를 위한 별도의 콘텐츠를 정의할 때 사용합니다.

`<noscript>` 요소는 `<body>` 요소나 `<head>` 요소 둘 중 어디에도 위치할 수 있지만, `<head>` 요소에 위치할 때는 `<link>`, `<meta>`, `<style>` 요소만을 콘텐츠로 포함할 수 있습니다. `<noscript>` 요소에 포함된 콘텐츠는 사용자의 브라우저가 스크립트의 사용을 비활성화하였거나, 스크립트를 지원하지 않는 경우 화면에 표시될 것입니다.

또한, 클라이언트 사이드 스크립트를 지원하지 않는 브라우저에서는 스크립트의 내용이 그대로 화면에 출력될 수 있으므로, 다음과 같이 주석을 활용하여 스크립트의 내용이 화면에 나타나지 않도록 설정할 수도 있습니다.

```html
<script>
  document.getElementById("demo").innerHTML = "Hello World!";
</script>
<noscript>
  현재 사용 중인 브라우저는 스크립트를 지원하지 않거나, 해당 기능이 활성화되어
  있지 않습니다!
</noscript>
```
