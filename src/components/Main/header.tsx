import React from "react";
import styled from "@emotion/styled";
import { Link } from "gatsby";
import Dropdown from 'components/Main/Dropdown'


const LinkItemWrap = styled.div`
  width: 100%;
  height: 150px;
  background-color: black;
`;

const LinkItem = styled(Link)`
  width: 50px;
  height: 50px;
  color: red;
  font-size: 20px;
  background-color: black;
  margin-right: 40px;
`;

const linkArray = [
  { title: "home", path: `/` },
  { title: "Project", path: `/project` },
  { title: "Language", path: `/language` },
  { title: "ComputerScience", path: `/computerScience` },
  { title: "Tag", path: `/tag` },
  { title: "About", path: `/about` },
];

export default function Header() {
  return (
    <>
      <LinkItemWrap>
      <Dropdown />
        {linkArray.map((item, idx) => {
          return (
            <LinkItem key={idx} to={item.path}>
              {item.title}
            </LinkItem>
          );
        })}
      </LinkItemWrap>
    </>
  );
}
