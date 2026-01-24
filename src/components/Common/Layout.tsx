import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import * as styles from "./Layout.css";
import "./GlobalStyle.css";

type LayoutProps = {
  children: ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <main className={styles.container}>{children}</main>
      <Footer />
    </>
  );
}

export default Layout;
