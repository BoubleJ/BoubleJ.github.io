import styled from "@emotion/styled";
import React from "react";

const Wrap = styled.div`
  width: 270px;
  height: 100%;
  background-image: linear-gradient(60deg, #29323c 0%, #485563 100%);
  color: #ffffff;
`;

export default function Sidebar() {
  return <Wrap>Sidebar</Wrap>;
}
