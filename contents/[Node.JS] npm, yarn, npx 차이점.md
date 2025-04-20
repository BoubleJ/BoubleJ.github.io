---
date: "2024-07-20"
title: "[Node.JS] npm, yarn, npx 차이점"
categories: ["Node.JS"]
summary: " npm, yarn, npx를 알아봅시다."
thumbnail: "./npmyarn.png"
---

우리는 CLI 를 통해 npm, yarn, npx 를 접합니다. 이 명령어들의 차이점을 알아봅시다. 

<br>

# npm 과 yarn

npm과 yarn은 자바스크립트 런타임 환경인 노드(Node.js)의 패키지 관리자입니다. 전 세계의 개발자들이 자바스크립트로 만든 다양한 패키지를 [npm 온라인 데이터베이스](https://www.npmjs.com/)에 올리면 npm, yarn과 같은 패키지 관리자를 통해 설치 및 삭제가 가능합니다. 

그리고 명령 줄 인터페이스(Command-line interface, CLI)를 통해 패키지 설치 및 삭제뿐 아니라 패키지 버전 관리, 의존성 관리도 편리하게 할 수 있습니다.

예
```shell
npm install redux
# redux 설치 CLI

npm uninstall redux
# redux 삭제 CLI
```

아마 다들 익숙 하실 겁니다. 

그렇다면 npm과 yarn의 차이점은 뭘까요?

## npm (Node Package Manager)
 
노드 패키지 매니저(Node Package Manager)의 줄임말로 노드를 설치할 때 자동으로 설치되는 기본 패키지 관리자입니다. Node 프로젝트의 필수 패키지 및 모듈은 npm을 사용하여 설치됩니다.
 
크게 두 가지 역할을 수행합니다.

1. [온라인 플랫폼](https://www.npmjs.com/)입니다. 

사람들이 노드 패키지를 만들고, 업로드하고, 공유할 수 있는 공간으로 누구나 [온라인 플랫폼(npm 레지스트리)](https://www.npmjs.com/)에 게시된 패키지를 사용할 수 있습니다. 패키지에는 모듈에 필요한 모든 파일이 포함되어 있습니다.

2. 명령 줄 인터페이스(CLI)입니다. 

온라인 플랫폼과 상호 작용하기 위해 명령 줄 인터페이스를 사용하며 패키지 설치 및 제거가 가능합니다.


<br>



Node.js를 다운로드하면 npm이 시스템에 자동으로 설치됩니다. 노드 설치 후 다음과 같은 명령을 통해 npm이 설치되었는지 확인할 수 있습니다.

```shell
node -v
# node 버전 확인

npm -v
#npm 버전 확인
```

<br>
<br>

## yarn

yarn은 2016년 페이스북에서 개발한 패키지 관리자입니다. 리액트(React)와 같은 프로젝트를 진행하며 겪었던 어려움을 해결하기 위해 개발되었고, npm 레지스트리와 호환하면서 속도나 안정성 측면에서 npm보다 향상되었습니다. [2016년 페이스북이 공개한 아티클](https://engineering.fb.com/2016/10/11/web/yarn-a-new-package-manager-for-javascript/)을 읽어보시면 좋을 것 같습니다.


### 설치

yarn은 npm을 통해 설치합니다.

```shell
npm install yarn --global
```


맥 사용자라면 brew를 통해 설치할 수도 있습니다.


```shell
brew update
brew install yarn

```

<br>

## 차이점


### 명령어

|<center>명령어</center>|<center>npm</center>|<center>yarn</center>|
|--|--|--|
|<center>dependencies 설치</center>|<center>npm install</center>|<center>yarn</center>|
|<center>패키지 설치</center>|<center>npm install [패키지명]</center>|<center>yarn add [패키지명]</center>|
|<center>dev 패키지 설치</center>|<center>npm install --save-dev [패키지명]</center>|<center>yarn add --dev [패키지명]</center>|
|<center>글로벌 패키지 설치</center>|<center>npm install --global [패키지명]</center>|<center>yarn global add [패키지명]</center>|
|<center>패키지 제거</center>|<center>npm uninstall [패키지명]</center>|<center>yarn remove [패키지명]</center>|
|<center>dev 패키지 제거</center>|<center>npm uninstall --save-dev [패키지명]</center>|<center>yarn remove [패키지명]</center>|
|<center>글로벌 패키지 제거</center>|<center>npm uninstall --global [패키지명]</center>|<center>yarn global remove [패키지명]</center>|
|<center>업데이트</center>|<center>npm update</center>|<center>yarn upgrade</center>|
|<center>패키지 업데이트</center>|<center>npm update [패키지명]</center>|<center>yarn upgrade [패키지명]</center>|




<br>

### 스펙

||npm|yarn|
|--|--|-----|
|패키지 처리 프로세스 <br> 방법|<center>한 번에 하나씩 순차적으로 설치</center>|<center>여러 패키지를 동시에 가져오고 설치</center>|
|속도|<center>yarn보다 느림</center>|<center>npm보다 빠름</center>|
|보안|자동으로 패키지에 포함된 다른 패키지 코드를 실행 -> 보안 시스템 취약성 발생 가능성 존재|yarn.lock 또는 package.json파일에 있는 파일만을 설치 ->  npm 보다 보안 우수 | 

<br>



하지만 최근 npm 보안 시스템도 크게 향상되었습니다. 

현재 npm과 yarn 모두 지속적 관리 +  폭넓은 사용자 커뮤니티 + 업데이트를 통해 추가된 기능 덕분에 거의 차이가 나지 않습니다. 

그냥 개인 취향대로 선택해 사용하시면 될 것 같습니다. 

<br>
<br>



# npx (Node Package eXecute)

```shell
npx create-react-app 프로젝트명
```

리액트를 처음 접하시는 분들이 사용하는 CLI입니다. 저도 처음엔 아 리액트 생성하는 명령어구나 하고 넘어갔는데 생각해보니 왜 npx를 사용하는지 궁금하더군요.


npx는 npm 5.2.0 버전 이상부터 npm을 설치하면 자동으로 설치되는 도구입니다.

즉, yarn과 같은 새로운 패키지 관리 모듈이 아닌, npm의 5.2.0버전부터 새로 추가된 npm을 좀 더 편하게 사용하기 위해 npm 제공해주는 하나의 도구라 할 수 있습니다.

**패키지를 설치하지 않고도** npm 레지스트리에서 원하는 패키지를 실행(Excute) 할 수 있습니다.

**실행**이기 때문에 일회용 패키지로 사용됩니다.

<br>

## 왜 만든거야? 

npm을 통해 모듈을 로컬에 설치했어야만 실행시킬 수 있었던 기존 문제점을 해결하기 위해 만들었습니다. 

리액트 프로젝트 생성 도구인 `create-react-app`을 npm으로 관리한다 가정해봅시다.

`create-react-app` 같은 모듈은 변경사항이 꽤나 잦은 모듈입니다. 

그렇기 때문에 매 설치 전마다 npm으로 재 설치를 하지 않는 경우에는 이전 버전을 사용할 여지가 존재합니다. 

이런 프로젝트 생성 모듈은 매 업데이트마다 새로운 기능과 다양한 버그들이 고쳐집니다. 버그들이 고쳐졌다는 것은 최신 버전 업데이트가 되었단 뜻이고 npm으로 재 설치해줘야 최신버전을 사용할 수 있다는 뜻입니다. 

그러기 위해선 매번 개발자가 별도로 최선버전 업데이트를 해야햐는데 너무 번거롭죠.

<br>

### 이러한 문제점 해결을 위해 npx를 사용합니다. 

npx는 모듈을 로컬에 저장하지 않고, 매번 최신 버전의 파일만을 임시로 불러와 실행 시킨 후에, 다시 그 파일은 없어지는 방식입니다. 

즉 npx를 통해 create-react-app을 설치할 경우에는 매번 최신 버전만을 가져와서 설치해 주기 때문에 지금 어떤 버전을 사용하고 있는 지 신경쓸 필요가 없어집니다. 어짜피 최신 버전만을 사용할 테니까요.


<br>

## 결론

- npm : 패키지 관리자, 전역적
- npx : 패키지 실행자, 일회성





<br>
<br>
<br>

<details>

<summary>참고문헌</summary>

<div markdown="1">

https://ljh86029926.gitbook.io/coding-apple-react/undefined/npm-npx

https://youngmin.hashnode.dev/npm-npx

</div>

</details>
