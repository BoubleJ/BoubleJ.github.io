---
date: "2023-03-11"
title: "[Next.JS] use client 활용"
categories: ["Next.JS"]
summary: "csr 훅(usestate 등)은 ssr페이지(컴포넌트)에서 사용할 수 없다."
thumbnail: "./NEXT.png"
---

csr 훅(usestate 등)은 ssr페이지(컴포넌트)에서 사용할 수 없다
-> ssr페이지에 'use client'를 줘야 사용할 수 있다.

‘use client’를 주면 csr 컴포넌트로 변환된다.  

큰 페이지는 서버 컴포넌트로 유지하는 것이 좋다. 클라이언트 컴포넌트는 seo 기능에 전혀 도움이 안되기 때문