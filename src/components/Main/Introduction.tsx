import React, { FunctionComponent } from "react";
import styled from "@emotion/styled";

const Background = styled.div`
  width: 100%;
  background-image: linear-gradient(60deg, #29323c 0%, #485563 100%);
  color: #ffffff;
`;

const NavTab = styled.nav`
  display: flex;
  justify-content: space-between;
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

const Tab = styled.a`
  font-size: 20px;
`;

const Introduction: FunctionComponent = function () {
  const tab = ["Home", "About", "Skills", "Projects", "Contact"];

  return (
    <Background>
      <Wrapper>
        <NavTab>
          {tab.map((item, index) => (
            <Tab key={`${index} + ${item}`} href="/">
              {item}
            </Tab>
          ))}
        </NavTab>
      </Wrapper>
    </Background>
  );
};

export default Introduction;
