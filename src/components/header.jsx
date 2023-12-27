import React from 'react';
import { Link } from 'gatsby'
import styled from 'styled-components'

let HeaderBox = styled.div`
width : 100%;
background-color: teal;
height : 100px;
`


let UlBox = styled.ul`
margin : 0px;

`



const header = () => {
    return (
        <>
    
            <HeaderBox>
            <nav>
        <UlBox>
          <li >
            <Link to="/" >
              Home
            </Link>
          </li>
          <li >
            <Link to="/about" >
              About
            </Link>
          </li>
          <li >
            <Link to="/blog" >
              Blog
            </Link>
          </li>
        </UlBox>
      </nav>
            </HeaderBox>
     
      
        </>
    )
}



export default header 