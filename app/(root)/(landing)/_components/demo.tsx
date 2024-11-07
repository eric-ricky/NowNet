import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  CreditCard,
  DollarSign,
  Search,
  Shield,
  Wifi,
} from "lucide-react";

export default function NownetLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">
      {/* Hero Section */}

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            How Nownet Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
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
              <Card key={index} className="text-center p-6">
                <CardContent className="space-y-4">
                  {step.icon}
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p>{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Nownet */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Nownet?
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold mb-4">User Benefits</h3>
              {[
                {
                  icon: <Clock className="w-6 h-6 text-blue-600" />,
                  title: "Flexible & Affordable",
                  description:
                    "Get online whenever you need it, and only pay for the time you use.",
                },
                {
                  icon: <Wifi className="w-6 h-6 text-blue-600" />,
                  title: "Hassle-Free Access",
                  description:
                    "Skip the contracts and commitments. Connect to any Nownet provider with a single tap.",
                },
                {
                  icon: <Search className="w-6 h-6 text-blue-600" />,
                  title: "Wide Coverage",
                  description:
                    "Access internet from Nownet providers across the city and beyond.",
                },
              ].map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  {benefit.icon}
                  <div>
                    <h4 className="font-semibold">{benefit.title}</h4>
                    <p>{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold mb-4">Provider Benefits</h3>
              {[
                {
                  icon: <DollarSign className="w-6 h-6 text-blue-600" />,
                  title: "Turn Your Wi-Fi Into Income",
                  description:
                    "Share your connection and earn money effortlessly.",
                },
                {
                  icon: <CreditCard className="w-6 h-6 text-blue-600" />,
                  title: "Set Your Own Rates",
                  description:
                    "Decide how much to charge and manage your availability.",
                },
                {
                  icon: <Shield className="w-6 h-6 text-blue-600" />,
                  title: "Secure & Private",
                  description:
                    "Your network stays safe. Nownet manages all connections through secure protocols.",
                },
              ].map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  {benefit.icon}
                  <div>
                    <h4 className="font-semibold">{benefit.title}</h4>
                    <p>{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            See What Our Early Users Are Saying
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                quote:
                  "With Nownet, I can connect whenever I need it without paying for a full month. It's saved me a lot on data bills.",
                author: "Sarah K., User",
              },
              {
                quote:
                  "I never thought I could make money from my Wi-Fi. With Nownet, I'm earning passively without any extra effort.",
                author: "Mike T., Provider",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="space-y-4">
                  <p className="italic">&ldquo;{testimonial.quote}&ldquo;</p>
                  <p className="font-semibold text-right">
                    - {testimonial.author}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {/* <section className="py-20 bg-blue-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                question: "How do I find and connect to a Nownet provider?",
                answer:
                  "Simply download our app, search for available Wi-Fi nearby, and tap to connect.",
              },
              {
                question: "How much does it cost to use Nownet?",
                answer:
                  "Pricing varies by provider, but you only pay for the minutes or hours you're connected.",
              },
              {
                question: "Is it safe to share my Wi-Fi with others?",
                answer:
                  "Yes! Nownet ensures secure connections, so your personal data remains protected.",
              },
              {
                question: "How do I get paid as a provider?",
                answer:
                  "Payments are processed automatically. You'll receive earnings in your account on a weekly basis.",
              },
            ].map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section> */}

      {/* Final CTA */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          <h2 className="text-3xl font-bold">
            Ready to Join the Nownet Community?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Get Connected Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Start Earning Today
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
