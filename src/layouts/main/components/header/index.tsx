import { Suspense, type FC } from "react";

import NavBar from "../nav-bar";
import TopBar, { TopBarSkeleton } from "../top-bar";

const Header: FC = () => (
  <>
    <Suspense fallback={<TopBarSkeleton />}>
      <TopBar />
    </Suspense>
    <header className="sticky top-0 z-40">
      <NavBar />
    </header>
  </>
);

export default Header;
