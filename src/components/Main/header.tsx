import React from "react";
import styled from "@emotion/styled";
import { Link } from "gatsby";
import Dropdown from "components/Main/Dropdown";

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
  const projectLink = [
    { title: "Gatsby 블로그", path: `/project/gatsbyblog` },
    { title: "키워드 프로젝트", path: `/project/keyword` },
    { title: "마켓플레이스 프로젝트", path: `/project/market` },
    { title: "여기어때 클론코딩", path: `/project/yeogi` },
  ];

  const languageLink = [
    { title: "HTML/CSS", path: `/language/htmlcss` },
    { title: "React", path: `/language/react` },
    { title: "Next.JS", path: `/language/next` },
  ];

  return (
    <>
      <LinkItemWrap>
        <Dropdown LinkArray={projectLink} />
        <Dropdown LinkArray={languageLink} />
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
