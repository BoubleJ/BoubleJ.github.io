---
date: "2024-05-09"
title: "[키워드 프로젝트] TypeScript SVG 파일 미인식 이슈 해결"
categories: ["Keyword"]
summary: "타입스크립트가 svg파일을 인식하지 못해 생긴 에러를 해결했습니다."
thumbnail: "/image/타입스크립트아이콘.png"
---

# 문제발생

```tsx
import Arrow_Forward from "assets/icons/arrow_forward.svg?react";
```

svg파일을 import해서 사용하는 컴포넌트에서 다음과 같은 에러가 발생했습니다

> `Cannot find module 'assets/icons/arrow_forward.svg?react' or its corresponding type declarations.`

일단 svg파일을 사용하긴 합니다....

```tsx
import Arrow_Forward from "assets/icons/arrow_forward.svg?react";
```

![화살표잘나옴](/image/화살표잘나옴.png)

화살표 아이콘이 렌더링되는걸보니 사용하긴 하는군요...

<br>

# 원인 및 해결

이 현상은 TypeScript가 SVG 파일과 같은 사용자 정의 파일 가져오기를 인식하지 못하기 때문에 발생하는 오류입니다. 즉 타입스크립트에 svg 관련 설정을 별도로 안했기 때문에 타입스크립트 입장에선 '이건뭐야?? 난 모르는 존재야!' 라고 말하는 겁니다.

해결방법은 TypeScript 프로젝트에서 SVG를 가져오기를 위한 모듈을 선언해야 합니다.

## 1. 선언 파일을 생성

SVG 모듈을 위한 선언 파일을 생성하고 다음과 같은 코드를 작성해줍니다.

```ts
//custom.d.ts
//파일명은 자유롭게 작명해도좋습니다. 꼭 custom이 아니어도 됩니다.

declare module "*.svg?react" {
  import React = require("react");
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
```

<br>

## TypeScript가 선언 파일을 포함하도록 설정

`tsconfig.json` 파일을 다음과 같이 수정해줍니다.

```json
{
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/custom.d.ts"]
}
```

TypeScript에 \*.svg?react 패턴과 일치하는 파일을 React 컴포넌트로 처리하도록 지시하는 설정입니다.

위와 같이 세팅하면 에러가 사라진 것을 확인할 수 있습니다.
