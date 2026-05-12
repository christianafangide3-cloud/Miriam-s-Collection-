import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { MoveLeft, HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const FAQ = () => {
  const faqs = [
    {
      question: "Where do you ship?",
      answer: "We currently ship to all 36 states in Nigeria and select international destinations. For more details on international shipping and rates, please check our Shipping & Returns policy."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard delivery within Nigeria takes 3-5 business days. Express delivery takes 1-2 business days. International shipping can take 7-14 business days depending on the destination."
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns within 14 days of delivery. Items must be unworn, unwashed, and have all original tags attached. Intimates and sale items are final sale. Please visit our Shipping & Returns page to initiate a return."
    },
    {
      question: "Are your materials truly sustainable?",
      answer: "Yes. We source only GOTS-certified organic cotton, recycled polyester (often from ocean-bound plastics), and deadstock fabrics that would otherwise go to landfill. Each product description highlights its specific sustainable properties."
    },
    {
      question: "How should I care for my garments?",
      answer: "To ensure the longevity of your pieces and minimize environmental impact, we recommend washing on a cold, gentle cycle and air-drying when possible. Detailed care instructions are included on the tag of each item."
    },
    {
      question: "Can I cancel or modify my order?",
      answer: "We process orders very quickly. If you need to cancel or modify an order, please contact us at hello@miriamscollections.com within 1 hour of placing it. Once it has been processed, we are unable to make changes."
    }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <Link to="/contact" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-12">
          <MoveLeft className="w-4 h-4 mr-2" /> Back to Contact
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <span className="text-xs uppercase tracking-[0.4em] text-primary mb-4 block">Help Center</span>
          <h1 className="text-4xl md:text-6xl font-serif italic mb-6">Frequently Asked Questions</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Find answers to common questions about our products, shipping, and sustainability practices.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-border"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-border/50">
                <AccordionTrigger className="text-left font-serif text-lg hover:text-primary hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6 text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <Link to="/contact" className="text-primary font-medium hover:underline">
            Contact our support team
          </Link>
        </div>
      </div>
    </div>
  );
};
