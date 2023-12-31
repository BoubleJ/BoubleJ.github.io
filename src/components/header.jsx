import React, { useState } from 'react';
import { Link } from 'gatsby'
import styled from 'styled-components'

let HeaderBox = styled.div`
width : 100%;
background-color: yellow;
height : 100px;
padding : 30px 15px;
`

let NavBox = styled.nav`
border : solid 1px black;
height : 100%;
display : flex;

`
let NavTitle = styled.div`
padding: 1rem;
font-size: 20px;
background: powderblue;
border-radius: 1rem;
transition: 0.5s;
&:hover {
  background: cornflowerblue;
  color: white;
  transition: 0.5s;
}
`




const header = () => {


  const [linkBox, setLinkBox] = useState([{title : 'jaejung Blog', path : '/'},
  {title : 'Programming', path : '/blog'},
   {title : 'Experience', path : '/blog'},
   {title : 'Tag', path : '/tag'}  ,
   {title : 'About', path : '/about'}  ]) 
    return (
    
       
    
            <HeaderBox>
            <NavBox>
            {linkBox.map((val, idx)=>{
          return (
            <NavTitle >
            <Link to={val.path}>
           {val.title}
            </Link>
          </NavTitle>
          )
        })}
      
      
       
     
      </NavBox>
            </HeaderBox>
     
      
 
    )
}



export default header 