---
date: "2024-04-18"
title: "[Python] html 파서 만들기"
categories: ["Python", "Keyword"]
summary: "쿠팡 카테고리 id 값을 추출하기 위해 Python으로 html 파서를 만들어보겠습니다."
thumbnail: "./파이썬.png"
---

html 파서 라는 것을 사용하기 위해선 파이썬을 설치해야합니다. 파이썬을 사용해본적이 없어 설치했습니다.

<br><br>

# 파이썬 다운로드

구글에 '파이썬 다운로드' 검색 후 최신버전을 다운받아 줍니다.

![](https://velog.velcdn.com/images/dogmnil2007/post/600d1225-cd01-485b-9d8a-60e20ec68943/image.png)

<br>
<br>

# python, pip 설치

파이썬에서 html을 파싱하고 텍스트를 출력하는 기본적인 방법은 ` BeautifulSoup` 라는 라이브러리를 사용하는 것이라 합니다.

파이썬 라이브러리를 설치하기 위해선 `pip` 라는 파이썬 라이브러리 설치 패키지가 필요하다는군요. 자바스크립트의 `npm`과 비슷한 역할이라 보시면 됩니다.

파이썬 최신버전에는 `pip`가 내재되어있어 파이썬 설치 시 자동으로 `pip`도 설치된다고 합니다.

그래서 잘 설치되었나 터미널로 확인해봤는데..

![](https://velog.velcdn.com/images/dogmnil2007/post/aec2c53b-79e7-433e-9c02-f3fccb7fc2d0/image.png)

없다네요?? 오늘도 어김없이 억까 당하는군요.

<br><br>

인터넷에서 찾아보니 파이썬 설치할 때 밑에 설정을 체크해야한다는군요...

![](https://velog.velcdn.com/images/dogmnil2007/post/f64f03a0-df91-4c83-94ed-8cc3ead019cc/image.png)

그래서 다시 설치했습니다.

![](https://velog.velcdn.com/images/dogmnil2007/post/10987835-46f9-4e19-814c-671d9762f521/image.png)

정상적으로 설치했습니다.

파이썬 개발 툴 중 `pycharm`이라는 친구가 가장 강력하고 완성도가 높다고 합니다. 하지만 전 파이썬 입문초보자파린이이고 html 파서만 제작하고 한동안 사용하지 않을 예정이니 vscode 로 진행하겠습니다.

차후 python으로 코딩테스트 공부할 때 사용해보도록 하겠습니다.

 <br>
 
 잘 설치되었는지 확인해봅시다. 하단 명령어를 터미널에 입력해줍시다.

```shell
 python -v
```

```
 pip -v
```

![](https://velog.velcdn.com/images/dogmnil2007/post/a45febb1-8536-430a-9ff7-242efe9331e0/image.png)

잘 설치된 것 같습니다!!

# 라이브러리 설치

이제 html 파서를 설치하기 위해
`BeautifulSoup`와 `requests` 라이브러리를 설치해줍니다.

```shell
pip install beautifulsoup4 requests

```

`BeautifulSoup`는 HTML과 XML 파일을 파싱하기 위한 파이썬 라이브러리로, `웹 스크래핑(web scraping)`에 주로 사용되고, `requests` 라이브러리는 웹 페이지의 HTML을 가져오는 데 사용됩니다.

![](https://velog.velcdn.com/images/dogmnil2007/post/7b9c7a83-9d2c-41bf-97c5-5d30a8554259/image.png)

잘 설치 되었습니다.

# html 파서 활용법

이제 텍스트를 추출해봅시다.

아무폴더에 아무이름의 파이썬파일을 만들어줍니다. 전 `html_parser_sample.py` 이라고 지었습니다.

```py
# 필요한 라이브러리를 import합니다.
from bs4 import BeautifulSoup
import requests

# 웹 페이지의 URL
url = "텍스트 추출하고자하는 웹페이지 url을 작성해줍니다."

# requests를 사용하여 웹 페이지의 HTML을 가져옵니다.
response = requests.get(url)

# 웹 페이지의 HTML을 BeautifulSoup 객체로 변환합니다.
soup = BeautifulSoup(response.text, 'html.parser')

# prettify() 함수를 사용하여 HTML을 보기 좋게 출력해볼 수 있습니다.
print(soup.prettify())

# HTML에서 텍스트를 추출합니다.
# 예를 들어, 모든 <p> 태그 안의 텍스트를 가져오고 싶다면:
for p in soup.find_all('p'):
    print(p.get_text())

```

위 코드를 복붙해줍니다.
위 코드는 기본적인 HTML 파싱과 텍스트 추출 방법을 보여줍니다. url 변수에 원하는 웹 페이지의 URL을 넣으면, 해당 페이지의 모든 <p> 태그 안의 텍스트를 출력합니다.

전 네이버의 p태그를 추출해보겠습니다.

```py
//생략

url = "https://www.naver.com/"

//생략

```

이제 스크립트를 실행하면 됩니다.

```shell
python 스크립트이름.py

```

제가 만든 파이썬 스크립트 파일 이름은 `html_parser_sample.py` 이므로

```shell
python html_parser_sample.py

```

명령어를 실행해주겠습니다.

![](https://velog.velcdn.com/images/dogmnil2007/post/f256abaf-baee-46d3-b5b1-096c857ba95b/image.png)

어쩌구 저쩌구... 엄청난 양의 네이버 페이지의 p태그들이 출력되었습니다. 텍스트 추출에 성공했습니다!!

<details>

<summary>출처</summary>

<div markdown="1">

https://www.youtube.com/watch?v=vu3iOuihBB4

</div>

</details>
