---
date: "2025-05-01"
title: "[Docker] Windows 포트 잠김으로 인한 도커 컨테이너 못 올리는 이슈"
categories: ["Docker"]
summary: "도커 컨테이너를 올리려는데 사용할 수 없는 포트라는 에러가 떴습니다."
thumbnail: "./도커아이콘.png"
---

# 문제 발생

코테피티 개발환경 세팅을 위해 도커 컨테이너를 올려봤습니다.

```json
  "infra:up": "docker-compose --env-file ./apps/api/.env --env-file ./apps/api/.env.local up -d",
```

`package.json`파일에 다음과 같이 스크립트 명령어를 설정해놓았습니다. 코테피티는 모노레포기 때문에 pnpm 패키지 관리자를 사용합니다.

위 명령어는  

--env-file ./apps/api/.env  (기본설정)

--env-file ./apps/api/.env.local:   (로컬환경설정)

두 개의 환경 변수 파일을 로드합니다.

<br>

아래 명령어를 실행하니 다음과 같은 에러가 발생했습니다. 

```bash
 pnpm run infra:up
```

<br>

```bash
[+] Running 1/2
 - Container cotept-local-redis   Starting                                                                    
 ✔ Container cotept-local-oracle  Started                                                                     
Error response from daemon: Ports are not available: exposing port TCP 0.0.0.0:6379 -> 127.0.0.1:0: listen tcp 0.0.0.0:6379: bind: An attempt was made to access a socket in a way forbidden by its access permissions.
 ELIFECYCLE  Command failed with exit code 1
```

음...6379 포트를 사용할 수 없다는군요. 전 6379 포트를 사용한 적이 없는데..

실제로 아래 명령어를 통해 시스템에 의해 점유된 포트 번호들을 조회해도 제가 사용할 포트번호는 보이지 않았습니다.

```bash
netsh interface ipv4 show excludedportrange protocol=tcp

```

<br>

왜 또 심술일까요. 역시 저만 안되는 환경세팅입니다. 

# 해결

구글링해보니 WinNAT 서비스를 재시작 하라 합니다. cmd창을 키고 다음 명령어를 실행해줍니다.

```shell
net stop winnat #  WinNAT 서비스 중지
```

<br>

그리고 다시 도커 컨테이너를 올려줍니다.
```bash
# 도커 다시 올리기
pnpm run infra:up
```

<br>

시키는대로 하니까 

```bash
[+] Running 2/2
 ✔ Container cotept-local-oracle  Running                                                                     
 ✔ Container cotept-local-redis   Started                                                                     

```

오라클, 레디스 서버 모두 정상적으로 컨테이너가 올라갔습니다!!!



![도커컨테이너](도커컨테이너.png)

도커 데스크톱에서도 정상적으로 올라온 것을 확인할 수 있습니다.

<br>
<br>

# 원인 분석

그럼 WinNAT 서비스가 뭐길래 중지시켜야 포트를 사용할 수 있었던걸까요??


## WinNAT이란

Windows의 네트워크 주소 변환 서비스입니다. 이 서비스는 네트워크 포트 매핑을 관리하는데, 때때로 이 매핑 정보가 제대로 해제되지 않아 포트가 계속 사용 중인 것처럼 보일 수 있다고 합니다.

window는 기본적으로 시스템에서 사용자가 쓰지 못하도록 특정 포트 번호 영역을 점유해놓는데 그 이유가 Window NAT(winnat) 드라이버 때문이라고 합니다.

즉 시스템 내에서 점유해놓은 포트번호를 제가 사용하려했기 때문에 컨테이너를 띄울 수 없었던 겁니다.

때문에 아래 명령어를 통해 WinNAT를 잠시 중지시킨 뒤 다시 도커 컨테이너를 띄울 수 있도록 한겁니다.

```bash
net stop winnat

```

참고로 도커를 띄운 뒤 다시 WinNAT를 실행하기 위해 아래 명령어를 실행했습니다.

```bash
net start winnat
```







<br>
<br>
<br>

<details>

<summary>참고문헌</summary>

<div markdown="1">


https://stackoverflow.com/questions/65272764/ports-are-not-available-listen-tcp-0-0-0-0-50070-bind-an-attempt-was-made-to

https://hiperzstudio.tistory.com/63

</div>

</details>