---
date: "2023-09-02"
title: "[Gatsby 블로그 제작일지] MUI 컴포넌트를 이용한 드롭박스 구현 및 라우팅 적용"
categories: ["Gatsby, React, Routing, MUI"]
summary: " MUI 컴포넌트를 활용해서 HEADER 드롭박스를 구현해봅시다."
thumbnail: "./test.png"
---

MUI 컴포넌트를 활용해서 HEADER 드롭박스를 구현해봅시다.

[MUI 설치방법 공식문서](https://mui.com/material-ui/getting-started/installation/)

위 공식문서를 참고하시면 좀 더 정확하고 다양한 정보를 접하실 수 있습니다.

본격적으로 MUI를 설치하고 드롭박스 컴포넌트를 구현해봅시다.

<br>
<br>

### 1. 설치하라는거 설치해줍니다.

```shell
npm install @mui/material @emotion/react @emotion/styled
```

```shell
npm install @mui/material @mui/styled-engine-sc styled-components
```

MUI는 styled-components 와 emotion 기반이라고 합니다. 잘됐네요.

Please note that react and react-dom are peer dependencies, meaning you should ensure they are installed before installing Material UI.

> React와 react-dom은 peer dependencies이므로 Material UI를 설치하기 전에 설치해야 합니다.

MUI는 react와 react-dom 패키지에 의존성이 있다고 합니다.

```json
"react": "^18.2.0",
"react-bootstrap": "^2.8.0",
"react-dom": "^18.2.0",
```

package.json 파일에서 의존성을 부여해줍니다.

<br><br>
<br>

### 2. 이제 컴포넌트를 가져옵시다.

[MUI 드롭다운](https://mui.com/material-ui/react-menu/)

위 링크에서 맘에 드는거 가져와줍니다.

![](https://velog.velcdn.com/images/dogmnil2007/post/75687fd8-12d8-4c1d-a17e-a7c8ee78fcd8/image.png)

전 이거 가져오겠습니다.

main 폴더에 Dropdown.tsx파일을 만들고 코드를 복붙해줍니다.

```js
import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

export default function MenuPopupState() {
  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <Button variant="contained" {...bindTrigger(popupState)}>
            Dashboard
          </Button>
          <Menu {...bindMenu(popupState)}>
            <MenuItem onClick={popupState.close}>Profile</MenuItem>
            <MenuItem onClick={popupState.close}>My account</MenuItem>
            <MenuItem onClick={popupState.close}>Logout</MenuItem>
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
}
```

![](https://velog.velcdn.com/images/dogmnil2007/post/a8f23e96-9239-45a4-be1d-d63b9f49e34e/image.png)

음 패키지 설치가 안되었다네요?

설치해줍시다.

```shell
npm install material-ui-popup-state
```

![](https://velog.velcdn.com/images/dogmnil2007/post/06d802f0-9da6-470c-b67f-418fdb35216c/image.png)

에러가 안납니다! 좋아요!

<br><br>

### 3. header 컴포넌트로 옮겨줍시다.

그냥 import 해주면 됩니다 쉽죠?

Header.tsx

```js
import Dropdown from "components/Main/Dropdown";

export default function Header() {
  return (
    <>
      <LinkItemWrap>
        <Dropdown />
        {linkArray.map((item, idx) => {
          return (
            <LinkItem key={idx} to={item.path}>
              {item.title}
            </LinkItem>
          );
        })}
      </LinkItemWrap>
    </>
  );
}
```

![](https://velog.velcdn.com/images/dogmnil2007/post/c6c8318f-895c-42d7-9664-4f94a63db72c/image.png)

말 같지도 않은 디자인이지만 아무튼 적용됐으니 그걸로 됐습니다.

<br><br>

### 4. 이제 라우팅 기능을 구현해봅시다.

제가 원하는건 project 드롭박스 내부에 'gatsby 블로그 제작' 이라는 content가 있고 클릭하면 gatsby 폴더 내부 index 파일로 이동하는 것입니다.

```js
import { Link } from "gatsby";

export default function MenuPopupState() {
  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <Button variant="contained" {...bindTrigger(popupState)}>
            Project
          </Button>
          <Menu {...bindMenu(popupState)}>
            <MenuItem onClick={popupState.close}>
              <Link to="/project/gatsby">Gatsby 블로그</Link>
            </MenuItem>
            <MenuItem onClick={popupState.close}>My account</MenuItem>
            <MenuItem onClick={popupState.close}>Logout</MenuItem>
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
}
```

Link 컴포넌트로 감싸주고 경로를 지정해주면 됩니다.

![](https://velog.velcdn.com/images/dogmnil2007/post/b242a736-4f84-4799-8933-a33ebca747db/image.png)

![](https://velog.velcdn.com/images/dogmnil2007/post/e5a738d5-c5c8-4712-8de8-421f35699b57/image.png)

클릭하니 잘 이동합니다.

기능구현은 완료했으니 디자인 제작 후 전체적인 라우팅 구조만 설계하면 되겠군요.
