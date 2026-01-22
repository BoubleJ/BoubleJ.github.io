---
date: "2024-10-01"
title: "[Node.JS] package.json 작은 따옴표 사용 이슈"
categories: ["Node.JS", "package.json", "JSON"]
summary: "npm run dev 명령어가 실행되지 않은 이유를 알아봅시다."
thumbnail: "/image/패키지제이슨.png"
---

인프런 강의를 수강하면서 환경세팅 후 `npm run dev` 명령어를 실행하니 다음과 같은 에러가 발생했습니다.

```shell
 npm run dev

> test-example-shopping-mall@0.0.0 dev
> concurrently --kill-others 'npm run dev:server' 'npm run dev:ui'

[0] ''npm'��(��) ���� �Ǵ� �ܺ� ����, ������ �� �ִ� ���α׷�, �Ǵ�
[0] ��ġ ������ �ƴմϴ�.
[1] 'run'��(��) ���� �Ǵ� �ܺ� ����, ������ �� �ִ� ���α׷�, �Ǵ�
[1] ��ġ ������ �ƴմϴ�.
[2] ���� �̸�, ���͸� �̸� �Ǵ� ���� ���̺� ������ �߸��Ǿ����ϴ�.
[3] ''npm'��(��) ���� �Ǵ� �ܺ� ����, ������ �� �ִ� ���α׷�, �Ǵ�
[3] ��ġ ������ �ƴմϴ�.
[4] 'run'��(��) ���� �Ǵ� �ܺ� ����, ������ �� �ִ� ���α׷�, �Ǵ�
[4] ��ġ ������ �ƴմϴ�.
[4] run exited with code 1
--> Sending SIGTERM to other processes..
[3] 'npm exited with code 1
--> Sending SIGTERM to other processes..
[2] dev:server' exited with code 1
--> Sending SIGTERM to other processes..
[1] run exited with code 1
--> Sending SIGTERM to other processes..
[0] 'npm exited with code 1
--> Sending SIGTERM to other processes..
[5] ���� �̸�, ���͸� �̸� �Ǵ� ���� ���̺� ������ �߸��Ǿ����ϴ�.
[5] dev:ui' exited with code 1

```

네... 이게 뭘까요... 인코딩이 깨져서 무슨 문제인지도 모르겠군요...

# 해결

열심히 서칭해본 결과

https://developer.mozilla.org/ko/docs/Learn/JavaScript/Objects/JSON

공식문서에

**JSON은 문자열과 프로퍼티의 이름 작성시 큰 따옴표만을 사용해야 합니다. 작은 따옴표는 사용불가합니다.**

라는 문구가 있더군요.

제 package.json 파일을 보니

```json
  "dev": "concurrently --kill-others npm run dev:server 'npm run dev:ui'",

```

야레야레 못말리는 json 씨... 작은 따옴표가 야물딱지게 위치해있네요.

**"dev": "concurrently --kill-others \"npm run dev:server\" \"npm run dev:ui\"",**

바로 큰따옴표로 바꿔주고 다시 실행하니 정상적으로 동작합니다!!

```shell

 npm run dev

ng on their current behavior and syntax as those might change in a future version of Node.js.
[0] (Use `node --trace-warnings ...` to show where the warning was created)
[0] (node:540) ExperimentalWarning: Importing JSON modules is an experimental feature and might change at any time
[1]
[1]   VITE v4.4.4  ready in 9440 ms
[1]
[1]   ➜  Local:   http://localhost:5173/
[1]   ➜  Network: use --host to expose
```

<br>
<br>
<br>

<details>

<summary>참고문헌</summary>

<div markdown="1">

인프런 강의 커뮤니티

</div>

</details>
