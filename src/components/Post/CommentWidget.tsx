import React, { createRef, useEffect } from "react";
import styled from "@emotion/styled";

const UtterancesWrapper = styled.div`
  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const src = "https://utteranc.es/client.js";
const repo = "BoubleJ/BoubleJ.github.io"; // 자신 계정의 레포지토리로 설정

interface UtterancesAttributesType {
  src: string;
  repo: string;
  "issue-term": string;
  label: string;
  theme: string;
  crossorigin: string;
  async: string;
}

function CommentWidget() {
  const element = createRef<HTMLDivElement>();

  useEffect(() => {
    if (element.current === null) return;

    const utterances: HTMLScriptElement = document.createElement("script");

    const attributes: UtterancesAttributesType = {
      src,
      repo,
      "issue-term": "pathname",
      label: "Comment",
      theme: `github-light`,
      crossorigin: "anonymous",
      async: "true",
    };

    Object.entries(attributes).forEach(([key, value]) => {
      utterances.setAttribute(key, value);
    });

    element.current.appendChild(utterances);
  }, []);

  return <UtterancesWrapper ref={element} />;
}

export default CommentWidget;
