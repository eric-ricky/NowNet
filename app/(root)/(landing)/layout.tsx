import { PropsWithChildren } from "react";
import Navbar from "../_components/navbar";

const HomePageLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
      <Navbar />

      <main className="flex-1 relativ">{children}</main>
    </div>
  );
};

export default HomePageLayout;
