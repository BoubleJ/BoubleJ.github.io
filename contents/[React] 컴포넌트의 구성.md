---
date: "2024-02-02"
title: "[React] 컴포넌트의 구성"
categories: ["React"]
summary: "컴포넌트 구성에 대해 알아보겠습니다."
thumbnail: "./reacticon.png"
---

```jsx
function Date_choice() {
  //return 외부 영역을 컴포넌트의 '본문', '함수 본문'이라 부른다.
  const { state, dispatch } = useContext(CalendarContext);

  const toggle_Calendar = () => {
    dispatch({ type: "TOGGLE_CALENDAR" });
  };

  return (
    //return 내부 영역을 '렌더링된 내용', 렌더링된 JSX, JSX 영역 이라 부른다.
    <section className={RoomCataCSS.date_choice_box}>
      <h3>날짜</h3>

      <label
        htmlFor="term"
        className={RoomCataCSS.btn_date}
        onClick={toggle_Calendar}
      >
        <span>
          <b>9.3~9.4</b>
          <em> · 1박</em>
        </span>
      </label>
    </section>
  );
}
```
