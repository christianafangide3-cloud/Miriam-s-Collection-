import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useProducts } from "../contexts/ProductsContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { MoveLeft, Lock, CreditCard, Truck, CheckCircle2, Package } from "lucide-react";
import { db } from "../lib/firebase";
import { toast } from "sonner";
import { collection, addDoc, serverTimestamp, getDocs, query, where } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "../lib/firestore-errors";
import { Button } from "@/components/ui/button";

export const Checkout = () => {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();
  const location = useLocation();
  const buyNowProduct = location.state?.buyNowProduct as string | undefined;

  const [step, setStep] = useState<1 | 2>(1);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: ""
  });

  useEffect(() => {
    const fetchDefaultShipping = async () => {
      if (!user) return;
      try {
        const userDoc = await getDocs(query(collection(db, "users"), where("__name__", "==", user.uid)));
        if (!userDoc.empty) {
          const data = userDoc.docs[0].data();
          if (data.defaultShipping) {
            const { recipient, address, city, phone } = data.defaultShipping;
            let firstName = "";
            let lastName = "";
            if (recipient) {
              const parts = recipient.split(" ");
              firstName = parts[0] || "";
              lastName = parts.slice(1).join(" ") || "";
            }
            setShippingInfo(prev => ({
              ...prev,
              firstName: firstName || prev.firstName,
              lastName: lastName || prev.lastName,
              address: address || prev.address,
              city: city || prev.city,
              phone: phone || prev.phone
            }));
          }
        }
      } catch (err) {
        console.error("Failed to load default shipping", err);
      }
    };
    fetchDefaultShipping();
  }, [user]);
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: ""
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const checkoutItems = buyNowProduct
    ? [{ productId: buyNowProduct, quantity: 1, product: products.find(p => p.id === buyNowProduct) }].filter(item => item.product !== undefined)
    : cart.map(item => {
        const p = products.find(prod => prod.id === item.productId);
        return { ...item, product: p };
      }).filter(item => item.product !== undefined);

  const subtotal = checkoutItems.reduce((total, item) => total + (item.product!.price * item.quantity), 0);
  const shippingCost = subtotal > 150000 ? 0 : 3000; // Free shipping over 150k
  const total = subtotal + shippingCost;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Fake payment processing validation
    if (!paymentInfo.cardNumber || !paymentInfo.expiry || !paymentInfo.cvv) {
      toast.error("Please enter payment details");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to place an order.");
      navigate("/");
      return;
    }

    setIsProcessing(true);
    
    try {
      const orderData = {
        userId: user.uid,
        items: buyNowProduct ? [{ productId: buyNowProduct, quantity: 1, price: checkoutItems[0]?.product?.price }] : cart,
        subtotal,
        shippingCost,
        total,
        status: "processing",
        shipping: {
          address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}`,
          phone: shippingInfo.phone,
          recipient: `${shippingInfo.firstName} ${shippingInfo.lastName}`
        },
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "orders"), orderData);
      if (!buyNowProduct) clearCart();
      toast.success("Order placed successfully!");
      navigate("/order-success");
      
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, "orders");
      toast.error("Failed to place your order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!buyNowProduct && cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center pt-24 px-6 text-center">
        <Package className="w-16 h-16 text-muted-foreground/30 mb-6" />
        <h2 className="text-3xl font-serif mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">Add some beautiful sustainable pieces to your cart to checkout.</p>
        <Link to="/">
          <Button className="rounded-full px-8 py-6">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
        
        {/* Main Content - Left Side */}
        <div className="flex-1 order-2 lg:order-1">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8">
            <MoveLeft className="w-4 h-4 mr-2" /> Back to Shop
          </Link>
          
          <div className="mb-10 flex items-center justify-between border-b border-border pb-6">
            <h1 className="text-3xl font-serif">Checkout</h1>
            <div className="flex items-center gap-4 text-sm font-medium">
              <span className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                1. Shipping <Truck className="w-4 h-4" />
              </span>
              <span className="text-muted-foreground/30">/</span>
              <span className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                2. Payment <CreditCard className="w-4 h-4" />
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleNextStep}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <h3 className="text-xl font-serif">Shipping Address</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First Name</label>
                      <input required type="text" className="w-full px-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none" value={shippingInfo.firstName} onChange={e => setShippingInfo({...shippingInfo, firstName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Name</label>
                      <input required type="text" className="w-full px-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none" value={shippingInfo.lastName} onChange={e => setShippingInfo({...shippingInfo, lastName: e.target.value})} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Address</label>
                    <input required type="text" className="w-full px-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none" placeholder="Street Address, Appt/Suite" value={shippingInfo.address} onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">City</label>
                      <input required type="text" className="w-full px-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none" value={shippingInfo.city} onChange={e => setShippingInfo({...shippingInfo, city: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">State/Province</label>
                      <input required type="text" className="w-full px-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none" value={shippingInfo.state} onChange={e => setShippingInfo({...shippingInfo, state: e.target.value})} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">ZIP / Postal Code</label>
                      <input required type="text" className="w-full px-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none" value={shippingInfo.zipCode} onChange={e => setShippingInfo({...shippingInfo, zipCode: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <input required type="tel" className="w-full px-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none" value={shippingInfo.phone} onChange={e => setShippingInfo({...shippingInfo, phone: e.target.value})} />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full rounded-full py-6 text-lg">
                  Continue to Payment
                </Button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handlePlaceOrder}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-serif">Payment Method</h3>
                    <div className="flex items-center text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full gap-1">
                      <Lock className="w-3 h-3" /> Secure Encrypted
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-2xl border border-border space-y-6">
                     <div className="space-y-2">
                      <label className="text-sm font-medium">Card Number</label>
                      <div className="relative">
                        <CreditCard className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input required type="text" placeholder="0000 0000 0000 0000" className="w-full pl-12 pr-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none tracking-widest font-mono" value={paymentInfo.cardNumber} onChange={e => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Name on Card</label>
                      <input required type="text" className="w-full px-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none" value={paymentInfo.nameOnCard} onChange={e => setPaymentInfo({...paymentInfo, nameOnCard: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Expiration (MM/YY)</label>
                        <input required type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none" value={paymentInfo.expiry} onChange={e => setPaymentInfo({...paymentInfo, expiry: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Security Code (CVV)</label>
                        <input required type="text" placeholder="123" className="w-full px-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none" value={paymentInfo.cvv} onChange={e => setPaymentInfo({...paymentInfo, cvv: e.target.value})} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" className="w-1/3 rounded-full py-6" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" className="w-2/3 rounded-full py-6 text-lg" disabled={isProcessing}>
                    {isProcessing ? "Processing..." : `Pay ₦${total.toLocaleString()}`}
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary - Right Side */}
        <div className="w-full lg:w-[400px] order-1 lg:order-2 shrink-0">
          <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm sticky top-32">
            <h3 className="text-xl font-serif mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto no-scrollbar pb-4">
              {checkoutItems.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-muted">
                    <img src={item.product!.image} alt={item.product!.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-1">{item.product!.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-medium">
                    ₦{(item.product!.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-border text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shippingCost === 0 ? "Free" : `₦${shippingCost.toLocaleString()}`}</span>
              </div>
            </div>

            <div className="flex justify-between items-end pt-6 mt-6 border-t border-border">
              <span className="text-lg font-serif">Total</span>
              <span className="text-2xl font-serif">₦{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
