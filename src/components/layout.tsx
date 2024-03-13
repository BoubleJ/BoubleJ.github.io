import * as React from "react";
import { useStaticQuery, graphql } from "gatsby";
import styled from "styled-components";

import Header from "components/header";

let Main = styled.main`
  padding: 0 200px;
`;

const Layout = ({ pageTitle, children }) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);
  return (
    <>
      <Header />

      <Main>
        <h1>{pageTitle}</h1>
        {children}
      </Main>
    </>
  );
};

export default Layout;
