import { ReactNode } from "react";
import GlobalStyle from "components/Common/GlobalStyle";
import Header from "components/Common/Header";
import Footer from "components/Common/Footer";
import * as styles from "./Layout.css";

type LayoutProps = {
  children: ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <>
      <GlobalStyle />
      <Header />
      <main className={styles.container}>{children}</main>
      <Footer />
    </>
  );
}

export default Layout;
