import React, { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.4em] text-primary mb-4 block">Get in Touch</span>
          <h1 className="text-5xl md:text-7xl font-serif mb-6 italic">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you have a question about our products, sustainability practices, or your order, our team is here to help.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-3xl font-serif mb-8">Reach Out directly</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <p className="text-muted-foreground mb-1">Our friendly team is here to help.</p>
                    <a href="mailto:hello@miriamscollections.com" className="hover:text-primary transition-colors font-medium">hello@miriamscollections.com</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Studio</h3>
                    <p className="text-muted-foreground mb-1">Come say hello at our headquarters.</p>
                    <p className="font-medium">123 Artisan Way, Lagos, Nigeria</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Phone</h3>
                    <p className="text-muted-foreground mb-1">Mon-Fri from 8am to 5pm.</p>
                    <a href="tel:+2348001234567" className="hover:text-primary transition-colors font-medium">+234 800 123 4567</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm">
              <h3 className="font-serif text-2xl mb-4">Frequently Asked Questions</h3>
              <p className="text-muted-foreground mb-6">
                You might find the answer you're looking for in our Help Center.
              </p>
              <Link to="/faq">
                <Button variant="outline" className="w-full rounded-full">
                  Visit Help Center
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 md:p-12 rounded-[2rem] shadow-lg border border-border/50"
          >
            <h2 className="text-3xl font-serif mb-8">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                <input
                  id="subject"
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                  placeholder="How can we help you?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all resize-none"
                  placeholder="Tell us a little bit about what you need..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full rounded-full py-6 text-base"
                disabled={isSubmitting || submitted}
              >
                {isSubmitting ? (
                  "Sending..."
                ) : submitted ? (
                  "Message Sent!"
                ) : (
                  <>
                    Send Message <Send className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
