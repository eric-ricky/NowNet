import { PropsWithChildren } from "react";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="w-screen h-screen overflow-hidden relative flex items-center justify-center">
      <div className="absolute top-0 -z-10 h-full w-full bg-white">
        <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(173,109,244,0.5)] opacity-50 blur-[80px]"></div>
      </div>
      {/* <Image
        src={"/images/people_1.jpg"}
        alt=""
        width={400}
        height={400}
        className="absolute bottom-0 left-0 object-cover transform scale-x-[-1]"
      />

      <Image
        src={"/images/people_1.jpg"}
        alt=""
        width={400}
        height={400}
        className="absolute bottom-0 right-0 object-cover transform"
      /> */}

      {children}
    </div>
  );
};

export default AuthLayout;
