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

  blockquote {
    margin-top: 10px;
    padding: 15px;
    border-left: 3px solid #D2D7DF;
    background-color: #F6F8FA;
    color : #72757B
  }
`;
