# 에픽의 개발 블로그

[Astro](https://astro.build) 기반 기술 블로그입니다. 콘텐츠는 `src/content/`의 MDX로 관리하며,
GitHub Pages로 배포합니다.

## 개발

```bash
npm install
npm run develop   # astro dev — http://localhost:4321
```

## 빌드 / 미리보기

```bash
npm run build   # astro build → dist/
npm run serve   # astro preview — 빌드 결과 로컬 확인
```

## 기타

```bash
npm run lint        # biome check .
npm run lint:fix     # biome check --write .
npm run format       # biome format --write .
npm run clean         # dist, .astro 캐시 삭제
```

main 브랜치 push 시 GitHub Actions가 자동으로 빌드 후 GitHub Pages에 배포합니다.
