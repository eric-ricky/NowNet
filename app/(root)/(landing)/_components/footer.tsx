import { Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between mt-8 pt-8 border-t border-gray-700 ">
        <div className="text-center text-sm text-gray-400">
          © {new Date().getFullYear()} NowNet. All rights reserved.
        </div>

        <div className="flex items-center space-x-4 mt-8 md:mt-0">
          <div className="flex items-center text-sm text-gray-400">
            <Mail className="size-4 mr-2" />
            anownet@gmail.com
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <Phone className="size-4 mr-2" />
            +2547 95 580629
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
