---
date: "2024-07-15"
title: "[Tailwind] Tailwind Vite 적용"
categories: ["Tailwind"]
summary: "vite로 만든 react에 tailwind 적용이 안될 경우 해결방법"
thumbnail: "./테일윈드.png"
---


vite로 react 프로젝트 생성 후 tailwind를 적용하려했습니다.

근데 안되더라구요..

[tailwind vite 적용 공식문서](https://tailwindcss.com/docs/guides/vite?source=post_page-----bba56dcae003--------------------------------)

분명 공식문서대로 했는데 말이죠..

심지어 에러도 안뜹니다. 정말 무책임해요

이리저리 구글링하다 방법을 찾아냈습니다.

<br>
<br>

## React — Tailwind CSS Is Not Working In Vite + React Solution (2024 updated)


원인은 정확하게 모르겠지만 vite에 tailwind를 적용하려면 `vite.config.ts`에 별도 css 설정을 해줘야합니다.


```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },

});
```

다음과 같이 세팅하면 됩니다.


<br>
공식문서에도 설명이 없어서 해결하는데 애 좀 먹었습니다... 

> 업데이트 좀 빨리해주세요 tailwind씨..



<br>
<br>
<br>

<details>

<summary>참고문헌</summary>

<div markdown="1">

https://medium.com/@rubybellekim/react-tailwind-css-is-not-working-in-vite-react-solution-2024-updated-bba56dcae003

</div>

</details>