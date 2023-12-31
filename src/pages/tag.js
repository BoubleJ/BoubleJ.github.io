import * as React from "react";
import Seo from "components/seo";
import Layout from "components/layout";

const AboutPage = () => {
  return (
    <Layout pageTitle="Tag Page">
      <p>태그로 검색할 수 있는 페이지</p>
    </Layout>
  );
};

export const Head = () => <Seo title="Tag" />;

export default AboutPage;
