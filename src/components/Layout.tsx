import { PropsWithChildren } from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import ScrollToTop from "./ScrollToTop/ScrollToTop";
import * as styles from "./Layout.css";
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
