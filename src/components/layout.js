import * as React from "react";
import { useStaticQuery, graphql } from "gatsby";

import Header from "./header";

const layout = ({ pageTitle, children }) => {
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

      <main>
        <h1>{pageTitle}</h1>
        {children}
      </main>
    </>
  );
};

export default layout;
