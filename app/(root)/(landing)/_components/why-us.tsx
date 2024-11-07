import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Clock,
  CreditCard,
  DollarSign,
  Search,
  Shield,
  Wifi,
} from "lucide-react";

const userBenefits = [
  {
    icon: <Clock className="w-6 h-6 text-purple-600" />,
    title: "Flexible & Affordable",
    description:
      "Get online whenever you need it, and only pay for the time you use.",
  },
  {
    icon: <Wifi className="w-6 h-6 text-purple-600" />,
    title: "Hassle-Free Access",
    description:
      "Skip the contracts and commitments. Connect to any Nownet provider with a single tap.",
  },
  {
    icon: <Search className="w-6 h-6 text-purple-600" />,
    title: "Wide Coverage",
    description:
      "Access internet from Nownet providers across the city and beyond.",
  },
];

const providerBenefits = [
  {
    icon: <DollarSign className="w-6 h-6 text-blue-600" />,
    title: "Turn Your Wi-Fi Into Income",
    description: "Share your connection and earn money effortlessly.",
  },
  {
    icon: <CreditCard className="w-6 h-6 text-blue-600" />,
    title: "Set Your Own Rates",
    description: "Decide how much to charge and manage your availability.",
  },
  {
    icon: <Shield className="w-6 h-6 text-blue-600" />,
    title: "Secure & Private",
    description:
      "Your network stays safe. Nownet manages all connections through secure protocols.",
  },
];

const WhyUs = () => {
  return (
    <section className="py-20 bg-blue-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Nownet?
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          <Card>
            <CardHeader className="px-10 pt-8">
              <h3 className="text-2xl font-semibold mb-4">User Benefits</h3>
            </CardHeader>

            <CardContent>
              <div className="space-y-8">
                {userBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-5">
                    <div className="w-10 h-10 grid place-items-center rounded-full bg-purple-500/10">
                      {benefit.icon}
                    </div>
                    <div className="flex flex-col space-y-2">
                      <h4 className="font-semibold">{benefit.title}</h4>
                      <p className="text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="px-10 pt-8">
              <h3 className="text-2xl font-semibold mb-4">Provider Benefits</h3>
            </CardHeader>

            <CardContent>
              <div className="space-y-8">
                {providerBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-5">
                    <div className="w-10 h-10 grid place-items-center rounded-full bg-blue-500/10">
                      {benefit.icon}
                    </div>
                    <div className="flex flex-col space-y-2">
                      <h4 className="font-semibold">{benefit.title}</h4>
                      <p className="text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
