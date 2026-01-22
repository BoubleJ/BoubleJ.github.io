---
date: "2024-02-20"
title: "[HTML] form 태그"
categories: ["HTML"]
summary: "form태그 속성으로는 name, action, method, target이 있다."
thumbnail: "/image/HTML.png"
---

form태그 속성으로는 name, action, method, target이 있다.

action : 폼을 전송할 서버 쪽 스크립트 파일을 지정한다(여기 웹사이트 주소를 쓴다 생각하면 편함)

name : 폼을 식별하기 위한 이름을 지정

target : action에서 지정한 스크립트 파일을 현재 창이 아닌 다른 위치에 열도록 지정한다.

method : 폼을 서버에 전송할 http 메소드를 정한다(GET  또는 POST)

GET 과 POST 차이

둘다 똑같은 기능을 수행하지만 방법이 다름

간단하게 설명하자면 보안이 필요하지않으면서 지정된 리소스에서 자원을 읽을 경우 GET,

그렇지 않다면 POST를 사용하면 된다. 즉 GET은 보안에 취약하다.

onsubmit 이라는 속성도 있다

submit 버튼을 클릭했을 때 폼 태그에서 발생하는 이벤트

https://www.nextree.co.kr/p8428/

폼에 관한 자세한 설명 수록

onsubmit과 action의 차이

action은 form데이터를 처리할 프로그램의 URI를 지정

onsubmit은 양식 제출 이벤트가 발생할 때의 동작을 지정

https://penguingoon.tistory.com/188

자세한 설명

onchange

값이 바뀌고 마우스포인터가 바깥으로 빠져나가면 호출된다.
