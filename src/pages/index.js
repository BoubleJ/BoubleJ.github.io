import * as React from "react";
import { StaticImage } from "gatsby-plugin-image";
import Layout from "components/layout";
import Seo from 'components/seo'
import 'pages/index.css';
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
        <p>재정이의 블로그입니다. 퍼가도됩니다 출처남겨주시면 감사링. 최대한 친절한 설명이 목적</p>
        <p>블로그 포스팅 목록 쫘르륵 내려가고 최신 포스팅이 가장 맨위로 올라오도록 구현</p>
        <p>밑 사진은 그냥 귀여워서 가져온 강아지</p>
        <StaticImage
          alt="Clifford, a reddish-brown pitbull, posing on a couch and looking stoically at the camera"
          src="https://pds.joongang.co.kr/news/component/htmlphoto_mmdata/202103/25/fbc1d446-2a25-4ea8-b3f4-30b2a795e97c.jpg"
        />
      </div>

    </Layout>
  );
};

export default IndexPage;

export const Head = () => <Seo title="Home Page" />;
