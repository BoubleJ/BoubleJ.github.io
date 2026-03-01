---
date: "2025-12-02"
title: "[Next.js] 다이얼로그 제작 일지"
categories: ["Next.js"]
summary: "사내 프로젝트의 불편했던 다이얼로그를 교체하며 겪은 과정과 한계를 기록합니다."
thumbnail: ""
---

# 배경

사내 프로젝트에서 기존에 쓰이던 다이얼로그가 꽤 불편해서, 새로 만들고 교체하는 작업을 진행했습니다. 그 과정에서 만든 두 가지 방식과 각각의 문제점을 정리해 둡니다.

<br>
<br>
<br>


// 다이얼로그안닫힘.gif
//다이얼로그 웹접근성
//다이얼로그 노출 예시.gif

# 첫 번째 다이얼로그 — Recoil 전역 상태

기존에는 Recoil로 모달 열림 상태를 전역 관리하는 방식이었습니다.

```ts
const useModal = (modalId: ModalState) => {
  const [modal, setModal] = useRecoilState(modalState)
  const isOpen = modal[modalId]

  const onOpen = () => {
    setModal((current) => ({ ...current, [modalId]: true }))
    document.body.style.overflow = 'hidden'
  }

  const onClose = useCallback(() => {
    setModal((current) => ({ ...current, [modalId]: false }))
    document.body.style.overflow = ''
  }, [modalId, setModal])

  return { isOpen, onOpen, onClose }
}


export const modalState = atom<{
  [key in ModalState]: boolean
}>({
  key: 'modalState',
  default: {
    SIDEBAR: false,
    RECOM_GENRE: false,
    MAIN_POPUP_BANNER: false,
    PASSWORD: false,
    RANKING_FILTER: false,
    GIFT_COUPON_INFO: false,
    REVIEW_INFO: false,
    NOVEL_GENRE: false,
  },
})
```

이 방식에는 두 가지가 부담이었습니다.

**1. 모달을 쓰는 페이지마다 Recoil key를 추가해야 함**

새 화면에서 다이얼로그를 띄우려면 `ModalState` 타입과 `modalState` default 객체에 항목을 하나씩 추가해야 했습니다. 사용처가 늘어날수록 열거형·atom이 계속 커지는 번거로움이 있었습니다.

**2. 페이지 이동 시 다이얼로그가 닫히지 않음**

상태가 Recoil 전역이라, 다이얼로그가 떠 있는 상태에서 뒤로 가기 등으로 라우트만 바뀌어도 모달이 그대로 남았습니다. 화면은 바뀌었는데 오버레이와 다이얼로그만 남는 UX가 되어 버렸습니다.

이런 이유로 전역 상태 기반 첫 번째 다이얼로그를 쓰지 않고, 컴포넌트/훅 단위로 열고 닫는 두 번째 방식을 만들게 됐습니다.

<br>
<br>
<br>

# 두 번째 다이얼로그 — useDialog 훅

페이지와 무관하게 “해당 컴포넌트에서만” 열고 닫는 다이얼로그를 위해 `useDialog` 훅과 `Dialog` 컴포넌트를 만들었습니다.

```ts
export default function useDialog() {
  const { isOpen, handleOpen, handleClose } = useBodyScrollLock()
  const DialogComponent = useMemo(
    () =>
      ({ title, children, onDimClick, buttons, className }: DialogProps) => (
        <Dialog
          isOpen={isOpen}
          title={title}
          onDimClick={() => {
            onDimClick?.()
            handleClose()
          }}
          buttons={buttons}
          className={className}
        >
          {children}
        </Dialog>
      ),
    [isOpen, handleClose],
  )
  return {
    isOpen,
    onClose: handleClose,
    onOpen: handleOpen,
    Dialog: DialogComponent,
  }
}
```

```ts
export default function Dialog({ children, isOpen, onDimClick, title, buttons, className }: DialogProps) {
  const modalStyle = {
    '--z-modal': zDialog,
  } as React.CSSProperties

  if (!isOpen) return null

  return (
    <Portal>
      <Dim active={isOpen} zIndex={zDialogDim} handler={onDimClick} />
      <div className={cn('wrap-modal')} style={modalStyle}>
        {title && (
          <Typography.Title1 ta="center" className={cn('title')}>
            {title}
          </Typography.Title1>
        )}
        <div className={cn('content', className)}>{children}</div>
        {buttons && buttons.length > 0 && (
          <Flex direction="row">
            {buttons?.map((button) => (
              <Typography.Body1
                as="button"
                className={cn('button')}
                onClick={button.onClick}
                c={button.color || 'mono-01'}
                fw={400}
                key={button.text}
              >
                {button.text}
              </Typography.Body1>
            ))}
          </Flex>
        )}
      </div>
    </Portal>
  )
}
```

```ts

export default function useBodyScrollLock() {
  const [isOpen, setOpen] = useState(false)

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  const handleOpen = useCallback(() => {
    setOpen(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow q= ''
    }
  }, [isOpen])

  return {
    isOpen,
    handleClose,
    handleOpen,
  }
}

```


사용 예시는 다음과 같습니다.

```tsx
const { onOpen: handleOpenAlert, onClose: handleCloseAlert, Dialog: AlertDialog } = useDialog()

<AlertDialog
  onDimClick={handleCloseAlert}
  buttons={[{ text: '확인', color: 'blue-01', onClick: handleCloseAlert }]}
>
  출석체크 알림은 앱에서만 받을 수 있습니다.
</AlertDialog>
```

다이얼로그를 쓰는 쪽에서 `Dialog`로 내부 컨텐츠를 감싸고, 버튼 정보와 콜백을 props로 넘기는 형태입니다.

<br>
<br>
<br>

# 두 번째 다이얼로그의 한계 — 버튼 콜백과 내부 상태의 분리

이 훅의 문제는 **버튼 콜백과 다이얼로그 내부 컨텐츠의 상태가 공유되지 않는다**는 점이었습니다.

`Dialog`는 `useDialog`가 반환하는 컴포넌트이고, 버튼의 `onClick`·`buttons`는 사용처에서 넘깁니다. 반면 입력값·에러 메시지 같은 “내부 상태”는 보통 다이얼로그 컨텐츠를 담당하는 자식 컴포넌트의 `useState`에 있습니다. 그 자식은 `Dialog`의 `children`으로만 들어가기 때문에, 버튼 쪽에서 그 상태를 직접 참조하거나 갱신하려면 props로 계속 넘겨야 합니다. 구조가 복잡해질수록 “버튼이 있는 곳”과 “상태가 있는 곳”이 달라져서 사용 패턴이 어색해졌습니다.

실제로 리뷰 작성 다이얼로그에서는 아래처럼 쓰이게 됐습니다.

```tsx
const { onOpen: onReviewWriteOpen, onClose: onReviewWriteClose, Dialog: ReviewWriteDialog } = useDialog()
<DetailReviewWriteBox Dialog={ReviewWriteDialog} onClose={onReviewWriteClose} pid={pid} />
```

`DetailReviewWriteBox` 안에서 다시 `useDialog`를 쓰고, “등록” 버튼 콜백에서 API 결과에 따라 실패 메시지를 띄우는 식으로 이중으로 감쌌습니다.

```tsx
export default function DetailReviewWriteBox({ Dialog, onClose, pid }: DetailReviewWriteBoxProps) {
  const { onOpen: onFailOpen, onClose: onFailClose, Dialog: FailDialog } = useDialog()
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(5)
  const [failMessage, setFailMessage] = useState<string | ReactNode>()
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  useEffect(() => {
    return () => {
      setComment('')
      setRating(5)
    }
  }, [Dialog])

  return (
    <>
      <Dialog
        className={cn('dialog-content')}
        buttons={[
          {
            text: '취소',
            onClick: () => {
              onClose()
            },
          },
          {
            text: '등록',
            color: 'blue-01',
            onClick: async () => {
             // 콜백 실행
              onClose()
            },
          },
        ]}
      >
        <Flex direction="column" gap={10}>
          <Stars
            onClick={(point) => {
              setRating(point)
            }}
            point={rating}
            size={32}
          />
          <Typography.Body2 ta="center" c="mono-03">
            {GRADE_TEXT[rating - 1]}
          </Typography.Body2>
        </Flex>

        <textarea
          name="content"
          value={comment}
          onChange={(e) => {
            if (e.target.value.length > 300) {
              e.target.value = e.target.value.slice(0, 300)
            }
            setComment(e.target.value)
          }}
          className={cn('textarea')}
          placeholder="감상평 또는 작가님에게 보내는 응원 메시지를 남겨주세요. (선택)"
        ></textarea>
        <Flex direction="row" gap={8} justify="flex-end">
          <Typography.Body5>{comment.length}</Typography.Body5>
          <Typography.Body5 c="grey-06">/ 300</Typography.Body5>
        </Flex>
      </Dialog>
```

여기서는 `comment`, `rating`, `failMessage`가 모두 `DetailReviewWriteBox` 안에 있어서 버튼 콜백과 같은 스코프를 쓰기 위해 **Dialog 컴포넌트를 props로 받고**, 그 안에서 한 번 더 `useDialog`로 실패용 다이얼로그를 띄우는 식으로 가게 됐습니다. “다이얼로그 하나로 열고 닫기”만 담당하려던 훅의 의도와는 다르게, “컨테이너 컴포넌트에 Dialog를 넘겨서 그 안에서 상태와 버튼을 같이 다룬다”는 패턴이 되어 버렸습니다.

즉, **버튼과 내부 컨텐츠 상태를 한곳에서 다루기 쉽게** 만들어 주지 못한 것이 두 번째 다이얼로그의 한계였습니다.

<br>
<br>
<br>

# 세 번째 다이얼로그 — useOverlay + shadcn

위 한계를 해결하기 위해 **토스(toss) 라이브러리의 useOverlay 훅**과 **shadcn에서 제공하는 다이얼로그 컴포넌트**를 조합해 다시 설계했습니다.

<br>
<br>
<br>

설게 목적
1. 버튼과 내부 컨텐츠값이 공유 가능
2. 훅 하나만 가져와서 사용가능하도록 편리함
3. 

## 설계 방향

**1. Promise 기반 open/close**

useOverlay 내부 메서드는 모두 Promise를 반환하도록 설계했습니다. 특정 콜백(예: 확인 버튼 클릭)이 실행된 **이후에** 다이얼로그가 열리고 닫히는 순서가 보장되도록 하기 위함입니다.

**2. useOverlay 래핑**

사내 프로젝트에서 다이얼로그 노출에 쓰는 라이브러리를 나중에 바꿀 가능성을 고려해, useOverlay를 한 번 감싼 **별도 useDialog 훅**을 두었습니다. 이렇게 하면 사용처는 useDialog만 쓰고, 내부 구현만 교체할 수 있습니다.

<br>
<br>
<br>

## 다이얼로그를 열고 닫는 훅

```ts
export const useDialog = () => {
  const overlay = useOverlay()

  const open = (createOverlayElement: CreateOverlayElement) => {
    return new Promise<void>((resolve, reject) => {
      overlay.open(({ isOpen, close, exit }) => {
        const handleClose = () => {
          close()
          resolve()
        }

        const handleExit = () => {
          exit()
          reject(new Error('User cancelled'))
        }

        return createOverlayElement({
          isOpen,
          close: handleClose,
          exit: handleExit,
        })
      })
    })
  }

  return {
    open,
    close: overlay.close,
    exit: overlay.exit,
  }
}
```

<br>
<br>
<br>

## shadcn 기반 다이얼로그 컴포넌트

```tsx
'use client'

import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import type { PropsWithChildren } from 'react'
import {
  Dialog as DialogComponent,
  DialogContent,
  DialogDescription as DialogDescriptionComponent,
  DialogHeader,
  DialogTitle as DialogTitleComponent,
} from '@/src/common/components/_shadcn/dialog'
import type { ColorTokenType } from '@/src/common/types/styleType'
import { cn } from '@/src/common/utils/twMerge'

interface DialogProps {
  open: boolean
  onClose: () => void
  className?: string
}

function Dialog({ open, onClose, className, children }: PropsWithChildren<DialogProps>) {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }
  return (
    <DialogComponent open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          'w-[calc(100vw-20px)] max-w-[320px] pt-8 bg-elevated-02 max-h-[calc(100vh-116px)] mb-[58px] flex flex-col',
          className,
        )}
        onClick={onClose}
      >
        {children}
      </DialogContent>
    </DialogComponent>
  )
}
interface DialogTitleProps {
  title?: string
  className?: string
}

function DialogTitle({ title, className }: DialogTitleProps) {
  if (!title) {
    return (
      <VisuallyHidden>
        <DialogTitleComponent className={cn('text-[21px] leading-[25px] font-bold text-mono-01', className)}>
          Dialog
        </DialogTitleComponent>
      </VisuallyHidden>
    )
  }

  return (
    <DialogHeader>
      <DialogTitleComponent className={cn('text-[21px] leading-[25px] font-bold text-mono-01 pb-7.5', className)}>
        {title}
      </DialogTitleComponent>
    </DialogHeader>
  )
}
interface DialogDescriptionProps {
  className?: string
}

function DialogDescription({ children, className }: PropsWithChildren<DialogDescriptionProps>) {
  return (
    <DialogDescriptionComponent asChild className={cn('px-7.5 mb-8 overflow-y-auto scrollbar-hide', className)}>
      <div>{children}</div>
    </DialogDescriptionComponent>
  )
}

interface DialogButtonFooterProps {
  className?: string
}

function DialogButtonFooter({ children, className }: PropsWithChildren<DialogButtonFooterProps>) {
  return (
    <div className={cn('flex flex-row border-t border-bright-01 [&>button:first-child]:border-l-0', className)}>
      {children}
    </div>
  )
}
interface DialogButtonProps {
  text: string
  color?: `text-${ColorTokenType}`
  onClick: () => void
  className?: string
}
function DialogButton({ text, color, onClick, className }: DialogButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex-1 h-[56px] px-4 text-center text-[16px] border-l border-bright-01  leading-[20px] break-keep whitespace-pre-line',
        color || 'text-mono-01',
        className,
      )}
    >
      {text}
    </button>
  )
}

export { Dialog, DialogTitle, DialogButtonFooter, DialogButton, DialogDescription }

```

<br>
<br>
<br>

## 예시 다이얼로그 컴포넌트

```tsx
export default function ConfirmDialog({ open, close, message }: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle />
      <DialogDescription>
        <p className="text-center whitespace-pre-line text-base leading-[24px] text-mono-01">{message}</p>
      </DialogDescription>
      <DialogButtonFooter>
        <DialogButton text="확인" onClick={close} />
      </DialogButtonFooter>
    </Dialog>
  )
}
```

<br>
<br>
<br>

## 사용처

```tsx
const dialog = useDialog()

const openAdultAuthErrorDialog = () => {
  dialog.open(({ isOpen, close }) => (
    <ConfirmDialog open={isOpen} close={close} message={ERROR_MESSAGES.COUPON_ADULT_AUTH_FAIL} />
  ))
}
```

다이얼로그를 두 개 이상 띄워야 하는 경우에는 **useDialog 훅을 필요한 만큼 호출**하면 됩니다. 각 인스턴스가 독립적으로 열고 닫기를 담당하므로, Recoil처럼 key를 늘리거나 하나의 훅으로 여러 모달을 관리할 필요가 없어 사용성이 좋아졌습니다
혹은 다이얼로그 내부에서 **useDialog 훅을** 호출하는 방법도 가능합니다.

```ts
export default function DetailReviewWriteButton({ pid }: DetailReviewWriteButtonProps) {
  const reviewWriteDialog = useDialog()

  const handleReviewWriteOpen = () => {
    reviewWriteDialog.open(({ isOpen, close }) => <DetailReviewWriteBox open={isOpen} close={close} pid={pid} />)
  }
  const { login } = useAuthRouter()
  const { isLogin } = useSession()

  return (
    <Flex
      direction="row"
      justify="center"
      className={cn('wrap-button')}
      style={{ '--z-detail-review-write-button': zDetailReviewWriteButton }}
    >
      <Button
        variant="solid"
        size="large"
        color="blue-01"
        onClick={() => {
          if (!isLogin) {
            login()
            return
          }
          //TODO: 자사무협 기등록된 리뷰 존재하는 경우 안내팝업 로직 추가 필요 (https://jira.mrblue.com/browse/CBQA-393)
          handleReviewWriteOpen()
        }}
        width="100%"
      >
        리뷰 작성하기
      </Button>
    </Flex>
  )
}

```

```ts

export default function DetailReviewWriteBox({ open, close, pid }: DetailReviewWriteBoxProps) {
  const failDialog = useDialog()
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(5)
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  const { mutate } = usePostReviewsMutation()
  const openFailDialog = (message: string) => {
    failDialog.open(({ isOpen, close: closeFailDialog }) => (
      <ConfirmDialog open={isOpen} close={closeFailDialog} message={message} />
    ))
  }

  const handleSubmit = () => {
    mutate(
      {
        reviewType: 'CONTENT',
        subdir: pid,
        comment,
        rating,
      },
      {
        onSuccess: () => {
          showToast({ message: REVIEW_TOAST_MESSAGE.write[200], type: 'basic' })
          queryClient.invalidateQueries({ queryKey: [DETAIL_REVIEW_LIST_KEY] })
          close()
        },
        onError: (error) => {
          if (!(error instanceof CustomError)) return

          const isRateLimited = error.code === ERROR_CODE.연속_리뷰_작성_제한 || error.status === 429

          if (isRateLimited) {
            openFailDialog(REVIEW_TOAST_MESSAGE.write[ERROR_CODE.연속_리뷰_작성_제한])
            return
          }

          openFailDialog(REVIEW_TOAST_MESSAGE.wait)
        },
      },
    )
  }

  useEffect(() => {
    return () => {
      setComment('')
      setRating(5)
    }
  }, [])

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle />
      <DialogDescription className={cn('dialog-content')}>
        <Flex direction="column" gap={10}>
          <Stars
            onClick={(point) => {
              setRating(point)
            }}
            point={rating}
            size={32}
          />
          <Typography.Body2 ta="center" c="mono-03">
            {GRADE_TEXT[rating - 1]}
          </Typography.Body2>
        </Flex>

        <textarea
          name="content"
          value={comment}
          onChange={(e) => {
            if (e.target.value.length > 300) {
              e.target.value = e.target.value.slice(0, 300)
            }
            setComment(e.target.value)
          }}
          className={cn('textarea')}
          placeholder="감상평 또는 작가님에게 보내는 응원 메시지를 남겨주세요. (선택)"
        ></textarea>
        <Flex direction="row" gap={4} justify="flex-end">
          <Typography.Body5>{comment.length}</Typography.Body5>
          <Typography.Body5 c="grey-06">/ 300</Typography.Body5>
        </Flex>
      </DialogDescription>
      <DialogButtonFooter>
        <DialogButton text="취소" onClick={close} />
        <DialogButton text="등록" color="text-blue-01" onClick={handleSubmit} />
      </DialogButtonFooter>
    </Dialog>
  )
}

```

<br>
<br>
<br>

## 개선 효과

- **웹 접근성**: shadcn 다이얼로그의 접근성(포커스 트랩, 역할·라벨 등)을 그대로 활용할 수 있습니다. 다이얼로그 노출 시 body에 `overflow: hidden`이 적용되어 스크롤이 배경으로 나가지 않아 UX도 개선됩니다.
- **페이지 이동 시 자동으로 닫힘**: 전역 상태가 아니므로 라우트가 바뀌면 오버레이가 unmount 되면서 다이얼로그도 함께 사라집니다. 뒤로 가기 시 다이얼로그가 남는 문제가 사라졌습니다.
- **버튼과 내부 상태를 한 스코프에서 사용**: 다이얼로그 UI(제목, 설명, 버튼)와 그 안의 상태(입력값, API 결과 등)를 **같은 컴포넌트**에서 다룹니다. ConfirmDialog처럼 `open`, `close`만 받는 단순 다이얼로그는 물론, 리뷰 작성처럼 내부에 `comment`, `rating` 상태가 있어도 해당 컴포넌트 안에서 버튼 onClick과 상태를 함께 다룰 수 있습니다.
- **Recoil key 추가 불필요**: 새 화면·새 플로우에서 다이얼로그를 쓸 때 전역 atom에 key를 추가할 필요가 없습니다.
- **관심사 분리**: useDialog는 "다이얼로그를 띄울지 말지, 언제 닫을지"만 담당하고, **다이얼로그 내부 상태는 알 필요가 없습니다**. 열기/닫기 로직과 다이얼로그 컨텐츠 상태가 분리되어 구조가 명확해졌습니다.

- 토스 라이브러리 동작원리 추가하면 좋음

<br>
<br>
<br>

# 정리

- **첫 번째(Recoil)**: 전역 상태라 관리 포인트가 늘고, 페이지 이동 시 다이얼로그가 닫히지 않는 문제가 있었습니다.
- **두 번째(useDialog)**: 컴포넌트 단위로 열고 닫을 수 있어서 전역 상태 문제는 줄었지만, 버튼 콜백과 다이얼로그 내부 상태가 분리되어 있어서, 상태와 버튼을 같이 써야 하는 경우 컴포넌트 구조가 복잡해지고 의도와 다르게 사용하게 됐습니다.

- **세 번째(useOverlay + shadcn)**: useOverlay를 Promise 기반 useDialog로 한 번 감싼 뒤, shadcn Dialog로 UI를 구성했습니다. 다이얼로그당 useDialog 인스턴스를 두어 열기/닫기만 담당하게 하고, 내부 상태는 각 다이얼로그 컴포넌트에서만 다루도록 해 접근성·UX·상태 공유·관심사 분리 측면에서 만족스러운 형태로 정리했습니다.

<br>
<br>
<br>

<details>

<summary>참고문헌</summary>

<div markdown="1">

(사내 프로젝트 경험 정리)

</div>

</details>
