import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllfaq } from "@/api/faqApi";
import { Phone, Mail, X } from "lucide-react";

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
  if (Array.isArray(top?.data?.data)) return top.data.data as FaqItem[];
  return [];
};

const FAQ: React.FC = () => {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["faqs", "public"],
    queryFn: async () => {
      const res = await getAllfaq();
      return extractFaqArray(res);
    },
  });

  const faqs: FaqItem[] = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const openContactModal = () => {
    setContactModalOpen(true);
  };

  const closeContactModal = () => {
    setContactModalOpen(false);
  };

  return (
    <section className="py-20 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-playfair font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-white max-w-2xl mx-auto">
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
                    <AccordionTrigger className="text-left  hover:text-primary transition-colors duration-200 py-6 text-base md:text-lg font-medium">
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
            <p className="text-white mb-4">
              Still have questions? We're here to help!
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              {/* <a
                href="#contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-primary text-primary-foreground rounded-lg font-medium hover:bg-primary-dark transition-all duration-200"
              >
                Contact Our Team
              </a> */}
              <Button
                onClick={openContactModal}
                variant="outline"
                className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                Call Us Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={closeContactModal}>
          <div className="bg-white rounded-lg max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Contact Us</h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={closeContactModal}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                Have questions about our properties or services? Contact us directly!
              </p>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Call us at</p>
                  <a href="tel:+91876543212" className="text-blue-600 font-medium hover:underline">
                   +91 9686102055
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="bg-green-100 p-2 rounded-full">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email us at</p>
                  <a href="mailto:abcde@gmail.com" className="text-green-600 font-medium hover:underline">
                    info@sitrusgroup.com
                  </a>
                </div>
              </div>
              
              <div className="pt-4">
                <p className="text-sm text-gray-500">
                  Our team is available Monday to Saturday, 9 AM to 6 PM.
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <Button className="flex-1 bg-gradient-primary" asChild>
                <a href="tel:+91876543212">Call Now</a>
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <a href="mailto:abcde@gmail.com">Email Now</a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FAQ;