import * as React from 'react'
import Seo from 'components/seo'
import Layout from 'components/layout'

const AboutPage = () => {
  return (
    <Layout pageTitle="About Me">
      <p>간략한 본인소개, 블로그를 만든 목적, 간단한 설명, 내 개발자 가치관 등 작성</p>
      <p>포트폴리오 링크 첨부</p>
    </Layout>
  )
}

export const Head = () => <Seo title="About Me" />

export default AboutPage
