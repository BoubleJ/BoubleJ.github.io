---
date: "2026-03-05"
title: "로깅과 비즈니스 로직 분리 작업 (React Children API)"
categories: ["React"]
summary: "GaEventTag 컴포넌트로 로깅을 선언적으로 분리하고, 비즈니스 컴포넌트의 책임을 정리한 리팩토링 사례를 공유합니다."
thumbnail: "/thumbnail/리액트.png"
---

# 로깅은 감싸고, 비즈니스는 남긴다

서비스가 커질수록 로깅은 점점 정교해집니다. 문제는 그 정교함이 종종 비즈니스 컴포넌트의 인터페이스를 오염시킨다는 점입니다. 이번 글은 `TabMenu`에 섞여 있던 GA 로깅 책임을 `GaEventTag`로 분리해, 컴포넌트 경계를 다시 세운 리팩토링 사례를 정리한 글입니다.

## 1. 발단: 왜 이 리팩토링이 필요했나

처음에는 탭 UI에 필요한 데이터와 상태만 전달하면 충분했습니다. 하지만 GA 이벤트 요구사항이 늘어나면서 `TabMenu`는 UI 컴포넌트이면서 동시에 로깅 설정 컴포넌트가 되었습니다.

```tsx
<HeadingBox
  id={id}
  title="무료쿠폰으로 볼 수 있는 작품"
  link={landingLinks[freeCouponIdx] ?? landingLinks[0]}
  className={className}
>
  <TabMenu
    data={data}
    state={freeCouponState}
    id={id}
    gaEventKey="mainPage"
    gaEventSubKey="recomContent"
    gaFnArgs={['무료쿠폰으로볼수있는작품', item]}
  />
</HeadingBox>
```

이 구조의 본질적인 문제는 다음과 같았습니다.

- 비즈니스 props와 로깅 props가 한 컴포넌트 인터페이스에 섞임
- 로깅 요구사항 변경이 `TabMenu` 타입/제네릭 변경으로 전파됨
- 기능 수정 없이도 리뷰 범위가 넓어지고, 협업 충돌 가능성이 증가함

즉, 컴포넌트가 “화면 상태를 제어하는 책임”과 “분석 이벤트를 전송하는 책임”을 동시에 지게 된 것이 핵심 병목이었습니다.

## 2. 기존 구조의 한계

기능은 정상이었지만 설계 비용이 계속 누적되고 있었습니다.

```tsx
interface TabProps<K extends TGTMEventKey, SubK extends TGTMEventSubKey<K>>
  extends TOptional<IGTMEventProps<K, SubK>> {
  data: TTabData[];
  state: RecoilState<number>;
  initialSlide?: number;
  id: string;
}

export default function TabMenu<K extends TGTMEventKey, SubK extends TGTMEventSubKey<K>>({
  data,
  state,
  id,
  initialSlide,
  ...rest
}: TabProps<K, SubK>) {
  return (
    <>
      <TabList data={data} state={state} id={id} initialSlide={initialSlide} {...rest} />
      <PanelList data={data} state={state} id={id} />
    </>
  );
}
```

이처럼 컴포넌트 시그니처에 로깅 타입이 결합되면, 비즈니스 변경이 없더라도 제네릭 추론 맥락을 계속 따라가야 합니다. 특히 `K`와 `SubK`의 관계를 유지한 채 props를 확장해야 해서, 리팩토링·리뷰·온보딩 모두에서 인지 비용이 커집니다.

- 로깅 스펙이 추가될수록 `TabMenu`의 공개 인터페이스가 비대해짐
- 로깅 타입 안정성을 위해 제네릭이 늘어나며 진입 장벽이 높아짐
- 팀 단위 작업에서 단순 UI 변경에도 로깅 파라미터 컨텍스트를 함께 이해해야 함

결국 “사용하기 쉬운 컴포넌트”가 아니라 “실수하기 쉬운 컴포넌트”가 되기 시작했습니다.

## 3. 해결 전략: `GaEventTag` 도입

핵심 전략은 단순합니다. 로깅을 props로 밀어 넣지 않고, 래퍼 컴포넌트로 감쌉니다.

```tsx
'use client'

import { Children, cloneElement, type ReactElement, useCallback } from 'react'
import { useGTMEvent } from '@/src/common/hooks/ga/useGTM'
import type { GTMEventPage, GTMEventProps, GTMEventSection, GTMEventTags } from '@/src/common/utils/ga/types'

interface GaEventTagProps {
  children: ReactElement
}

export default function GaEventTag<P extends GTMEventPage, S extends GTMEventSection<P>>({
  children,
  page,
  section,
  tags = [] as GTMEventTags<P, S>,
}: GTMEventProps<P, S> & GaEventTagProps) {
  const sendGAEvent = useGTMEvent(page, section)
  const child = Children.only(children)

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      sendGAEvent(...tags)

      const originalOnClick = child.props?.onClick
      if (typeof originalOnClick === 'function') {
        originalOnClick(event)
      }
    },
    [sendGAEvent, tags, child.props?.onClick],
  )

  return cloneElement(child, {
    onClick: handleClick,
  })
}
```

이 컴포넌트의 설계 포인트는 네 가지입니다.

- `useGTMEvent(page, section)`으로 로깅 컨텍스트를 UI 컴포넌트 밖으로 이동
- `Children.only`로 단일 인터랙션 대상만 감싼다는 계약을 강제
- `cloneElement`로 자식의 클릭 시점에 로깅을 선언적으로 주입
- 기존 `onClick`을 보존해 비즈니스 동작 회귀를 차단

### 인터페이스 변화

- `TabMenu` Before: 비즈니스 데이터 + 로깅 데이터를 함께 받는 복합 인터페이스
- `TabMenu` After: UI 상태/데이터 중심 인터페이스로 축소
- `GaEventTag`: `page`, `section`, `tags`, `children(단일 ReactElement)` 계약 담당

관점이 바뀌면 코드가 단순해집니다. 비즈니스 컴포넌트는 “무엇을 렌더링하고 어떤 상태를 바꾸는지”에 집중하고, 로깅은 “어떤 인터랙션을 추적할지”에 집중합니다.

## 4. 적용 중 제약과 구조 재설계

초기 적용은 `TabMenu`를 통째로 감싸는 방식이었습니다.

```tsx
<GaEventTag page="mainPage" section="recomContent" tags={['관심장르주간랭킹', item]}>
  <TabMenu
    data={data}
    state={freeCouponState}
    id={id}
    gaEventKey="mainPage"
    gaEventSubKey="recomContent"
    gaFnArgs={['무료쿠폰으로볼수있는작품', item]}
  />
</GaEventTag>
```

하지만 `GaEventTag`는 `Children.only` 계약을 사용하기 때문에, 다중 자식을 가진 구조를 그대로 감쌀 수 없습니다. 이 제약을 우회하는 대신, 구조를 의도에 맞게 재정의했습니다.

- 탭 반복 렌더링을 `TabMenu` 내부에서 상위로 끌어올림
- 이벤트 추적 단위를 “컨테이너”가 아니라 “실제 클릭 요소(Button)”로 맞춤
- 버튼마다 `GaEventTag`를 명시적으로 배치해 선언성을 높임

```tsx
<HeadingBox
  id={id}
  title="관심 장르 주간 랭킹"
  link={link ?? ''}
  className={className}
>
  <div className={cn(LIST_TAB_CLASS)} role="tablist">
    {tabList.map((item, index) => {
      const selected = item === selectedTab
      return (
        <GaEventTag
          key={`${item}Tab`}
          page="mainPage"
          section="recomContent"
          tags={['관심장르주간랭킹', item]}
        >
          <Button
            variant={selected ? 'solid-round' : 'outline-round'}
            size="xsmall"
            color={selected ? selectedTabColor : 'bright-01'}
            className={cn(BTN_TAB_CLASS)}
            onClick={() => setSelectedTab(item)}
            id={`${id}Tab${index}`}
            role="tab"
            aria-selected={selected}
            aria-controls={panelId}
          >
            {item}
          </Button>
        </GaEventTag>
      )
    })}
  </div>
</HeadingBox>
```

이 변경은 단순한 코드 이동이 아니라, 이벤트의 소유권을 정확히 정렬한 작업이었습니다. “어디서 클릭이 발생하는가”와 “어디서 로깅을 선언하는가”가 동일한 레이어에 놓이면서 코드 해석 비용이 크게 줄었습니다.

## 5. 협업/유지보수 관점에서의 효과

숙련된 프론트엔드 협업 관점에서, 이번 분리는 다음 이점을 만들었습니다.

- 로깅 요구사항 변경이 `TabMenu` 인터페이스 변경으로 전파되지 않음
- 타입 변경 범위가 축소되어 PR 충돌과 리뷰 부하가 감소함
- 장애 분석 시 UI 동작 문제와 분석 이벤트 문제를 분리해 추적 가능
- 공통 래퍼 패턴으로 팀 내 로깅 구현 방식이 표준화됨

React 베스트 프랙티스 관점에서도 일관됩니다.

- 컴포지션으로 횡단 관심사를 확장함
- 단일 책임 원칙을 컴포넌트 경계에 반영함
- 기존 핸들러를 보존해 확장 시 회귀 가능성을 낮춤
- 비즈니스 테스트와 로깅 테스트를 분리 가능한 구조를 확보함

## 6. 결론: 실무 원칙 체크리스트

이번 리팩토링에서 얻은 원칙은 명확합니다.

- 로깅을 비즈니스 컴포넌트 props에 계속 누적하지 않는다.
- 횡단 관심사는 래퍼/훅으로 선언적으로 분리한다.
- 추적은 컨테이너가 아니라 실제 인터랙션 단위에서 선언한다.
- `Children.only` 같은 계약은 우회하지 말고, 구조를 재정의해 해결한다.

로깅은 반드시 필요합니다. 다만 로깅 때문에 핵심 UI 컴포넌트가 복잡해지기 시작했다면, 그 시점이 바로 경계를 다시 그어야 할 타이밍입니다.

