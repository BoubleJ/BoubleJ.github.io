import React, { useState } from "react";
import { Link } from "gatsby";
import styled from "styled-components";

let HeaderBox = styled.div`
  width: 100%;
  background-color: yellow;
  height: 100px;
  padding: 30px 15px;
`;

let NavBox = styled.nav`
  border: solid 1px black;
  height: 100%;
  display: flex;
`;
let NavTitle = styled.div`
  padding: 1rem;
  font-size: 20px;
  background: powderblue;
  border-radius: 1rem;
  transition: 0.5s;
  flex: 1 1 0;
  &:hover {
    background: cornflowerblue;
    color: white;
    transition: 0.5s;
  }
`;

let NavTitle2 = styled.div`
  padding: 1rem;
  font-size: 20px;
  background: powderblue;
  border-radius: 1rem;
  transition: 0.5s;
  height: 50px;
  flex: 1 1 0;
  &:hover {
    background: cornflowerblue;
    color: white;
    transition: 0.5s;
  }
`;

let ThreePartBox = styled.div`
  flex: 1 1 0;
  height: 100%;
`;

let ThreePartBox3 = styled.div`
  flex: 2 1 0;
  display: flex;
`;

const Header = () => {
  const [linkBox, setLinkBox] = useState([
    { title: "Programming", path: "/blog" },
    { title: "Experience", path: "/blog" },
    { title: "Tag", path: "/tag" },
    { title: "About", path: "/about" },
  ]);
  return (
    <HeaderBox>
      <NavBox>
        <ThreePartBox>
    
          <NavTitle2>
            <Link to="/">jaejung Blog</Link>
          </NavTitle2>
        </ThreePartBox>

        <ThreePartBox3>
          {linkBox.map((val, idx) => {
            return (
              <NavTitle>
                <Link to={val.path}>{val.title}</Link>
              </NavTitle>
            );
          })}
        </ThreePartBox3>
        <ThreePartBox>
     
          <input />
          <button>검색</button>
        </ThreePartBox>
      </NavBox>
    </HeaderBox>
  );
};

export default Header;
