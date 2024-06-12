---
date: "2024-01-19"
title: "[React] Import Export (+default), 파일경로(상대경로, 절대경로)"
categories: ["React"]
summary: "다른 파일에서 데이터 불러오는 방법."
thumbnail: "./reacticon.png"
---

다른 파일에서 데이터 불러오는 방법

<따로만든.js>

```jsx
let a = 10;

export default a;
```

이건 ‘따로만든.js’ 에서 a라는 변수를 export 했다는 뜻 -> 다른 파일에서 import해서 사용할 수 있다.
사용할 파일에 import 작명 from './data.js'; 하면 된다.

export 여러개 하고싶다면

`export {변수1, 변수2…};`

하면된다.

import 여러개 하려면

`import {변수1, 변수2…} from ‘경로’` 하면 된다. 

경로는 ./ 부터 시작해야한다

`import data from './data.js';` 처럼

변수, 함수, 자료형 전부 export 가능합니다.

파일마다 export default 라는 키워드는 하나만 사용가능합니다.

export default 를 사용하면 import 할때 자유롭게 작명할 수 있다.

## 파일경로

- 상대경로 : ./~~/~~
(./ → 현재 선택한 파일위치)
- 절대경로 :  @/루트디렉토리/~~~