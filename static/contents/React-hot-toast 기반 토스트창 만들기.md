---
date: "2026-03-01"
title: "React-hot-toast 기반 토스트창 만들기 (작성중)"
categories: ["React"]
summary: "React-hot-toast 기반 토스트창 만들기."
thumbnail: "/thumbnail/React-hot-toast.png"
---

기존

```ts

function getNewValue({ type, message, duration, component }: ShowToastProps): Toast {
  const time = dayjs().valueOf()
  const endTime = time + duration!

  return {
    id: time.toString(),
    duration: endTime,
    message: component ? ToastComponent[component] : message,
    type: type!,
  }
}

/**
 * @deprecated useToast은 앞으로 사용하지 않을 예정입니다. v2/Toast를 사용해주세요.
 */
export default function useToast() {
  const [toast, setToast] = useRecoilState(toastState)

  const isShowToast = toast.length > 0

  const showToast = useCallback(
    ({ message, component, type = 'basic', duration = 3_000, isForce = true }: ShowToastProps) => {
      if (!message && !component) throw new Error('message or componentType is required')

      const newValue = getNewValue({ message, type, duration, component })

      if (isForce)
        setToast((prev) => {
          const infinityValues = prev.filter((item) => item.duration === Infinity)
          return [newValue, ...infinityValues]
        })
      else setToast((prev) => [...prev, newValue])

      return newValue.id
    },
    [],
  )

  const clearToast = useCallback((ids: string | string[]) => {
    const deleteToast = (id: string) => {
      setToast((prev) => prev.filter((item) => item.id !== id))
    }

    if (Array.isArray(ids)) ids.forEach(deleteToast)
    else deleteToast(ids)
  }, [])

  const allClearToast = useCallback(() => {
    setToast([])
  }, [])

  return { toast, isShowToast, showToast, clearToast, allClearToast }
}

```

```ts

const useHarmfulToast = (path: string) => {
  const isPathShowToast = usePathname().split('/').filter(Boolean).includes(path)
  const params = useSearchParams()
  const outLink = params.get('outlink')
  const [activeToastId, setActiveToastId] = useState<string | undefined>(undefined)
  const { showToast, clearToast } = useToast()
  const { harmfulMediaLevel } = useWebContext()

  const resetHarmfulToast = () => {
    if (activeToastId) {
      setActiveToastId(undefined)
      clearToast(activeToastId)
    }
  }
  const updateHarmfulToast = (containsAdultContent: boolean) => {
    const hasOutLink = outLink?.toLowerCase() === 'ok'
    const isCurrentToastActive = containsAdultContent && activeToastId

    const isAdultLevel = harmfulMediaLevel === HARMFUL_MEDIA_LEVEL.ADULT
    const isUnverifiedLevel = harmfulMediaLevel === HARMFUL_MEDIA_LEVEL.UNVERIFIED

    // 토스트창 active 중 or 성인계정 or 미인증계정 이면 토스트창 미노출
    if (isCurrentToastActive || isAdultLevel || isUnverifiedLevel) return
    // 로그아웃 or outlink가 아닐 경우 시 토스트창 미노출
    if (harmfulMediaLevel === HARMFUL_MEDIA_LEVEL.LOGOUT && !hasOutLink) return
    if (harmfulMediaLevel === HARMFUL_MEDIA_LEVEL.ADULT_OFF && isPathShowToast) return

    // 성인작품 미포함 시 토스트창 미노출
    if (!containsAdultContent) {
      resetHarmfulToast()
      return
    }

    const msgType = HARMFUL_MEDIA_LEVEL_TOAST[harmfulMediaLevel]

    if (msgType) {
      if ((msgType === 'iosApp' || msgType === 'androidApp' || typeof msgType === 'object') && !isPathShowToast) {
        resetHarmfulToast()
        return
      }
      const toastId = showToast({
        type: 'harmful',
        component: typeof msgType === 'object' ? msgType[path as keyof typeof msgType] : msgType,
        duration: Infinity,
      })
      setActiveToastId(toastId)
    }
  }

  useEffect(() => {
    if (!activeToastId) return () => {}

    const toastElem = document.getElementById(activeToastId)

    if (!toastElem) return () => {}

    const scrollHandler = () => {
      requestAnimationFrame(() => {
        const { scrollTop } = document.documentElement
        if (scrollTop > 0) {
          toastElem.classList.add('hide')
        } else {
          if (toastElem.classList.contains('absolute')) return
          toastElem.classList.remove('hide')
        }
      })
    }

    scrollHandler()
    window.addEventListener('scroll', scrollHandler)

    return () => {
      window.removeEventListener('scroll', scrollHandler)
      activeToastId && clearToast(activeToastId)
    }
  }, [activeToastId, clearToast])

  return updateHarmfulToast
}

export default useHarmfulToast

```
    - 문제점
        1. 내부에서 어떤 토스트창을 띄울 지 결정함 너무 복잡함…
        2. 로컬환경에서 2개 노출(순수함수가 아님)
        3. 유지보수가 너무 힘들고 웹접근성 준수 안됨


![로컬환경토스트창5중노출](/image/로컬환경토스트창5중노출.png)
![로컬환경토스트창이중노출](/image/로컬환경토스트창이중노출.png)


### shadcn 토스트창 sonner 기반



https://github.com/emilkowalski/sonner/blob/main/src/styles.css


```css

@media (max-width: 600px) {
  [data-sonner-toaster] {
    position: fixed;
    right: var(--mobile-offset-right);
    left: var(--mobile-offset-left);
    width: 100%;
  }

  [data-sonner-toaster][dir='rtl'] {
    left: calc(var(--mobile-offset-left) * -1);
  }

  [data-sonner-toaster] [data-sonner-toast] {
    left: 0;
    right: 0;
    width: calc(100% - var(--mobile-offset-left) * 2);
  }

  [data-sonner-toaster][data-x-position='left'] {
    left: var(--mobile-offset-left);
  }

  [data-sonner-toaster][data-y-position='bottom'] {
    bottom: var(--mobile-offset-bottom);
  }

  [data-sonner-toaster][data-y-position='top'] {
    top: var(--mobile-offset-top);
  }

  [data-sonner-toaster][data-x-position='center'] {
    left: var(--mobile-offset-left);
    right: var(--mobile-offset-right);
    transform: none;
  }
}
```

![토스트창좌측노출](/image/토스트창좌측노출.png)



## react hot toast


shadcn 토스트창


```ts

export default function Toast() {
  const { toasts } = useToasterStore()
  const pathname = usePathname()
  const { isActive, diffHeight } = useActiveVirtualKeyboard()

  // 토스트창 개수 제한 로직
  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= TOAST_LIMIT)
      .filter((t) => t.id !== FLOATING_TOAST_ID)
      .forEach((t) => {
        toast.dismiss(t.id)
      })
  }, [toasts])

  // path 변경 시 토스트 전부 제거
  useEffect(() => {
    if (!pathname) {
      return
    }
    toast.dismiss()
  }, [pathname])
  return (
    <Toaster
      position="bottom-center"
      gutter={16}
      reverseOrder={true}
      containerStyle={{
        zIndex: zToast,
        // 기본 bottom offset 16px, 가상 키보드가 떠 있을 때, offset 30px
        bottom: !isActive ? '16px' : `calc(30px + ${diffHeight}px + env(safe-area-inset-bottom, 0))`,
      }}
    >
      {(t) => (
        <ToastBar
          position="bottom-center"
          style={{
            padding: '0',
            maxWidth: '400px',
            minWidth: '100px',
            textAlign: 'center',
            background: 'transparent',
          }}
          toast={t}
        >
          {() => resolveValue(t.message, t)}
        </ToastBar>
      )}
    </Toaster>
  )
}

```

```ts
'use client'

import { throttle } from 'lodash'
import { useEffect, useRef } from 'react'
import type { Renderable, ToastOptions } from 'react-hot-toast'
import useActiveVirtualKeyboard from '@/src/common/hooks/useActiveVirtualKeyboard'
// from 'react-hot-toast' 가 아닌 만들어놓은 토스트객체 사용
import toast from './utils'

interface FloatingToastProps {
  message: Renderable
  options?: Omit<ToastOptions, 'duration' | 'id'>
}

export const FLOATING_TOAST_ID = 'floating-toast'
export default function FloatingToast({ message, options }: FloatingToastProps) {
  const { isActive } = useActiveVirtualKeyboard()
  //가상 키보드 오픈 시 유해매체 토스트창 제거 처리
  const prevIsActiveRef = useRef(isActive)

  const showToast = () => {
    toast(message, {
      duration: Infinity,
      id: FLOATING_TOAST_ID,
      style: {
        width: '100%',
        backdropFilter: 'blur(4px)',
        ...options?.style,
      },
      ...options,
    })
  }

  useEffect(() => {
    showToast()

    const handleScroll = throttle(() => {
      const { scrollTop } = document.documentElement

      if (scrollTop > 0) {
        toast.dismiss(FLOATING_TOAST_ID)
      } else if (scrollTop === 0) {
        showToast()
      }
    }, 100)

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      handleScroll.cancel()
      window.removeEventListener('scroll', handleScroll)
      toast.dismiss(FLOATING_TOAST_ID)
    }
  }, [message])

  useEffect(() => {
    if (isActive) {
      toast.dismiss(FLOATING_TOAST_ID)
    } else if (prevIsActiveRef.current) {
      showToast()
    }
    prevIsActiveRef.current = isActive
  }, [isActive, message])

  return null
}

```

```ts
import { useEffect, useState } from 'react'
import WebHelper from '@/src/common/utils/helper/WebHelper'

const useActiveVirtualKeyboard = () => {
  const [diffHeight, setDiffHeight] = useState(0)

  useEffect(() => {
    if (!WebHelper.isMobileDevice()) return () => {}

    const resizeHandler = () => {
      const visualViewportHeight = window.visualViewport?.height
      const { innerHeight } = window

      if (!visualViewportHeight) return

      if (innerHeight > visualViewportHeight) {
        const diff = innerHeight - visualViewportHeight
        setDiffHeight(diff)
      } else {
        setDiffHeight(0)
      }
    }

    visualViewport?.addEventListener('resize', resizeHandler)
    return () => {
      visualViewport?.removeEventListener('resize', resizeHandler)
    }
  }, [])

  return {
    isActive: diffHeight > 0,
    diffHeight,
  }
}

export default useActiveVirtualKeyboard

```

```ts
export default function HarmfulToast({ containsAdultContent }: HarmfulToastParams): JSX.Element | undefined {
  const { harmfulMediaLevel, hostAppChannel, isHasOutlink } = useWebContext()

  if (!containsAdultContent) return

  if (hostAppChannel === 'AA' || hostAppChannel === 'IA') {
    return
  }

  if (harmfulMediaLevel === HARMFUL_MEDIA_LEVEL.LOGOUT && isHasOutlink) {
    return <LogoutUser />
  }

  if (harmfulMediaLevel === HARMFUL_MEDIA_LEVEL.NOT_ADULT || harmfulMediaLevel === HARMFUL_MEDIA_LEVEL.ADULT_OFF) {
    return <MinorUser />
  }

  return
}
```


```ts
import { isValidElement } from 'react'
import { toast as baseToast, type Renderable, type ToastOptions } from 'react-hot-toast'

const showToast = (message: Renderable, options?: ToastOptions) => {
  // JSX가 아닌 경우(string, number 등)만 기본 스타일 적용
  const shouldApplyDefaultStyle = !isValidElement(message)

  return baseToast(message, {
    duration: 3000,
    ...options,
    style: shouldApplyDefaultStyle
      ? {
          padding: '11px 24px',
          backgroundColor: 'var(--color-mono-02)',
          color: 'var(--color-mono-04)',
          fontSize: '13px',
          lineHeight: '20px',
          ...options?.style,
        }
      : options?.style,
  })
}
//object.assign 기반 객체 복사
// 토스트창을 교체할 경우 여기만 바꾸면 됨
const toast = Object.assign(showToast, baseToast)

export default toast

```

토스트창 노출 시 id 부여안하면 내부에서 별도로 생성함

그럼 로컬환경 strict모드에선 useEFFECT 두번 실행돼서 2번 호출됨

때문에 id값을 주입해서 동일한 id가 있으면 호출안하도록 세팅

![가상키보드토스트창](/image/가상키보드토스트창.gif)
![플로팅토스트가상키보드](/image/플로팅토스트가상키보드.gif)

<!-- 폰에 저장한 영상 gif 따서 첨부 -->