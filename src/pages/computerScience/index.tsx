import React, { FunctionComponent } from "react";
import { graphql } from "gatsby";
import styled from "@emotion/styled";
import { Global, css } from "@emotion/react";

const TextStyle = css`
  font-size: 18px;
  font-weight: 700;
  color: gray;
`;
// Kebab Case 적용
const Text1 = styled.div<{ disable: boolean }>`
  font-size: 20px;
  font-weight: 700;
  text-decoration: ${({ disable }) => (disable ? "line-through" : "none")};
`;

const Text2 = styled("div")<{ disable: boolean }>(({ disable }) => ({
  fontSize: "15px",
  color: "blue",
  textDecoration: disable ? "line-through" : "none",
}));

const globalStyle = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;

    font-size: 20px;
  }
`;

type InfoPageProps = {
  data: {
    site: {
      siteMetadata: {
        title: string;
        description: string;
        author: string;
      };
    };
  };
};

const InfoPage: FunctionComponent<InfoPageProps> = function ({
  data: {
    site: {
      siteMetadata: { title, description, author },
    },
  },
}) {
  return (
    <div>
      <Global styles={globalStyle} />
      <div css={TextStyle}>{title}</div>
      <Text1 disable={true}>{description}</Text1>
      <Text2 disable={true}>{author}</Text2>
      <p>하 진짜 개열받는다 아니 params로 쓸 수없는 단어가 있나봐... 도대체 왜 라우팅이 안되는지 도무지 이해가 안간다</p>
      <p>여긴cs 이론 작성하는 곳 http 나 이런저런 aws 나 이런거?</p>
    </div> 
  );
};

export default InfoPage;

export const metadataQuery = graphql`
  {
    site {
      siteMetadata {
        title
        description
        author
      }
    }
  }
`;
