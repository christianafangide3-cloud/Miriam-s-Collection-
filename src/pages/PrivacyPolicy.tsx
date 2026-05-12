import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { MoveLeft } from "lucide-react";

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-12">
          <MoveLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-xs uppercase tracking-[0.4em] text-primary mb-4 block">Legal</span>
          <h1 className="text-4xl md:text-6xl font-serif mb-8 italic">Privacy Policy</h1>
          <p className="text-muted-foreground mb-12">Last updated: May 12, 2026</p>

          <div className="prose prose-stone max-w-none prose-headings:font-serif prose-p:text-muted-foreground leading-relaxed">
            <h2>1. Introduction</h2>
            <p>
              At Miriam's Collections, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
            </p>

            <h2>2. The Data We Collect About You</h2>
            <p>
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul>
              <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
              <li><strong>Financial Data</strong> includes payment card details (processed securely by our payment providers, not stored by us).</li>
              <li><strong>Transaction Data</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
              <li><strong>Profile Data</strong> includes your username and password, purchases or orders made by you, your interests, preferences, and feedback.</li>
            </ul>

            <h2>3. How We Use Your Personal Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul>
              <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., fulfilling an order).</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
            </p>

            <h2>5. Your Legal Rights</h2>
            <p>
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at <a href="mailto:privacy@miriamscollections.com" className="text-primary hover:underline">privacy@miriamscollections.com</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
