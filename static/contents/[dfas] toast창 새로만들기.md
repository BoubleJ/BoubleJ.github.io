---
date: "2023-11-20"
title: "[CSS] CSS 방법론"
categories: ["CSS"]
summary: " CSS에서 클래스 네임을 지을 때 작성하는 방식으로 일종의 naming convention입니다."
thumbnail: "/image/css-logo.png"
---

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