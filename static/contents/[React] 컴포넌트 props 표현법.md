---
date: "2024-01-01"
title: "[React] 컴포넌트 props 표현법"
categories: ["React"]
summary: "컴포넌트 props 표현법을 알아봅시다."
thumbnail: "/image/reacticon.png"
---


props 대신

```jsx
function Detail(){
  let [탭, 탭변경] = useState(0)

  return (
    <TabContent 탭={탭}/>
  )
}

function TabContent({탭}){
//props이름을 직접 적어도 된다. 
  if (탭 === 0){
    return <div>내용0</div>
  }
  if (탭 === 1){
    return <div>내용1</div>
  }
  if (탭 === 2){
    return <div>내용2</div>
  }
}
```

이렇게 해도 동작한다. 

```jsx

<ButtonDefault type='submit'><ButtonDefault/>
<ButtonDefault onClick={handleResetQuery}><ButtonDefault/>
<ButtonDefault disable={true}><ButtonDefault/>

const ButtonDefault = ({ ...props }) => {
//{ ...props } 는 컴포넌트별 각각 다른 props를 싹 다 가져온다는 뜻이다. 
    return (
        <button
            type={props.type}

            disabled={props.disable}
            className={`${style.btnDefault} ${
                props.disable ? style.disable : ''
            } ${props.style == 'sub' ? style.sub : ''} ${props.className}`}
            onClick={props.onClick}>
            {props.children}
        </button>
    )
}
{/*  
즉
type={props.type} -> type='submit'
disabled={props.disable} -> disable={true}
onClick={props.onClick} -> onClick={handleResetQuery}
이라 볼 수 있다. 
*/}
```