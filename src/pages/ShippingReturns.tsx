import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { MoveLeft, Truck, Clock, RefreshCcw, ShieldCheck } from "lucide-react";

export const ShippingReturns = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-12">
          <MoveLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="text-xs uppercase tracking-[0.4em] text-primary mb-4 block">Store Policies</span>
          <h1 className="text-4xl md:text-6xl font-serif mb-6 italic">Shipping & Returns</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about getting your items and sending them back.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 md:p-12 rounded-[2rem] border border-border shadow-sm"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-serif mb-4">Shipping Info</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                We ship to all 36 states in Nigeria. International shipping is currently available to select countries worldwide.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex justify-between items-center pb-4 border-b border-border/50">
                  <span className="font-medium text-foreground">Standard Delivery</span>
                  <span>3-5 Business Days (₦3,000)</span>
                </li>
                <li className="flex justify-between items-center pb-4 border-b border-border/50">
                  <span className="font-medium text-foreground">Express Delivery</span>
                  <span>1-2 Business Days (₦5,500)</span>
                </li>
                <li className="flex justify-between items-center pb-4 border-b border-border/50">
                  <span className="font-medium text-foreground">International</span>
                  <span>7-14 Business Days (Calculated at checkout)</span>
                </li>
              </ul>
              <p className="text-sm pt-2 italic text-foreground">
                <Clock className="w-4 h-4 inline mr-1 -mt-0.5" /> 
                Orders placed before 2 PM WAT are processed the same day.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 md:p-12 rounded-[2rem] border border-border shadow-sm"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <RefreshCcw className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-serif mb-4">Returns Policy</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                We want you to love your purchase. If you're not completely satisfied, we gladly accept returns within 14 days of delivery.
              </p>
              <ul className="space-y-4 pt-4 list-disc pl-5">
                <li>Items must be unworn, unwashed, and in their original condition.</li>
                <li>All original tags must still be attached to the garments.</li>
                <li>Intimates, swimwear, and customized items are final sale.</li>
                <li>Return shipping costs are the responsibility of the customer unless the item is faulty.</li>
              </ul>
              <p className="text-sm pt-2 italic text-foreground">
                <ShieldCheck className="w-4 h-4 inline mr-1 -mt-0.5" /> 
                Refunds are processed to the original payment method within 5-7 business days of receiving the return.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="bg-[#2D2A26] text-white p-8 md:p-12 rounded-[2rem] text-center">
          <h3 className="text-2xl font-serif mb-4 italic">Need to Start a Return?</h3>
          <p className="text-white/70 mb-8 max-w-lg mx-auto">
            Please reach out to our customer care team with your order number to initiate the process.
          </p>
          <Link to="/contact" className="inline-block bg-white text-black font-medium rounded-full px-8 py-3 hover:bg-white/90 transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};
