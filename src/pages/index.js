import * as React from "react";
import { StaticImage } from "gatsby-plugin-image";
import Layout from "../components/layout";
import Seo from "../components/seo";
import "./index.css";

import styled from "styled-components";

let Box = styled.div`
  padding: 20px;
  color: grey;
`;
{
  /* padding : 20px color:grey인 div박스를 변수 Box에 저장(할당)  */
}

let YellowBtn = styled.button`
  background: yellow;
  color: black;
  padding: 10px;
`;

const IndexPage = () => {
  return (
    <Layout pageTitle="Home Page">
      <div>
        <p>I'm making this by following the Gatsby Tutorial.</p>
        <StaticImage
          alt="Clifford, a reddish-brown pitbull, posing on a couch and looking stoically at the camera"
          src="https://pbs.twimg.com/media/E1oMV3QVgAIr1NT?format=jpg&name=large"
        />
      </div>

      <div>
        <Box>
          <YellowBtn>버튼임</YellowBtn>
          {/*  background : yellow;
  color : black;
  padding : 10px; 인 '버튼임' button  */}
        </Box>
      </div>
    </Layout>
  );
};

export default IndexPage;

export const Head = () => <Seo title="Home Page" />;
