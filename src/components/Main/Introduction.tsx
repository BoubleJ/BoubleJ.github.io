import React from "react";
import styled from "@emotion/styled";

const Background = styled.div`
  max-width: 1140px;
  height: 76px;
  background-image: linear-gradient(60deg, #29323c 0%, #485563 100%);
  color: #ffffff;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 1050px;
  height: 80px;
  margin: 0 auto;

  @media (max-width: 768px) {
    width: 100%;
    height: 300px;
    padding: 0 20px;
  }
`;

function Introduction() {
  return (
    <Background>
      <Wrapper></Wrapper>
    </Background>
  );
}

export default Introduction;
