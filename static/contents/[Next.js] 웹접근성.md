---
date: "2025-12-02"
title: "[   ] 앙아"
categories: ["Web"]
summary: "웹  것다."
thumbnail: "./웹사진.png"
---

//웹접근성탭
# 배경

```ts

export const LIST_TAB_CLASS = 'flex w-[calc(100%-32px)] max-w-[1168px] mx-auto mb-4'
export const BTN_TAB_CLASS =
  'mr-2 last:mr-0 max-[320px]:px-3 max-[320px]:overflow-hidden max-[320px]:text-ellipsis max-[320px]:whitespace-nowrap'

interface FreeCouponTabSwiperProps {
  data: FreeCouponTabDataType
  className: string
  contentType?: ContentWithoutAll
  genreId?: string
}

export default function FreeCouponTabSwiper({ data, className, contentType }: FreeCouponTabSwiperProps) {
  const id = 'FreeCouponTabmenu'
  const [selectedTab, setSelectedTab] = useState<FreeCouponTabTitle>('기다리면 무료')

  const link = data[selectedTab]?.link
  const title = `무료쿠폰으로 볼 수 있는 ${contentType ? CONTENT_LABEL[contentType] : '작품'}`

  const tabList = Object.keys(data) as FreeCouponTabTitle[]
  const panel = data[selectedTab]?.panelElement
  const selectedTabIndex = tabList.indexOf(selectedTab)
  const panelId = `${id}Panel`
  const selectedTabId = selectedTabIndex >= 0 ? `${id}Tab${selectedTabIndex}` : undefined

  return (
    <HeadingBox
      id={id}
      title={title}
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
              tags={['무료쿠폰으로볼수있는작품', item]}
            >
              <Button
                variant={selected ? 'solid-round' : 'outline-round'}
                size="xsmall"
                color={selected ? 'sub-green-01' : 'bright-01'}
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
      <div id={panelId} role="tabpanel" aria-labelledby={selectedTabId} className="min-height-192">
        {panel}
      </div>
    </HeadingBox>
  )
}

```
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


