---
date: "2023-11-20"
title: "[Next.js] React-hot-toast 기반 토스트창 만들기"
categories: ["CSS"]
summary: "React-hot-toast 기반 토스트창 만들기."
thumbnail: "/thumbnail/React-hot-toast.png"
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