import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { CheckCircle2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center pt-24 px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 md:p-16 rounded-[3rem] shadow-sm border border-border text-center max-w-2xl w-full"
      >
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-serif mb-4 italic">Thank You!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your order has been placed successfully. We've sent a confirmation email with your order details.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/profile">
            <Button variant="outline" className="w-full rounded-full px-8 py-6">
               View Order History
            </Button>
          </Link>
          <Link to="/">
            <Button className="w-full rounded-full px-8 py-6">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
