"use client";

import { useSupportModal } from "@/hooks/modal-state/use-support-modal";
import { cn } from "@/lib/utils";
import { Headset, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMedia } from "react-use";
import { Button } from "../ui/button";

const Support = ({
  isModal,
  className,
}: {
  isModal?: boolean;
  className?: string;
}) => {
  const { isOpen, onClose, onOpen } = useSupportModal();
  const isMobile = useMedia("(max-width: 768px)", true);

  if (isModal && !isMobile) return null;

  if (isModal && isMobile)
    return (
      <div
        className={cn(
          "md:hidden fixed bottom-4 right-5 flex items-start gap-2 w-[90%] h-72 overflow-hidden",
          {
            "h-fit w-fit bg-green-500 rounded-full shadow-xl": !isOpen,
          },
          className
        )}
      >
        <Button
          variant="default"
          size="icon"
          onClick={() => {
            isOpen ? onClose() : onOpen();
          }}
          className="text-white rounded-full"
        >
          {isOpen ? <X className="size-5 " /> : <Headset className="size-5" />}
        </Button>

        {isOpen && (
          <div className="relative w-full h-full shadow-2xl  border border-slate-400 rounded-xl overflow-hidden">
            <Image
              src="/images/banner_woman.png"
              alt="Woman using laptop"
              fill
              className="object-cover"
            />

            <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]" />

            <div className="absolute inset-0 z-50 h-full w-full px-4 sm:px-6 lg:px-8 bg-yellow-500/0 flex items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-200 sm:text-4xl">
                  Learning Center?
                </h2>
                <p className="mt-4 text-lg text-gray-300">
                  Get started with our online learning platform.
                </p>

                <Link
                  href={
                    "https://airy-border-43d.notion.site/1372dacd3ac5806a96f1cd3645aeb59f?v=93a2ee7424d64ec2b62796916f88da59"
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button className="mt-8 inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Getting Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    );

  return (
    <div className={cn("flex items-start gap-2 w-full h-52", className)}>
      <div className="relative w-full h-full shadow-2xl border border-slate-400 rounded-xl overflow-hidden">
        <Image
          src="/images/banner_woman.png"
          alt="Woman using laptop"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]" />

        <div className="absolute inset-0 z-50 h-full w-full px-4 flex items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-200 ">
              Learning Center?
            </h2>
            <p className="mt-4 text-sm text-gray-300">
              Get started with our online learning platform.
            </p>

            <Link
              href={
                "https://airy-border-43d.notion.site/1372dacd3ac5806a96f1cd3645aeb59f?v=93a2ee7424d64ec2b62796916f88da59"
              }
              target="_blank"
              rel="noreferrer"
            >
              <Button className="mt-8 inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Getting Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
