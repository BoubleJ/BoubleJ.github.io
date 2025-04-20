import React, { FunctionComponent } from "react";
import styled from "@emotion/styled";

interface PostContentProps {
  html: string;
}

const PostContent: FunctionComponent<PostContentProps> = function ({ html }) {
  return <MarkdownRenderer dangerouslySetInnerHTML={{ __html: html }} />;
};

export default PostContent;

const MarkdownRenderer = styled.div`
  // Renderer Style
  display: flex;
  flex-direction: column;
  width: 768px;
  margin: 0 auto;
  padding: 100px 0;
  word-break: break-all;

  h1 {
    margin-top: 60px ;
    margin-bottom: 30px;
  }
  h2 {
    margin-top: 20px;
    margin-bottom: 10px;
  }
  h3 {
    margin-top: 10px;
    margin-bottom: 5px;
  }

  p {
    margin: 3px 0;
    line-height: 1.4;
  }

  blockquote {
    margin: 10px 0px;
    padding: 15px;
    border-left: 3px solid #d2d7df;
    background-color: #f6f8fa;
    color: #72757b;
  }

  ol,
  ul {
    margin-left: 20px;
    padding: 5px 0;
  }

  li {
    padding: 6px 0;
  }
`;
