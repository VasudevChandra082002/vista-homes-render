import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

import { createContactUs } from "@/api/contactUs.js"; // keep your existing .js helper

type Payload = {
  firstName: string;
  lastName: string;
  phone?: string;
  email: string;
  subject: string;
  message: string;
};

const Contact: React.FC = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      details: ["+919686102055"],
      description: "Speak with our expert agents",
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["info@sitrusgroup.com"],
      description: "Get detailed information via email",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["Vasavi Complex, 147, Seshadripuram Main Rd, Sripuram, Kumara Park West, Seshadripuram, Bengaluru, Karnataka 560020, India"],
      description: "Visit our modern office space",
    },
    // {
    //   icon: Clock,
    //   title: "Office Hours",
    //   details: ["Mon - Fri: 9:00 AM - 7:00 PM", "Sat - Sun: 10:00 AM - 5:00 PM"],
    //   description: "We're here when you need us",
    // },
  ];

  // form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");
  const [subject, setSubject]     = useState("");
  const [message, setMessage]     = useState("");

  // mutation
  const createMutation = useMutation({
    mutationFn: async (payload: Payload) => {
      const res = await createContactUs(payload);
      // your axios helper returns the raw axios response; unwrap common shapes:
      return (res as any)?.data?.data ?? (res as any)?.data ?? res;
    },
    onSuccess: () => {
      toast.success("Thanks! We received your message.");
      // reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.error || err?.message || "Failed to send message.";
      toast.error(msg);
    },
  });

  const validate = () => {
    if (!firstName.trim()) return "First name is required.";
    if (!lastName.trim()) return "Last name is required.";
    if (!email.trim()) return "Email is required.";
    // quick email check
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Please enter a valid email.";
    if (!subject.trim()) return "Subject is required.";
    if (!message.trim()) return "Message is required.";
    return null;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }
    createMutation.mutate({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      subject: subject.trim(),
      message: message.trim(),
    });
  };

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          {/* <Badge className="mb-4 bg-accent/10 text-accent border-accent/20">
            Contact Us
          </Badge> */}
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-foreground mb-4">
            Ready to Find Your
            <span className="text-primary block">Dream Property?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get in touch with our expert team. We're here to guide you through every step of your real estate journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6 animate-slide-up">
            {contactInfo.map((info, index) => (
              <Card
                key={index}
                className="group border-0 shadow-card hover-lift bg-gradient-card transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-200">
                        {info.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {info.description}
                      </p>
                      <div className="space-y-1">
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-sm font-medium text-foreground">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 animate-fade-in">
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-playfair font-bold text-foreground mb-6">
                  Send Us a Message
                </h3>

                <form className="space-y-6" onSubmit={onSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        First Name *
                      </label>
                      <Input
                        placeholder="Enter your first name"
                        className="h-12 border-border/50 focus:border-primary transition-colors duration-200"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        autoComplete="given-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Last Name *
                      </label>
                      <Input
                        placeholder="Enter your last name"
                        className="h-12 border-border/50 focus:border-primary transition-colors duration-200"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        autoComplete="family-name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="h-12 border-border/50 focus:border-primary transition-colors duration-200"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        className="h-12 border-border/50 focus:border-primary transition-colors duration-200"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Subject *
                    </label>
                    <select
                      className="w-full h-12 px-3 rounded-md border border-border/50 bg-background focus:border-primary focus:outline-none transition-colors duration-200"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option>Buying a Property</option>
                      <option>Selling a Property</option>
                      <option>Property Management</option>
                      <option>Investment Consultation</option>
                      <option>General Inquiry</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Message *
                    </label>
                    <Textarea
                      placeholder="Tell us about your real estate needs..."
                      className="min-h-32 border-border/50 focus:border-primary transition-colors duration-200 resize-none"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex w-1/2 flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={createMutation.isPending}
                      className="flex-1 h-12 bg-gradient-primary hover:bg-primary-dark transition-all duration-200 disabled:opacity-60"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {createMutation.isPending ? "Sending..." : "Send Message"}
                    </Button>

                    {/* <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="flex-1 h-12 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                      onClick={() => {
                        // Example action: open dialer or calendar
                        window.open("tel:+918792455231");
                      }}
                    >
                      Schedule a Call
                    </Button> */}
                  </div>

                  {/* Inline error (in addition to toast) */}
                  {createMutation.isError && (
                    <p className="text-destructive text-sm mt-2">
                      {(createMutation.error as any)?.message || "Failed to send message."}
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
