import type { PropsWithChildren } from "react";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import * as styles from "./Layout.css";
import ScrollToTop from "./ScrollToTop/ScrollToTop";
import "@/styles/GlobalStyle.css";

interface LayoutProps extends PropsWithChildren {
  location?: {
    pathname: string;
  };
}

function Layout({ children, location }: LayoutProps) {
  const pathname = location?.pathname || "";
  return (
    <>
      <Header pathname={pathname} />
      <main className={styles.container}>{children}</main>
      <Footer />
      <ScrollToTop />
    </>
  );
}

export default Layout;
