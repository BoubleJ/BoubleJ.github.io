---
date: "2026-03-01"
title: "타입가드 함수를 활용한 HTTP 상태 코드 기반 에러 핸들링 시스템 구현 (작성중)"
categories: ["React", "Typescript"]
summary: "쿼리 팩토리 패턴 구현."
thumbnail: "/thumbnail/타입스크립트.jpg"
---

```ts
function getReviewToastMessage(status: number, action: ReviewInteractionType) {
  const messages = REVIEW_TOAST_MESSAGE[action]
  const key = status as keyof typeof messages  // ⚠️ 런타임 검증 없이 강제 단언

  return messages[key] ?? REVIEW_TOAST_MESSAGE.wait
}

// 사용
const message = getReviewToastMessage(status, 'unBlock')
toast(message)
```
문제점: status가 실제로 해당 객체의 키가 아닌 경우에도 TypeScript가 오류를 잡지 못합니다. messages[key]가 undefined를 반환해도 컴파일 단계에서는 알 수 없습니다.



```ts
function getReviewToastMessage(status: number, action: ReviewInteractionType) {
  if (action === 'like') {
    switch (status) {
      case 200: return REVIEW_TOAST_MESSAGE.like[200]
      case 4030107: return REVIEW_TOAST_MESSAGE.like[4030107]
      case 4090001: return REVIEW_TOAST_MESSAGE.like[4090001]
      case 4030108: return REVIEW_TOAST_MESSAGE.like[4030108]
      default: return REVIEW_TOAST_MESSAGE.wait
    }
  }

  if (action === 'report') {
    switch (status) {
      case 200: return REVIEW_TOAST_MESSAGE.report[200]
      case 409: return REVIEW_TOAST_MESSAGE.report[409]
      default: return REVIEW_TOAST_MESSAGE.wait
    }
  }

  // action이 늘어날수록 분기가 계속 추가됨...
}
```
**문제점:** action 종류만큼 분기가 늘어나 OCP를 위반합니다. `REVIEW_TOAST_MESSAGE`에 새로운 action이 추가될 때마다 이 함수도 함께 수정해야 합니다.


```ts

const ENDED_EVENT_ERROR_CODES = [4030102, 4030106, 4040104]

  const res = await postAttendanceApi(id)
    const hasErrorCode = res.errorCode
    const isEndedEvent = !!hasErrorCode && ENDED_EVENT_ERROR_CODES.includes(hasErrorCode)
```


```ts
     const handleConfirm = async () => {
    const { status, isSuccess } = await deleteReviewsBlockApi({
      reviewId,
      reviewType: 'EVENT',
    })
    actionToast(getReviewToastMessage(status, 'unBlock'))
    if (isSuccess) queryClient.invalidateQueries({ queryKey: eventReviewQueries.all() })
    close()
  }
```


```ts

export const REVIEW_TOAST_MESSAGE = {
  write: {
    200: '등록되었습니다.',
    429: '도배글 등을 방지하기 위해 1분간 사용이 제한됩니다.\n잠시 후 다시 시도해주세요.',
  },
  report: {
    200: '신고가 접수 되었습니다.',
    409: '이미 신고한 리뷰입니다.',
  },
  like: {
    200: '추천되었습니다.',
    4030107: '내가 작성한 리뷰는 추천할 수 없습니다.',
    4090001: '이미 추천한 리뷰입니다.',
    4030108: '차단한 회원의 리뷰는 추천할 수 없습니다.',
  },
  delete: {
    204: '삭제 되었습니다.',
  },
  block: {
    200: '차단 되었습니다.',
  },
  unBlock: {
    204: '차단이 해제 되었습니다.',
  },
  eventReport: {
    200: '신고가 완료되었습니다.',
    401: '이미 신고한 댓글입니다.',
  },
  eventLike: {
    200: '추천되었습니다.',
    4030107: '내가 등록한 댓글은 추천할 수 없습니다.',
    4090001: '이미 추천하신 댓글입니다.',
    4030108: '차단한 회원의 댓글은 추천할 수 없습니다.',
  },
  eventDelete: {
    204: '댓글이 삭제 되었습니다.',
  },
  eventLikePC: {
    200: '추천되었습니다.',
    4030107: '내가 작성한 댓글은 추천할 수 없습니다.',
    4090001: '이미 추천하신 댓글입니다.',
    4030108: '차단한 회원의 댓글은 추천할 수 없습니다.',
  },
  wait: '잠시 후 다시 시도해주세요.',
} as const

```


```ts
import { REVIEW_TOAST_MESSAGE } from '@/src/common/components/review/constants'
import type { ReviewInteractionType } from '@/src/common/components/review/types'

/**
 * {@link REVIEW_TOAST_MESSAGE}의 리뷰 이벤트핸들러 속성에 status가 유효한 키인지 확인하는 타입 가드 함수
 * @param status - 응답 status 코드
 * @param action - {@link REVIEW_TOAST_MESSAGE}의 리뷰 이벤트핸들러 (like, block, report 등)
 * @returns status가 해당 리뷰 이벤트핸들러의 유효한 코드인지 확인
 */
export function isValidReviewInteractionStatus<T extends ReviewInteractionType>(
  status: number,
  action: T,
): status is Extract<keyof (typeof REVIEW_TOAST_MESSAGE)[T], number> {
  return status in REVIEW_TOAST_MESSAGE[action]
}

/**
 * {@link isValidToastStatus} 타입 가드 함수를 통과하면 {@link REVIEW_TOAST_MESSAGE}에 해당되는 메시지를 출력
 *
 * 통과하지 못하면 {@link REVIEW_TOAST_MESSAGE}.wait 메시지를 출력
 */
export function getReviewToastMessage<T extends ReviewInteractionType>(
  status: number,
  action: T,
): (typeof REVIEW_TOAST_MESSAGE)[T][keyof (typeof REVIEW_TOAST_MESSAGE)[T]] | string {
  if (isValidReviewInteractionStatus(status, action)) {
    return REVIEW_TOAST_MESSAGE[action][status]
  }
  return REVIEW_TOAST_MESSAGE.wait
}

```

```ts
export type ReviewInteractionType = Exclude<keyof typeof REVIEW_TOAST_MESSAGE, 'wait'>
```

<details>

<summary>참고문헌</summary>

<div markdown="1">

https://velog.io/@juhyeon1114/AWS-S3%EC%99%80-Cloudfront%EB%A1%9C-%EC%9B%B9%EC%82%AC%EC%9D%B4%ED%8A%B8-%EB%B0%B0%ED%8F%AC

</div>

</details>
