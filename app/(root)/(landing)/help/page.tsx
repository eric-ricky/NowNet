import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";

const HelpPage = () => {
  return (
    <div className="flex flex-col items-center text-center py-16 px-4 bg-gray-50 min-h-screen border-t">
      {/* Title */}
      <h1 className="text-3xl font-semibold mb-6">Hi, how can we help?</h1>

      {/* Search Bar */}
      <div className="flex items-center bg-white border mb-8 w-full max-w-md rounded-xl overflow-hidden">
        <Input
          type="text"
          placeholder="Search for guides and how-tos"
          className="flex-1 pr-12 border-none outline-none focus:outline-none bg-transparent"
        />
        <Button className="p-2 bg-blue-500 rounded-l-none">
          <Search />
        </Button>
      </div>

      {/* Help Text and Login Button */}
      <div className="flex flex-col md:flex-row md:items-center max-w-2xl border p-4 rounded-xl">
        <div className="flex flex-col gap-2 text-left pr-10">
          <p className="text-gray-700 text-sm font-semibold">
            Help center - Coming Soon
          </p>
          <p className="text-gray-500 text-xs max-w-sm">
            We’re building a comprehensive Help Center to make your Nownet
            experience as smooth as possible.
          </p>
        </div>
        <Link
          href={"mailto:anownet@gmail.com"}
          className="md:w-auto w-fit mt-4 md:mt-0"
        >
          <Button
            size={"sm"}
            variant="default"
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Contact our support team
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HelpPage;
