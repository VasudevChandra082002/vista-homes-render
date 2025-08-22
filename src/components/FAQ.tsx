import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const FAQ = () => {
  const faqs = [
    {
      question: "How do I start the home buying process?",
      answer: "The home buying process begins with getting pre-approved for a mortgage, which helps you understand your budget. Then, we'll help you identify your needs, search for properties, schedule viewings, and guide you through making an offer and closing the deal."
    },
    {
      question: "What documents do I need to buy a property?",
      answer: "You'll typically need proof of income (pay stubs, tax returns), bank statements, employment verification, credit report, government-issued ID, and pre-approval letter from your lender. We'll provide you with a comprehensive checklist."
    },
    {
      question: "How long does it take to close on a property?",
      answer: "The typical closing process takes 30-45 days from the time your offer is accepted. This includes time for home inspection, appraisal, loan processing, and final walkthrough. Cash purchases can close much faster, often within 1-2 weeks."
    },
    {
      question: "Do you help with property management for investors?",
      answer: "Yes, we offer comprehensive property management services including tenant screening, rent collection, maintenance coordination, financial reporting, and legal compliance. Our team handles all aspects so you can focus on growing your investment portfolio."
    },
    {
      question: "What are your commission fees?",
      answer: "Our commission structure is competitive and transparent. We offer different service packages to meet various needs and budgets. During our initial consultation, we'll discuss our fees and explain exactly what services are included."
    },
    {
      question: "Can you help me sell my current home before buying a new one?",
      answer: "Absolutely! We specialize in coordinated transactions and can help you strategically time the sale of your current home with the purchase of your new one. We offer bridge financing options and contingency strategies to make the transition smooth."
    },
    {
      question: "Do you work with first-time home buyers?",
      answer: "Yes, we love working with first-time buyers! We provide educational resources, connect you with trusted lenders, explain every step of the process, and ensure you feel confident and informed throughout your home buying journey."
    },
    {
      question: "What areas do you serve?",
      answer: "We serve over 50 cities across major metropolitan areas. Our extensive network allows us to provide local expertise wherever you're looking to buy or sell. Contact us to confirm we serve your specific area of interest."
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              FAQ
            </Badge>
            <h2 className="text-3xl md:text-5xl font-playfair font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get answers to the most common questions about buying, selling, and investing in real estate.
            </p>
          </div>

          <div className="animate-slide-up">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border border-border/50 rounded-lg px-6 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-card transition-all duration-200"
                >
                  <AccordionTrigger className="text-left hover:text-primary transition-colors duration-200 py-6 text-base md:text-lg font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-6 text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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