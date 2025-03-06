import styled from "@emotion/styled";
import React from "react";

const Wrap = styled.div`
  width: 270px;
  height: 100%;
  background-image: linear-gradient(60deg, #29323c 0%, #485563 100%);
  color: #ffffff;
`;

export default function Sidebar() {
  const categories = [
    {
      title: "Language",
      path: "/language",
    },
    {
      title: "Style Sheet",
      path: "/style",
    },
    {
      title: "Framework / Library",
      path: "/library",
    },
    {
      title: "Platform",
      path: "/platform",
    },
    {
      title: "Computer Science",
      path: "/cs",
    },
    {
      title: "Programming",
      path: "/prgramming",
    },
  ];

  return (
    <Wrap>
      {categories.map((category, index) => {
        return (
          <div key={index}>
            <a href={category.path}>{category.title}</a>
          </div>
        );
      })}
    </Wrap>
  );
}
