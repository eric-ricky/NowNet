import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CreditCard, DollarSign, Search } from "lucide-react";
import Link from "next/link";

const HowItWorks = () => {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 pt-10">
        <div className="flex flex-col items-center justify-center text-center gap-4 mb-20">
          <p className="text-2xl font-medium text-[#222A34]">How It Works</p>
          <h2 className="text-3xl text-[#00305D] font-bold text-center ">
            Instant Wi-Fi Access, Easy Earnings
          </h2>

          <p className="max-w-lg text-sm text-[#222A34]">
            With Nownet, users pay only for the Wi-Fi they need, while providers
            earn from their networks effortlessly. Simple, flexible, and
            commitment-free.
          </p>
        </div>

        <div className="grid md:grid-cols-3 bg-white shadow-2xl rounded-2xl">
          {[
            {
              icon: <Search className="w-12 h-12 text-blue-600" />,
              title: "Find Nearby Wi-Fi",
              description:
                "Search for available Nownet Wi-Fi spots in your area and connect instantly.",
            },
            {
              icon: <CreditCard className="w-12 h-12 text-blue-600" />,
              title: "Pay As You Go",
              description:
                "Only pay for the time you're connected. Disconnect when you're done to avoid extra charges.",
            },
            {
              icon: <DollarSign className="w-12 h-12 text-blue-600" />,
              title: "Earn by Hosting",
              description:
                "Have Wi-Fi at home? Sign up as a provider to share your connection and earn passive income.",
            },
          ].map((step, index) => (
            <Card
              key={index}
              className={cn(
                "text-center p-6 !border-none hover:border hover:bg-[rgb(0,33,79,1)] hover:cursor-pointer transition duration-200 group"
              )}
            >
              <CardHeader>
                <div className="bg-[#F7F7FA] text-[#222A34] group-hover:text-[#F7F7FA] group-hover:bg-[rgb(0,33,79,0.2)] text-sm py-2.5 rounded-3xl">
                  Step {index + 1}
                </div>
              </CardHeader>

              <CardContent className="space-y-4 group-hover:text-white">
                <div className="py-10 grid place-items-center">{step.icon}</div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p>{step.description}</p>
              </CardContent>

              <CardFooter className="py-10 flex flex-col">
                <Link href={"/app"}>
                  <Button
                    variant="outline"
                    className="rounded-full hover:text-blue-500"
                  >
                    Get Started
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
