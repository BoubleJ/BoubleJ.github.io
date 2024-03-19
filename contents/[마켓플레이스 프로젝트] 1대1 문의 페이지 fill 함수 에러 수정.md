---
date: "2023-01-17"
title: "[마켓플레이스 프로젝트] 1:1 문의 페이지 fill 함수 에러 수정"
categories:
  ["MarketPlace"]
summary: "이럼 안되지만 챗지피티 돌려서 만든 코드라… fill() 함수가 왜 저렇게 배치되었는지 도통 알수가 없었다. 파라미터도 없는채 말이지.."
thumbnail: "./fill함수.png"
---


기존코드

이럼 안되지만 챗지피티 돌려서 만든 코드라… fill() 함수가 왜 저렇게 배치되었는지 도통 알수가 없었다. 파라미터도 없는채 말이지..

```jsx
export default function InquiryPagnationNumber({
  total,
  limit,
  page,
  setPage,
}: {
  total: number
  limit: number
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
}) {
  const numPages = Math.ceil(total / limit)

  return (
    <div className="pt-6">
      <nav className="flex justify-center items-center gap-4 m-16">
        <button className="" onClick={() => setPage(page - 1)} disabled={page === 1}>
          <ChevronLeft className=" fill-transparent" width={'1.5rem'} height={'1.5rem'} />
        </button>
        **{Array(numPages)
          .fill()
//여기가 문제문제문제 리팩토링 시급**
          .map((item, i) => (
            <button
              className=""
              key={i + 1}
              onClick={() => setPage(i + 1)}
              aria-current={page === i + 1 ? 'page' : undefined}
            >
              {i + 1}
            </button>
          ))}
        <button className="" onClick={() => setPage(page + 1)} disabled={page === numPages}>
          <ChevronRight className=" fill-transparent" width={'1.5rem'} height={'1.5rem'} />
        </button>
      </nav>
    </div>
  )
}
```

이번에도 챗 지피티한테 물어보니

**`Array(numPages).fill()`** 메서드를 사용하여 페이지 번호 버튼을 생성하고 있는데, 이 방법은 빈 배열을 만들고 그 배열을 **`fill()`** 메서드로 채우는 방식입니다. 그러나 이러한 방식은 불필요한 메모리를 사용할 수 있습니다.

대신에 **`Array.from()`** 메서드를 사용하여 더 효율적으로 페이지 번호를 생성할 수 있습니다. 이 방법은 먼저 길이가 **`numPages`**인 배열을 만든 다음, 각 요소를 해당 페이지 번호로 매핑합니다.

다음은 **`fill()`** 메서드를 **`Array.from()`**으로 대체한 리팩토링된 코드입니다:

```jsx
export default function InquiryPaginationNumber({
  total,
  limit,
  page,
  setPage,
}: {
  total: number
  limit: number
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
}) {
  const numPages = Math.ceil(total / limit);

  return (
    <div className="pt-6">
      <nav className="flex justify-center items-center gap-4 m-16">
        <button className="" onClick={() => setPage(page - 1)} disabled={page === 1}>
          <ChevronLeft className=" fill-transparent" width={'1.5rem'} height={'1.5rem'} />
        </button>
        {Array.from({ length: numPages }, (_, i) => (
          <button
            className=""
            key={i + 1}
            onClick={() => setPage(i + 1)}
            aria-current={page === i + 1 ? 'page' : undefined}
          >
            {i + 1}
          </button>
        ))}
        <button className="" onClick={() => setPage(page + 1)} disabled={page === numPages}>
          <ChevronRight className=" fill-transparent" width={'1.5rem'} height={'1.5rem'} />
        </button>
      </nav>
    </div>
  );
}
```

이렇게 해결해줬다 끝!!