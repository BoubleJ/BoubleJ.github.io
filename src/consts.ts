// src/consts.ts — gatsby-config.js의 siteMetadata 대체
export const SITE = {
  title: "BoubleJ's Blog",
  // v2-10: 구글이 스니펫으로 채택하도록 구체화된 문구 — 실행 전 사용자 확정 필요 (스펙 v2-10 초안)
  description:
    "React, Next.js, TypeScript 등 프론트엔드 개발을 하며 마주친 문제와 해결 과정, 궁금했던 점을 깊이 있게 정리하는 BoubleJ의 기술 블로그입니다.",
  siteUrl: "https://boublej.github.io/",
  author: "BoubleJ",
} as const;
