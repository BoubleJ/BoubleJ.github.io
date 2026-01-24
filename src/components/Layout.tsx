import { PropsWithChildren } from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import * as styles from "./Layout.css";
import "@/styles/GlobalStyle.css";

function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      <main className={styles.container}>{children}</main>
      <Footer />
    </>
  );
}

export default Layout;
