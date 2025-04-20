---
date: "2024-02-18"
title: "[키워드 프로젝트] button 컴포넌트 비독립적 수행 이슈"
categories: ["Keyword"]
summary: "ToggleButtonGroup 컴포넌트를 각 컴포넌트에 넣고 독립적으로 동작하게 하려했는데"
thumbnail: "./reacticon.png"
---

```tsx
//FilterBox.tsx

import React from "react";
import KeywordType from "./KeywordType";
import Gender from "./Gender";
import RangeAge from "./RangeAge";
import SearchCount from "./SearchCount";
import ItemCount from "./ItemCount";
import CompetitionStrength from "./CompetitionStrength";

export default function FilterBox() {
  return (
    <>
      <div>FilterTable</div>
      <div>
        <KeywordType />
        <Gender />
        <RangeAge />
        <SearchCount />
        <ItemCount />
        <CompetitionStrength />
      </div>
    </>
  );
}
```

```tsx
//CompetitionStrength.tsx

import React, { useState } from "react";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";

export default function CompetitionStrength() {
  const [value, setValue] = useState([4, 6]);

  function strengthhandleChange() {
    setValue(val);
  }
  console.log(value);
  return (
    <>
      <div>경쟁강도</div>

      <ToggleButtonGroup
        type="checkbox"
        value={value}
        onChange={strengthhandleChange}
      >
        <ToggleButton id="tbg-btn-1" value={4}>
          0-10
        </ToggleButton>
        <ToggleButton id="tbg-btn-2" value={5}>
          숫자
        </ToggleButton>
        <ToggleButton id="tbg-btn-3" value={6}>
          숫자
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  );
}
```

```tsx
//ItemCount.tsx

import React, { useState } from "react";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";

export default function ItemCount() {
  const [value, setValue] = useState([1, 3]);

  const handleChange = (value) => setValue(value);
  console.log(value);
  return (
    <>
      <div>상품수</div>

      <ToggleButtonGroup type="checkbox" value={value} onChange={handleChange}>
        <ToggleButton id="tbg-btn-1" value={1}>
          0-500
        </ToggleButton>
        <ToggleButton id="tbg-btn-2" value={2}>
          숫자
        </ToggleButton>
        <ToggleButton id="tbg-btn-3" value={3}>
          숫자
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  );
}
```

```tsx
//SearchCount.tsx

import React, { useState } from "react";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";

export default function SearchCount() {
  const [searchValue, setSearchValue] = useState([1, 3]);

  function handleChange(val) {
    setSearchValue(val);
  }
  console.log(searchValue);

  return (
    <>
      <div>검색수</div>

      <ToggleButtonGroup
        type="checkbox"
        value={searchValue}
        onChange={handleChange}
      >
        <ToggleButton id="tbg-btn-1" value={1}>
          0-500
        </ToggleButton>
        <ToggleButton id="tbg-btn-2" value={2}>
          숫자
        </ToggleButton>
        <ToggleButton id="tbg-btn-3" value={3}>
          숫자
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  );
}
```

ToggleButtonGroup 컴포넌트를 각 컴포넌트에 넣고

독립적으로 동작하게 하려했는데

```tsx
 <SearchCount />
        <ItemCount />
        <CompetitionStrength />
```

`<ItemCount />` 나 `<CompetitionStrength />` 를 클릭해도 동작하지않고 `<SearchCount />` 만 동작하는 이슈가 생겼다. 즉 컴포넌트가 독립적으로 동작하지 않는 것이였다.

문제가 뭘까 고민하다 id값은 프로젝트 내에서 유일해야한다는 것을 깨달았다. 즉 id값이 같아서 이모양이꼴이난거다.

```tsx
<ToggleButtonGroup type="checkbox" value={searchValue} onChange={handleChange}>
  <ToggleButton id="tbg-btn-4" value={1}>
    0-500
  </ToggleButton>
  <ToggleButton id="tbg-btn-5" value={2}>
    숫자
  </ToggleButton>
  <ToggleButton id="tbg-btn-6" value={3}>
    숫자
  </ToggleButton>
</ToggleButtonGroup>
```

이렇게 각 컴포넌트 ToggleButton의 id값을 유일하게 바꿔주면 해결된다!!
