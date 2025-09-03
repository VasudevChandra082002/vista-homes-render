import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { getAllfaq } from "@/api/faqApi";

type FaqItem = {
  _id?: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
};

const extractFaqArray = (res: any): FaqItem[] => {
  const top = res?.data ?? res;
  if (Array.isArray(top?.faqs)) return top.faqs as FaqItem[];
  if (Array.isArray(top?.data)) return top.data as FaqItem[];
  if (Array.isArray(top)) return top as FaqItem[];
  // some backends return { data: { data: [...] } }
  if (Array.isArray(top?.data?.data)) return top.data.data as FaqItem[];
  return [];
};

const FAQ: React.FC = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["faqs", "public"],
    queryFn: async () => {
      const res = await getAllfaq();
      return extractFaqArray(res);
    },
  });

  const faqs: FaqItem[] = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            {/* <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              FAQ
            </Badge> */}
            <h2 className="text-3xl md:text-5xl font-playfair font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get answers to the most common questions about buying, selling, and investing in real estate.
            </p>
          </div>

          <div className="animate-slide-up">
            {/* Loading */}
            {isLoading && (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 rounded-lg bg-muted animate-pulse"
                    style={{ animationDelay: `${i * 80}ms` }}
                  />
                ))}
              </div>
            )}

            {/* Error */}
            {isError && (
              <div className="text-destructive text-center">
                {(error as any)?.message || "Failed to load FAQs."}
              </div>
            )}

            {/* Empty */}
            {!isLoading && !isError && faqs.length === 0 && (
              <div className="text-muted-foreground text-center">
                No FAQs available right now.
              </div>
            )}

            {/* List */}
            {!isLoading && !isError && faqs.length > 0 && (
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={faq._id ?? index}
                    value={`item-${faq._id ?? index}`}
                    className="border border-border/50 rounded-lg px-6 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-card transition-all duration-200"
                  >
                    <AccordionTrigger className="text-left hover:text-primary transition-colors duration-200 py-6 text-base md:text-lg font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-6 text-base whitespace-pre-wrap">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>

          <div className="text-center mt-12 animate-fade-in">
            <p className="text-muted-foreground mb-4">
              Still have questions? We're here to help!
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-dark transition-all duration-200"
              >
                Contact Our Team
              </a>
              <a
                href="tel:+1-555-0123"
                className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                Call Us Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
