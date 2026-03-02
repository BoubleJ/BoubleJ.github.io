---
date: "2025-12-02"
title: "로깅과 비즈니스 로직 분리 작업 (React Children API)"
categories: ["React"]
summary: "React Children API를 활용해 로깅과 비즈니스 로직 관심사를 분리해봅시다."
thumbnail: "/thumbnail/리액트.png"
---


# 배경

```ts
export default function Proposal() {
  return (
    <article className={cn(st['wrap-proposal'])}>
      <span>소중한 웹툰 작가님</span>을 모십니다.
      <CustomLinkWithGaEvent
        href={'/event/?eid=3443'}
        className={cn(st['link-page'])}
        gaEventKey={'mainPage'}
        gaEventSubKey={'proposal'}
        gaFnArgs={[]}
      >
        연재문의
      </CustomLinkWithGaEvent>
    </article>
  );
}
```

```ts
export default function Proposal() {
  return (
    <article className={cn(st['wrap-proposal'])}>
      <span>소중한 웹툰 작가님</span>을 모십니다.
        <GaEventTag page="mainPage" section="proposal">
        <CustomLink href="/event/?eid=3443" className={cn(st['link-page'])}>
          연재문의
        </CustomLink>
      </GaEventTag>
    </article>
  );
}
```

```ts

export default function GaEventTag<P extends GTMEventPage, S extends GTMEventSection<P>>({
  children,
  page,
  section,
  tags = [] as GTMEventTags<P, S>,
}: GTMEventProps<P, S> & GaEventTagProps) {
  const sendGAEvent = useGTMEvent(page, section);
  const child = Children.only(children);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      sendGAEvent(...tags);

      const originalOnClick = child.props?.onClick;
      if (typeof originalOnClick === 'function') {
        originalOnClick(event);
      }
    },
    [sendGAEvent, tags, child.props?.onClick],
  );

  return cloneElement(child, {
    onClick: handleClick,
  });
}

```

```ts
'use client';

import CustomLink, { CustomLinkType } from '@/src/common/components/link';
import { MouseEvent } from 'react';
import { typedMemo } from '@/src/common/utils/common';
import { useGTMEvent } from '@/src/common/hooks/ga/useGTM';
import { GTMEventProps, GTMEventKey, GTMEventSubKey } from '@/src/common/utils/ga/types';

function CustomLinkWithGaEvent<K extends GTMEventKey, SubK extends GTMEventSubKey<K>>({
  children,
  gaEventKey,
  gaEventSubKey,
  gaFnArgs,
  ...props
}: GTMEventProps<K, SubK> & CustomLinkType) {
  const sendGAEvent = useGTMEvent(gaEventKey, gaEventSubKey);
  const clickHandler = (e: MouseEvent<HTMLAnchorElement>) => {
    sendGAEvent(...gaFnArgs);
    props.onClick && props.onClick(e);
  };

  return (
    <CustomLink {...props} onClick={clickHandler}>
      {children}
    </CustomLink>
  );
}

export default typedMemo(CustomLinkWithGaEvent);

```



이미지 업로드
![네이버하이퍼링크](네이버하이퍼링크.png)


<br>
<br>
<br>

<details>

<summary>참고문헌</summary>

<div markdown="1">

안녕

</div>

</details>
