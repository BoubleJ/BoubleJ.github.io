---
date: "2023-12-28"
title: "[마켓플레이스 프로젝트] setState props 전달 시 type error"
categories:
  ["MarketPlace"]
summary: "setState를 props로 전달할 경우 타입은 void로 하면 되는 것 같다. "
thumbnail: "./모달창안뜸.png"
---


```jsx
//ModalContent.tsx

import React from 'react'

interface Props {
  onClose: () => void
}

export default function ModalContent({ onClose } : Props) {
//{ onClose } 에서 에러났었음
//Binding element 'onClose' implicitly has an 'any' type.
//타입지정을 안해서 자동으로 any 타입을 지정했다는 뜻. 
  return (
    <div>
      <div>a modal dialog</div>
      <button onClick={onClose}>Close</button>
    </div>
  )
}
```

```jsx
//FAQFilterBox.tsx

'use client'

import React, { useState } from 'react'
import { createPortal } from 'react-dom'

import ModalContent from './ModalContent'

export default function FAQFilterBox() {
  const [showModal, setShowModal] = useState<boolean>(false)
  return (
    <div>
      <button onClick={() => setShowModal(true)

      }>Show modal using a portal</button>

      {showModal && createPortal(<ModalContent onClose={() => setShowModal(false)} />, document.body)}
    </div>
  )
}
```

setState를 props로 전달할 경우 타입은 void로 하면 되는 것 같다. 

타입문제는 해결했는데…

![alt text](image-6.png)

뭔가 되긴 되는데…

저걸 클릭하면 모달창이 떠야하는데 안뜬다ㅠㅠ