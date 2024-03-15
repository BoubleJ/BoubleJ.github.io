---
date: "2023-09-02"
title: "[Gatsby 블로그 제작일지] 페이지 라우팅 방법"
categories: ["Gatsby, React, routing"]
summary: "Gatsby 페이지 라우팅 기능을 구현하는 과정을 기록해보겠습니다."
thumbnail: "./test.png"
---

Gatsby 페이지 라우팅 기능을 구현하는 과정을 기록해보겠습니다.

모든 개발 작업의 근간은 공식문서로 기인한다해도 과언이 아니라 생각됩니다.
물론 모든 공식문서가 모든 개발자에게 도움이 된다 생각하진 않습니다. 생각보다 설명이 개떡같은 곳도 많거든요.

그래도 Gatsby는 나름 친절한 공식문서 중 하나라 생각됩니다.
이번 페이지 라우팅 방법도 공식문서를 참고하니 간단히 해결할 수 있었습니다.

[Gatsby 페이지 라우팅 방법](https://www.gatsbyjs.com/docs/reference/routing/creating-routes/)

위 링크를 참고하시면 보다 정확한 방법을 학습하실 수 있습니다.

<br><br>
<br>

인용문이 번역된 내용입니다.

Define routes in src/pages

> src/pages에서 경로 정의

Gatsby generates pages for each .js file inside src/pages. The browser path is generated from the file path.

Add this component to src/pages/index.js to create a home page for your site.

> Gatsby는 src/pages 내에서 각 .js 파일의 page를 생성합니다. 브라우저 경로는 파일 경로에서 생성됩니다.
> 이 구성 요소를 src/pages/index.js에 추가하여 사이트의 홈 페이지를 만듭니다.

```js
src/pages/index.js
Copysrc/pages/index.js: copy code to clipboard
import * as React from "react"

export default function Index() {
  return <div>Hello world</div>
}
```

For example, src/pages/contact.js creates the page yoursite.com/contact, and src/pages/home.js creates the page yoursite.com/home. This works at whatever level the file is created at. If contact.js is moved to a directory called information, located inside src/pages, the page will now be created at yoursite.com/information/contact.

> 예를 들어, src/pages/contact.js는 yoursite.com/contact, 페이지를 만들고 src/pages/home.js는 yoursite.com/home 페이지를 만듭니다. 이것은 파일이 생성되는 모든 수준에서 작동합니다. contact.js가 src/pages 내부에 있는 information라는 디렉토리로 이동하면 페이지는 이제 yoursite.com/information/contact 에서 생성됩니다.

The exception to this rule is any file named index.js. Files with this name are matched to the root directory they’re found in. That means index.js in the root src/pages directory is accessed via yoursite.com. However, if there is an index.js inside the information directory, it is created at yoursite.com/information.

> 이 규칙의 예외는 index.js라는 이름의 파일입니다. 이 이름을 가진 파일은 발견된 루트 디렉터리에 일치합니다. 즉, 루트 src/페이지 디렉터리의 index.js는 yoursite.com 를 통해 액세스됩니다. 그러나 정보 디렉터리 내부에 index.js가 있으면 yoursite.com/information 에서 생성됩니다.

저 같은 영알못들은 얼른 파파고를 돌려봅시다.

번역이 자연스럽진 않지만 얼추 이해할 수 있겠죠?

정리하자면 라우팅방법은 크게 2가지로 나눌 수 있습니다.
첫 번째는 pages 폴더 내부에 js파일 생성.
두 번째는 pages 폴더에 또 다른 디렉토리 폴더를 생성한 후 그 폴더 내부에 index파일 생성.

저는 두 가지 방법을 모두 채택해 사용했습니다.

```
📦pages
┣ 📂computerScience
┃ ┗ 📜index.tsx
┣ 📂language
┃ ┗ 📜index.tsx
┣ 📂project
┃ ┗ 📜index.tsx
┣ 📜404.tsx
┣ 📜about.tsx
┣ 📜index.css
┣ 📜index.tsx
┗ 📜tag.tsx
```

제 프로젝트 디렉토리 구조 예시입니다. pages 폴더는 src 폴더 내부에 존재하고 pages 폴더 내부에는 위 구조와 같이 4개의 파일과 3개의 폴더가 존재합니다.

위 구조대로 프로젝트를 구현했다면 페이지 라우팅 주소는 다음과 같습니다.

1. localhost:8000/ -> 메인페이지
2. localhost:8000/404 -> 에러페이지
3. localhost:8000/computerScience
4. localhost:8000/language
5. localhost:8000/project
6. localhost:8000/about
7. localhost:8000/tag

각각 페이지 content는

1. localhost:8000 -> pages/index.tsx 코드
2. localhost:8000/404 -> pages/404.tsx 코드
3. localhost:8000/computerScience -> pages/computerScience/index.tsx 코드
4. localhost:8000/language -> pages/language/index.tsx 코드
5. localhost:8000/project -> pages/project/index.tsx 코드
6. localhost:8000/about -> pages/about.tsx 코드
7. localhost:8000/tag -> pages/tag.tsx 코드

입니다.

어디 실제로 잘 구현 되는지 확인해볼까요??

![](https://velog.velcdn.com/images/dogmnil2007/post/ccaa91b2-073e-4666-8590-85e852339ddb/image.png)
위 코드는 제 gatsby 프로젝트의 실제 코드입니다.

위에 작성대로 링크로 접속해보면
![](https://velog.velcdn.com/images/dogmnil2007/post/90f0d596-f6e6-4b28-8a95-111576f4422f/image.png)
위 코드대로 렌더링 되는 것을 확인할 수 있습니다.

<br><br>

이번에는 tag.tsx 페이지를 접속해보도록 하겠습니다.  
![](https://velog.velcdn.com/images/dogmnil2007/post/5778b0f3-c4d7-4a26-a53c-7158709e4993/image.png)

![](https://velog.velcdn.com/images/dogmnil2007/post/f2890fb1-6be4-423f-9cba-c2d24fdd2344/image.png)

정상적으로 렌더링 되는 것을 확인할 수 있습니다.

<br><br>
<br>

이번에는 중첩라우팅입니다.

project 폴더는 제가 진행한 프로젝트를 정리해서 포스팅할 공간이기 때문에 중첩라우팅을 적용할 생각입니다.

> 이 규칙의 예외는 index.js라는 이름의 파일입니다. 이 이름을 가진 파일은 발견된 루트 디렉터리에 일치합니다. 즉, 루트 src/페이지 디렉터리의 index.js는 yoursite.com 를 통해 액세스됩니다. 그러나 정보 디렉터리 내부에 index.js가 있으면 yoursite.com/information 에서 생성됩니다.

공식문서의 내용에 의거하여

```
📦pages
┣ 📂project
┃ ┣ 📂gatsby
┃ ┃ ┗ 📜index.tsx
┃ ┗ 📜index.tsx
```

다음과 같이 프로젝트 폴더 구조를 형성하면

localhost:8000/project/gatsby 주소는

pages/project/gatsby/index.tsx

코드 내용이 렌더링 됩니다.

![](https://velog.velcdn.com/images/dogmnil2007/post/8a8ee791-2444-4c4d-817b-16916988c99f/image.png)

![](https://velog.velcdn.com/images/dogmnil2007/post/9a706d84-36aa-41ec-a0d6-717655be6e5c/image.png)

잘 동작하는 것을 확인할 수 있습니다.

간단하게 페이지 라우팅 방법을 구현해보았습니다. 순수 리액트의 경우 route 라이브러리를 불러와서 따로 작업해줘야하는 번거로움이 있는데 gatsby나 next는 페이지 라우팅을 지원해주니 매우 편리한 것 같습니다.

동작원리는 추후 Gatsby 이론편에서 별도로 포스팅하도록 하겠습니다.
