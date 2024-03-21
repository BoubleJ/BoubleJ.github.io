---
date: "2024-01-15"
title: "[HTML] required 속성"
categories: ["Html"]
summary: "required는 HTML 폼 요소에서 사용되는 속성(attribute) 중 하나로, 해당 입력 필드에 데이터가 반드시 입력되어야 함을 나타내는 속성입니다."
thumbnail: "./HTML.png"
---

**`required`**는 HTML 폼 요소에서 사용되는 속성(attribute) 중 하나로, 해당 입력 필드에 데이터가 반드시 입력되어야 함을 나타내는 속성입니다. 즉, 사용자가 폼을 제출할 때 해당 필드가 비어 있으면 제출이 실패하고 오류 메시지가 표시됩니다.

**`required`** 속성은 주로 사용자로부터 필수 정보를 수집하는 폼 요소에서 사용됩니다. 예를 들어, 사용자의 이름, 이메일 주소, 비밀번호 등을 요구하는 입력 필드에서 **`required`**를 사용하여 빈 값을 허용하지 않도록 할 수 있습니다.

예시

```html
htmlCopy code
<label for="username">사용자 이름:</label>
<input type="text" id="username" name="username" required />
```
