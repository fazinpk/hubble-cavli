import type { FC } from "react";

import Footer from "./components/footer";
import Header from "./components/header";
import type { MainLayoutProps } from "./type";

const MainLayout: FC<MainLayoutProps> = ({ children }) => (
  <>
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </>
);

export default MainLayout;
