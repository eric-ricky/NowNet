import { PropsWithChildren } from "react";
import Footer from "./_components/footer";
import Navbar from "./_components/navbar";

const HomePageLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col h-screen relative overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
      {/* <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div> */}

      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default HomePageLayout;
