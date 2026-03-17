---
date: "2026-03-01"
title: "타입스크립트 제대로 사용하기 (feat. 타입가드 함수)"
categories: ["React", "Typescript"]
summary: "타입가드 함수를 활용해 HTTP 상태 코드 기반 에러 핸들링 시스템 구현을 구현해보았습니다."
thumbnail: "/thumbnail/타입스크립트.jpg"
---

서비스를 만들다 보면 자연스럽게 API 요청이 늘어나고, 그에 따른 에러 핸들링 로직도 함께 쌓이게 됩니다.

사용자에게 좋은 서비스 경험을 제공하기 위해서는 에러 상황을 어떻게 처리하느냐가 굉장히 중요합니다.

동일한 에러라도, 아무 메시지도 없이 조용히 실패하는 서비스와, 상황을 이해하기 쉬운 메시지와 함께 적절한 안내를 제공하는 서비스의 완성도는 크게 다를 수밖에 없습니다.

이번 글에서는 타입스크립트의 타입 시스템과 타입가드 함수를 적극적으로 활용해 HTTP 상태 코드 기반의 에러를 더 안전하고 확장 가능하게 처리한 경험을 공유드리려고 합니다.


# 안티패턴 예시

특정 api 요청에 실패했을 때 케이스별 토스트 메시지를 띄우는 요구사항이 들어왔다 가정해봅시다. 

요구사항 대응을 위해 가장 기본적으로 떠올릴 수 있는 방법은 switch문입니다.

```ts
  const { status } = await postUserApi()

  switch (status) {
    case 400:
      toast.error('잘못된 요청입니다. 입력 값을 확인해주세요.')
      break
    case 401:
      toast.error('로그인이 필요합니다.')
      break
    case 403:
      toast.error('해당 요청에 대한 권한이 없습니다.')
      break
    case 404:
      toast.error('요청하신 정보를 찾을 수 없습니다.')
      break
    default:
      toast.error('알 수 없는 오류가 발생했습니다.')
  }

```

혹은 early return문도 있겠지요. 

```tsx

  const { status } = await postUserApi()
  if (status === 400) {
    toast.error('잘못된 요청입니다. 입력 값을 확인해주세요.')
    return
  }

  if (status === 401) {
    toast.error('로그인이 필요합니다.')
    return
  }

  if (status === 403) {
    toast.error('해당 요청에 대한 권한이 없습니다.')
    return
  }

  if (status === 404) {
    toast.error('요청하신 정보를 찾을 수 없습니다.')
    return
  }

  toast.error('알 수 없는 오류가 발생했습니다.')


```

딱히 문제는 없어보입니다만... 자세히보면 아쉬운 부분들이 보입니다.

## 문제점


### 1. 확장성 부족 (OCP 위반)
새로운 상태 코드가 추가될 때마다 if 블록이나 switch 문을 계속 늘려야 합니다.

상태 코드별로 토스트만 띄우는 것이 아니라 다른 로직까지 섞이기 시작하면, 비즈니스 로직의 복잡도는 더욱 커질 수밖에 없습니다.

예를 들어, 각 `status`에 따라 토스트 대신 다이얼로그를 띄우는 요구사항으로 변경되었다고 가정해보겠습니다.

이 경우, 모든 `toast.error` 호출을 일일이 다이얼로그 호출로 교체해야 합니다.

모두 동일한 역할을 하는 `toast.error` 호출임에도 불구하고 수정해야 할 위치가 여러 곳에 흩어져 있는 셈이고, 공통화에 실패한 구조입니다.


### 2. 타입 안전성 부재

타입스크립트를 사용하는 중요한 이유 중 하나는 컴파일 단계에서 자바스크립트의 휴먼 에러를 최대한 줄이기 위함입니다.
하지만 위와 같은 코드는 타입 추론을 거의 활용하지 않기 때문에, 컴파일 단계에서 오타를 잡아주지 못합니다.

예를 들어 `status`가 number 타입이라면, 아래와 같은 오타(4001, 40 등)를 컴파일 타임에 검증할 수 없습니다.

```ts
if (status === 4001) {
  // 컴파일단계에서 타입 에러를 잡지 못합니다.
    toast.error('해당 요청에 대한 권한이 없습니다.')
    return
  }

```

# 개선 방법

그렇다면 위 코드를 어떻게 개선할 수 있을까요??

## 객체로 중앙화하자!

일단 1번 문제부터 해결해봅시다. 

반복되는 switch문, if문이 보기 싫으니 객체형태로 관리해봅시다. 

```ts

const toastMessage: Record<number, string> = {
  400: '잘못된 요청입니다. 입력 값을 확인해주세요.',
  401: '로그인이 필요합니다.',
  403: '해당 요청에 대한 권한이 없습니다.',
  404: '요청하신 정보를 찾을 수 없습니다.',
}
const DEFAULT_TOAST_MESSAGE = '알 수 없는 오류가 발생했습니다.'

```

```tsx

  const { status } = await postUserApi()

const message = toastMessage[status] ?? DEFAULT_TOAST_MESSAGE
toast.error(message)

```

이렇게하면 1번문제는 해결된 듯 합니다. 토스트 함수 호출 로직을 한줄로 단축했군요.

## 타입 문제는?

그렇다면 2번 문제를 볼까요??


사실 위 코드는 런타임 구조상 문제가 없습니다. `toastMessage` 객체 key값 상태 코드가 내려오지 않으면 `toastMessage[status]`는 undefined가 되고 자연스럽게 
```ts
toast.error('알 수 없는 오류가 발생했습니다.')
```
토스트창이 뜰테니까요. 

하지만 이는 타입스크립트를 쓰는 이점을 제대로 살리지 못한 코드라 볼 수 있습니다. 저희가 원하는건 컴파일 단계에서 `status`에 `toastMessage` 객체 key값 외 값이 내려오면 `DEFAULT_TOAST_MESSAGE` 메시지가 노출되도록 하고싶으니까요.

그런 관점에서 현재 코드는 `toastMessage` 객체가 `Record<number, string>`  타입이기 때문에 컴파일단계에서 `status`가 아무 number나 들어와도 컴파일단계에서 에러가 나지 않습니다.

그렇다면 타입을 좀더 좁혀서 추론하도록 `toastMessage`에 `as const`를 선언해 key값을 리터럴로 추론하도록 해보겠습니다.


```ts

const toastMessage = {
  400: '잘못된 요청입니다. 입력 값을 확인해주세요.',
  401: '로그인이 필요합니다.',
  403: '해당 요청에 대한 권한이 없습니다.',
  404: '요청하신 정보를 찾을 수 없습니다.',
} as const 
const DEFAULT_TOAST_MESSAGE = '알 수 없는 오류가 발생했습니다.'

```

```tsx
  const { status } = await postUserApi()

const message = toastMessage[status] ?? DEFAULT_TOAST_MESSAGE
toast.error(message)

```
이러면 `status`값이 `401,402,403,404` 리터럴 타입이어야 컴파일단계에서 에러가 나지 않습니다. 저희가 원하는 바죠.

하지만 위 코드는 컴파일 에러가 납니다. 왜냐면 api 응답 상태코드는 기본적으로 number 타입이기 때문이죠. 어떤 상태코드를 넘길지 컴파일 단계에선 알 수 없기 때문에 리터럴 타입으로 추론되지 않습니다. 

```tsx
// status는 number타입
  const { status } = await postUserApi()

//toastMessage 객체 접근 시 리터럴 타입만 허용 -> number타입인 status가 내려오기때문에 타입에러!!
const message = toastMessage[status] ?? DEFAULT_TOAST_MESSAGE
toast.error(message)

```

## 타입단언하면 되지

이 문제를 어떻게 해결할 수 있을까요?? 

일단 as 단언을 사용하면 해결**은**됩니다. 

```ts
const message = toastMessage[status as keyof typeof toastMessage] ?? DEFAULT_TOAST_MESSAGE
toast.error(message)
```

타입스크립트에게 `status`는 `toastMessage key` 리터럴 타입이니까 에러내지말라고 협박하는거죠. 

말 잘 듣는 타입스크립트는 저희의 협박에 못 이겨 컴파일 에러를 내지않습니다.



## 해결...됐나?

이럼 컴파일 단계에서도 에러를 뿜어내지 않습니다. 문제 해결입니다.

**과연 그럴까요?**

타입 단언은 런타임 안전성을 보장하지 않습니다. 사실 `any` 타입을 쓴거나 다름이 없죠. 컴파일 에러가 해결된게 아니라 무시하는 것 뿐입니다. 

그렇다면 진짜 컴파일 단계에서 타입 에러를 잡는 방법은 뭐가 있을까요?

## in 연산자를 활용한 타입가드 함수

여러가지 방법이 있겠지만 전 **in 연산자**를 활용한 타입가드 함수를 적용해보겠습니다.

> in 연산자란 <br> 타입스크립트의 in 연산자는 객체 내에 특정 프로퍼티가 존재하는지 확인하여 boolean을 반환하며, 주로 유니온 타입(Union Type)에서 타입을 좁히는 타입 가드(Type Guard)로 활용됩니다.


```ts
const getToastMessage = (status: number): string => {
  if (status in toastMessage) {
    return toastMessage[status as keyof typeof toastMessage]
  }
  return DEFAULT_TOAST_MESSAGE
}
```
in 연산자 방식이 타입 단언 없이도 TypeScript가 타입을 자동으로 좁혀주기 때문에 컴파일 단계에서 타입추론이 가능합니다. 

위 타입가드 함수를 활용하면 아래와 같이 ?? 연산자를 사용하지 않아도 컴파일, 런타임 모두 안전성을 보장받을 수 있죠. 

```tsx
  const { status } = await postUserApi()

const message = toastMessage[status]
toast.error(message)

```


# 실무에선

조금 더 복잡한 요구사항에 대응해봅시다.

댓글 등록, 신고, 추천, 차단에 대한 성공, 실패(status 상태코드에 따라) 를 상황에 맞게 토스트창에 노출시켜야하는 요구사항이 들어왔습니다. 

이런 다양한 유저케이스는 switch문 난사할 수 없으니 상술했던 것처럼 하나의 객체로 관리해봅시다.


```ts
export const COMMENT_TOAST_MESSAGE = {
  write: {
    200: '댓글이 등록되었습니다.',
    401: '로그인 후 댓글을 작성할 수 있습니다.',
    403: '댓글 작성 권한이 없습니다.',
    404: '게시글을 찾을 수 없습니다.',
    429: '도배글 등을 방지하기 위해 1분간 사용이 제한됩니다.\n잠시 후 다시 시도해주세요.',
  },
  report: {
    200: '신고가 접수되었습니다.',
    401: '로그인 후 신고할 수 있습니다.',
    404: '이미 삭제된 댓글입니다.',
    409: '이미 신고한 댓글입니다.',
  },
  like: {
    200: '추천되었습니다.',
    401: '로그인 후 추천할 수 있습니다.',
    403: '내가 작성한 리뷰는 추천할 수 없습니다.',
    404: '차단한 리뷰는 추천할 수 없습니다.',
    409: '이미 추천한 댓글입니다.',
  },
  delete: {
    204: '댓글이 삭제되었습니다.',
    401: '로그인이 필요합니다.',
    403: '본인 댓글만 삭제할 수 있습니다.',
    404: '이미 삭제된 댓글입니다.',
  },
  block: {
    200: '차단되었습니다.',
    401: '로그인이 필요합니다.',
    404: '존재하지 않는 사용자입니다.',
    409: '이미 차단한 사용자입니다.',
  },
  unBlock: {
    204: '차단이 해제되었습니다.',
    401: '로그인이 필요합니다.',
    404: '차단 내역을 찾을 수 없습니다.',
  },
  wait: '잠시 후 다시 시도해주세요.',
} as const
```

wait는 위 상태코드를 제외한 나머지 케이스에 노출되도록 하겠습니다.

## 제네릭 기반 타입가드 함수

이제 각 상황에 맞에 적절한 토스트창을 띄우기 위한 타입가드 함수를 만들어보겠습니다

```ts
type InteractionType = Exclude<keyof typeof COMMENT_TOAST_MESSAGE, 'wait'>

export function isValidCommentInteractionStatus<T extends InteractionType>(
  status: number,
  action: T,
): status is Extract<keyof (typeof COMMENT_TOAST_MESSAGE)[T], number> {
  return status in COMMENT_TOAST_MESSAGE[action]
}
```

### 제네릭 추론

일단 Exclude 문법을 활용해 `COMMENT_TOAST_MESSAGE` 객체 `key`값 중 `wait`를 제외한 나머지 key값들을 리터럴 타입으로 가지는 `InteractionType` 타입을 만들어줍니다.

이 타입의 역할은 개발자가 토스트 호출 함수 인자로 `wait` 혹은 정의되지 않은 문자열을 넘길 때 컴파일 단계에서 에러를 띄우기 위함입니다.

그리고 `T extends InteractionType` 제네릭으로 제약을 걸면, action으로 `write`를 넘겼을 때 TypeScript는 T를 `write`로 정확히 추론합니다.

만약 제네릭 없이 `action: InteractionType`으로만 선언했다면, 반환 타입의 `(typeof COMMENT_TOAST_MESSAGE)[T]`에서 `T`가 유니온 전체가 되어 특정 액션의 키를 좁혀낼 수 없게 됩니다.


### 반환 타입 추론

다음 반환 타입은 다음과 같이 추론됩니다. 

`(typeof COMMENT_TOAST_MESSAGE)[T]` 코드는 

예를 들어 T가 'write'이면 `{ 200: ..., 401: ..., 429: ... }` 형태가 되고
`keyof (typeof COMMENT_TOAST_MESSAGE)[T]` 타입은  `200 | 401 | 429` (`COMMENT_TOAST_MESSAGE` 를 as const로 추론했기 때문에 가능) 으로 추출됩니다. 

그리고 객체 키는 기본적으로 `string | number | symbol`이므로 `Extract<..., number>` 으로 타입을 좁혀 키 중 number 타입만 추출하도록 합니다. 

### 코드를 수정해도 알아서 동기화

이렇게 추론된 반환 타입 `status is Extract<keyof (typeof COMMENT_TOAST_MESSAGE)[T], number>`가 true를 반환하면 이후 블록에서 status가 해당 타입으로 자동 좁혀집니다.

설령 새 액션, status 상태 코드가 추가되어도 COMMENT_TOAST_MESSAGE에 추가하면 됩니다. 타입추론은 타입가드 함수에서 자동으로 갱신되기 때문이죠.

## 타입가드 기반 유틸함수

이제 이 타입가드 함수를 사용해 실제 토스트 메시지를 반환하는 유틸 함수를 만들어주면 됩니다.

```ts
export function getCommentToastMessage<T extends InteractionType>(
  status: number,
  action: T,
): (typeof COMMENT_TOAST_MESSAGE)[T][keyof (typeof COMMENT_TOAST_MESSAGE)[T]] | string {
  if (isValidCommentInteractionStatus(status, action)) {
    return COMMENT_TOAST_MESSAGE[action][status]
  }
  return COMMENT_TOAST_MESSAGE.wait
}

```

`isValidCommentInteractionStatus`가 true를 반환한 if 블록 내부에서는, TypeScript가 status를 해당 액션의 유효한 키 타입으로 자동으로 좁혀줍니다. 

이 덕분에 `COMMENT_TOAST_MESSAGE[action][status]` 접근이 타입 단언(as) 없이도 가능합니다.



그리고 status값이 타입가드를 통과하지 못하면 `COMMENT_TOAST_MESSAGE.wait` 메시지를 노출시키도록 합니다. 

```ts
const { status } = await writeCommentApi()
const message = getCommentToastMessage(status, 'write')
toast(message)

//...
const { status } = await deleteCommentApi()
const message = getCommentToastMessage(status, 'delete')
toast(message)

//...
const { status } = await blockCommentApi()
const message = getCommentToastMessage(status, 'block')
toast(message)

```


# 마무리

타입 가드 함수를 활용해 완성도 높은 타입스크립트 로직을 만들어보았습니다. 정확한 타입 추론이 때로는 번거롭게 느껴질 수 있지만, 타입을 최대한 좁혀 사용하는 것이야말로 TypeScript를 진정으로 활용하는 방법이자 안정적인 서비스를 만드는 가장 확실한 방법이라고 생각합니다.

조금은 귀찮아도 정확한 타입추론으로 타입스크립트를 100% 활용해보는건 어떨까요
