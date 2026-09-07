# 한글 email 계정에서 전 페이지가 500이 된 원인과 수정

## 증상

email에 한글이 들어간 계정으로 로그인하면 홈을 포함한 모든 페이지가 500으로 떨어졌다. 앱 재설치나 재부팅으로도 풀리지 않았는데, 서버가 아니라 그 계정의 세션 데이터 자체가 원인이라 클라이언트를 초기화해도 같은 값이 다시 흘러들어갔기 때문이다.

---

## 이 문서에 나오는 용어

### 코드포인트

유니코드가 문자 하나에 부여한 번호다. `A`는 65, `한`은 54620(U+D55C), `😀`는 128512(U+1F600)다. 아래 에러 메시지에 나오는 `value of 54620`이 `한`의 코드포인트다.

### 코드유닛과 서로게이트 페어

자바스크립트 문자열은 UTF-16으로 저장되고, 저장 단위가 코드유닛이다. 코드유닛 하나는 0~65535를 담는다. 코드포인트가 65535를 넘는 문자는 코드유닛 하나에 안 들어가서 두 개로 쪼개 저장하고, 이 쌍을 서로게이트 페어라고 부른다.

```
'한'.length  → 1   (코드유닛 1개: U+D55C)
'😀'.length → 2   (코드유닛 2개: U+D83D U+DE00)
```

`charCodeAt()`은 코드유닛을 반환하고 `codePointAt()`은 코드포인트를 반환한다. 이 차이 때문에 `😀`에 `charCodeAt(0)`을 쓰면 문자 전체가 아니라 앞쪽 서로게이트인 55357(U+D83D)만 나온다.

### ASCII와 non-ASCII

ASCII는 0~127 범위의 문자 집합으로, 영문 대소문자와 숫자, 기본 기호, 제어문자가 들어간다. non-ASCII는 그 밖의 문자를 가리키며 한글, 이모지, `é` 같은 악센트 문자가 여기 해당한다.

수정 코드의 정규식 `[ -~]`가 이 범위를 좁혀 쓴 것이다. 스페이스(32)부터 물결표(126)까지, 눈에 보이는 ASCII 문자만 담는다. 그래서 `[^ -~]`는 "출력 가능한 ASCII가 아닌 문자 전부"가 되고, 한글과 이모지뿐 아니라 DEL(127) 같은 제어문자도 함께 걸린다.

### Latin-1

ISO-8859-1이라고도 하며 0~255 범위를 쓰는 문자 집합이다. ASCII(0~127)에 서유럽 문자를 얹은 형태로, `é`(233)까지는 들어가지만 `한`(54620)은 못 들어간다.

### ByteString

웹 표준(WebIDL)이 정의한 문자열 종류로, 모든 문자의 값이 0~255여야 한다. 이름 그대로 문자 하나가 바이트 하나에 대응하는 문자열이다. HTTP 헤더 값이 이 타입이라 Latin-1 범위를 벗어나는 문자를 넣으면 브라우저와 Node 런타임이 TypeError를 던진다.

```
TypeError: Cannot convert argument to a ByteString because the character at index 10
has a value of 54620 which is greater than 255.
```

### 이스케이프

문자를 그대로 쓰지 못하는 자리에서, 허용된 문자들의 조합으로 바꿔 적는 표기법이다. 원래 문자를 버리는 게 아니라 표기만 바꾸므로 읽는 쪽에서 되돌릴 수 있다.

### JSON `\uXXXX` 이스케이프

JSON 규격이 정한 이스케이프 표기로, 코드유닛 하나를 `\u` + 16진수 4자리로 적는다. 이번 수정에서 쓴 방식이다.

```
한   → \ud55c      (코드유닛 1개)
😀  → \ud83d\ude00 (서로게이트 페어라 2개)
```

결과 문자열이 역슬래시, `u`, 16진수만으로 이뤄져 전부 ASCII다. 그러면서도 여전히 유효한 JSON이라 `JSON.parse`가 원래 문자를 그대로 복원한다.

### 퍼센트 인코딩

URL에서 쓰는 다른 이스케이프 방식이다. 문자를 UTF-8 바이트로 바꾼 뒤 각 바이트를 `%` + 16진수 2자리로 적는다.

```
한   → %ED%95%9C      (UTF-8 3바이트)
😀  → %F0%9F%98%80   (UTF-8 4바이트)
```

같은 브랜치에서 함께 고친 redirect URL 문제가 이 방식을 쓴다. Location 헤더에 들어가는 값은 URL이라 JSON 이스케이프가 아니라 퍼센트 인코딩이 맞다. 두 문제가 같은 ByteString 제약에 걸렸지만, 값이 JSON이냐 URL이냐에 따라 서로 다른 이스케이프를 쓴다.

---

## 원인

미들웨어가 매 요청마다 세션을 조회해서 다음 렌더 단계로 넘길 request 헤더에 JSON으로 실어 보낸다.

`src/middleware.ts:47-54`

```ts
headers: new Headers({
  ...Object.fromEntries(request.headers.entries()),
  'x-pathname': pathname,
  'x-searchparams': search,
  'x-channel': channel,
  [X_SESSION_HEADER]: stringifySessionHeader(session),  // 수정 전: JSON.stringify(session)
}),
```

`JSON.stringify`는 non-ASCII를 이스케이프하지 않고 원문 그대로 둔다. 그래서 email에 한글이 있으면 코드포인트 54620짜리 문자가 헤더 값에 그대로 남고, 헤더 값은 ByteString이라 255를 넘는 이 문자에서 `new Headers()` 생성 시점에 TypeError가 난다.

터지는 자리가 미들웨어라는 점이 증상을 키웠다. 미들웨어는 렌더링 이전 단계라 `src/app/error.tsx`와 `src/app/global-error.tsx`가 잡지 못하고 Next 내장 500 문서가 반환된다. 미들웨어 matcher가 제외하는 경로는 prefetch, server action, api, 정적 자산, `*.asp`뿐이라 나머지 모든 경로가 같은 방식으로 실패한다.

세션 검증용 zod 스키마(`sessionSchema`, `src/_common/types/session.ts:41`)는 읽는 쪽인 `getSession()`에만 걸려 있어서, 쓰는 시점의 크래시를 막지 못했다.

---

## 수정

헤더에 넣기 직전에 non-ASCII를 JSON `\uXXXX` 이스케이프로 바꾸는 함수를 추가하고, 미들웨어가 이 함수를 거치도록 바꿨다.

`src/_common/utils/session.ts:6-15`

```ts
const NON_ASCII_PATTERN = /[^ -~]/g

export function stringifySessionHeader(session: Session) {
  return JSON.stringify(session).replace(
    NON_ASCII_PATTERN,
    (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`,
  )
}
```

`[^ -~]`로 출력 가능한 ASCII 밖의 문자를 찾고, `charCodeAt(0)`으로 코드유닛 값을 얻어 16진수 4자리로 적는다. 결과가 전부 ASCII라 ByteString 제약을 통과한다. 제어문자는 `JSON.stringify`가 이미 `\n` 형태로 처리하고, DEL(127)은 `~`(126)보다 크므로 이 정규식에 걸려 함께 이스케이프된다.

### 정규식에 `u` 플래그를 안 붙인 이유

`charCodeAt`(코드유닛)을 쓴 것과 짝을 이룬다. `u` 플래그가 없으면 정규식이 서로게이트 페어를 코드유닛 두 개로 나눠 각각 매칭하고, 그 각각을 `\ud83d`, `\ude00`으로 적어 JSON 규격에 맞는 표기가 나온다.

같은 브랜치의 URL 인코딩 함수는 반대로 `u` 플래그가 필요하다. 퍼센트 인코딩은 문자 전체를 UTF-8로 변환해야 해서 코드포인트 단위 매칭을 걸어야 하기 때문이다. 두 함수의 정규식이 다른 이유가 이것이다.

### 읽는 쪽을 안 고친 이유

이스케이프는 표기만 바꾼 것이라 결과가 여전히 유효한 JSON이다. `getSession()`(`src/_common/apis/get-session.ts`)의 `JSON.parse`가 원문을 그대로 되돌리므로 읽는 쪽 계약이 유지된다.

```
header: {"email":"\ud83d\ude00\ud55c\uae00"}  →  ascii-only: true, roundtrip: 😀한글
```

---

## 테스트

`src/middleware/middleware.test.ts:225`에 회귀 테스트를 추가했다. 헤더에 Latin-1 밖 문자가 남지 않는 것과 파싱 후 원본 email이 복원되는 것을 함께 고정한다.

```ts
it('email에 한글이 있어도 x-session 헤더에 Latin-1 밖 문자가 남지 않는다', async () => {
  const user = { ...MOCK_USER, email: '고객센터문의바랍니다' }
  vi.mocked(getSessionMiddleware).mockResolvedValue({ isLogin: true, user })

  const response = await middleware(createRequest({ url: 'https://m.mrblue.com/' }))

  const sessionHeader = response.headers.get(`x-middleware-request-${X_SESSION_HEADER}`)
  expect(sessionHeader).toMatch(/^[ -~]*$/)
  expect(JSON.parse(String(sessionHeader)).user.email).toBe(user.email)
})
```

테스트 픽스처 값으로 보아 실제 데이터는 legacy 계정의 email 컬럼에 한글 안내문구가 들어가 있던 것으로 보인다.

---

## 확인한 범위

`x-session`을 쓰는 곳은 `src/middleware.ts:53` 한 곳뿐이라 누락된 경로가 없다.

이스케이프를 email 필드가 아니라 세션 JSON 전체에 적용해서, 나중에 `id`나 다른 필드에 한글이 들어와도 같이 막힌다.

같은 `new Headers()`에 함께 실리는 `x-pathname`과 `x-searchparams`는 손댈 필요가 없다. `request.nextUrl`이 WHATWG URL 파서를 거치면서 이미 퍼센트 인코딩된 값을 주기 때문이다. 확인 결과 `https://x/한글?a=한글`은 `pathname: /%ED%95%9C%EA%B8%80`, `search: ?a=%ED%95%9C%EA%B8%80`로 나온다.

email이 헤더나 쿠키로 나가는 다른 경로도 찾아봤으나 없었다. 나머지 사용처는 전부 화면 출력이나 폼 검증이다.
