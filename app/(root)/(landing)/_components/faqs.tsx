import { Accordion, AccordionItem } from "@/components/ui/accordion";

const faqQuestions = [
  {
    question: "How do I find and connect to a Nownet provider?",
    answer: "Simply search for available Wi-Fi nearby, and tap to connect.",
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
];

const FAQS = () => {
  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>
        <Accordion className="space-y-4">
          {faqQuestions.map((faq, index) => (
            <AccordionItem
              key={index}
              title={faq.question}
              content={faq.answer}
            />
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQS;
