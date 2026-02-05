---
date: "2025-03-05"
title: "[Next.js] Colorzilla Extension에 의한 next.js 15 hydration 에러"
categories: ["Next.js"]
summary: "크롬 익스텐션인 Colorzilla 때문에 에러도 발생하네요."
thumbnail: "/image/하이드레이션에러.png"
---

# Next.js 레이아웃에서 탭 링크 이동 시 스크롤이 맨 위로 가지 않는 이슈

이 글에서는 이 프로젝트에서 겪은 스크롤 관련 이슈를 소개합니다.

## 전제: 프로젝트 구조

Layout을 공유한다는 전제가 있습니다. `/about`, `/dashboard` 페이지 모두 동일한 Layout 컴포넌트를 사용합니다. 이 Layout은 Next.js의 layout 영역에서 감싸서 사용됩니다.

Layout 컴포넌트의 루트 div에는 **padding-top 512**로 적용되어 있습니다 (Tailwind 클래스 `pt-128`). 상단에 여백이 있어, 고정된 헤더 아래로 메인 콘텐츠가 배치되는 구조입니다.

## 재현 조건

사용자가 페이지를 스크롤했지만, **padding-top(512) 영역보다 적게** 스크롤한 상태에서, Layout에 있는 링크 탭(home / About / Dashboard)을 눌러 다른 페이지로 이동하는 경우를 말합니다.

## 나타나는 현상

페이지는 정상적으로 이동합니다. 다만 이동한 페이지에서 스크롤이 맨 위로 초기화되지 않고, 이전 페이지의 스크롤 위치가 그대로 유지되는 현상이 나타납니다.

<br>
<br>
<br>

<details>

<summary>참고문헌</summary>

<div markdown="1">

https://github.com/vercel/next.js/discussions/72035

https://dev-astra.tistory.com/669

</div>

</details>
