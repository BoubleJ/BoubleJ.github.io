---
date: "2024-02-18"
title: "[키워드 프로젝트] bootstrap css 미적용"
categories:
  [
    "Keyword",
    "Project",
    "React",
    "UI",
    "TroubleShooting",
    "ReactBootStrap",
    "CSS"
  ]
summary: "bootstrap은 install만하면 css 스타일속성은 안가져온다."
thumbnail: "./reactbootstrap.png"
---

bootstrap은 install만하면 css 스타일속성은 안가져온다.

```tsx
{
  /* The following line can be included in your src/index.js or App.js file */
}
import "bootstrap/dist/css/bootstrap.min.css";
```

공식문서 설명대로 css파일도 별도로 import 해야한다.
