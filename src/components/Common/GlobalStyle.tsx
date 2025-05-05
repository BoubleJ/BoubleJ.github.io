import React, { FunctionComponent } from "react";
import { Global, css } from "@emotion/react";

const defaultStyle = css`

  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  html,
  body,
  #___gatsby {
    height: 100%;
  }

  a {
    color : black;
    text-decoration: none;
  }
  a:hover {
    color: #0969D9;
    cursor: pointer;
  }
`;

function GlobalStyle() {
  return <Global styles={defaultStyle} />;
};

export default GlobalStyle;
