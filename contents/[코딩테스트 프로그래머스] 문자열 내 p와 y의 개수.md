---
date: "2024-05-06"
title: "[코딩테스트 프로그래머스] 문자열 내 p와 y의 개수 (레벨1)"
categories: ["codingTest", "Programmers", "Level.1"]
summary: "문자열 내 p와 y의 개수 문제 풀이과정"
thumbnail: "./프로그래머스.png"
---

[문제링크 : 문자열 내 p와 y의 개수](https://school.programmers.co.kr/learn/courses/30/lessons/12916)

# 문제 설명

대문자와 소문자가 섞여있는 문자열 s가 주어집니다. s에 'p'의 개수와 'y'의 개수를 비교해 같으면 True, 다르면 False를 return 하는 solution를 완성하세요. 'p', 'y' 모두 하나도 없는 경우는 항상 True를 리턴합니다. 단, 개수를 비교할 때 대문자와 소문자는 구별하지 않습니다.

예를 들어 s가 "pPoooyY"면 true를 return하고 "Pyy"라면 false를 return합니다.

# 제한 조건

- 문자열 s의 길이 : 50 이하의 자연수

- 문자열 s는 알파벳으로만 이루어져 있습니다.

## 입출력 예

| s         | answer |
| --------- | ------ |
| "pPoooyY" | true   |
| "Pyy"     | false  |

## 입출력 예 설명

입출력 예 #1
'p'의 개수 2개, 'y'의 개수 2개로 같으므로 true를 return 합니다.

입출력 예 #2
'p'의 개수 1개, 'y'의 개수 2개로 다르므로 false를 return 합니다.

※ 공지 - 2021년 8월 23일 테스트케이스가 추가되었습니다.

<br>
<br>
<br>
<br>

# 내 풀이

```js
function solution(s) {
  return (
    [...s.toLowerCase()].filter((item) => "p" === item).length ===
    [...s.toLowerCase()].filter((item) => "y" === item).length
  );
}
```

대소문자를 구분한다하지 않았으니 문자열을 소문자(혹은 대문자)로 통일시키고 filter함수를 이용해 p, y와 일치하는 알파벳의 개수를 파악 후 같은지 비교하고 그 결과값을 return 해주었습니다.

참고로 filter 함수는 문자열을 순환하지 못합니다. 그래서 `...` 스프레드연산자를 이용해 문자열을 배열처리해줬습니다.

제가 생각해도 정말 깔끔하게 코드를 짰기 때문에 다른 사람풀이는 적지 않겠습니다. ㅎㅎ

<br>
<br>
<br>

<details>

<summary>참고 자료</summary>

<div markdown="1">

https://hianna.tistory.com/488

</div>

</details>
