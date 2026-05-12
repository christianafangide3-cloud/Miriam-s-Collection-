import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "../lib/firestore-errors";
import { PackageOpen, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useProducts } from "../contexts/ProductsContext";

interface OrderItem {
  productId: string;
  quantity: number;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  shipping?: {
    recipient?: string;
    address: string;
    city?: string;
    phone: string;
  };
  createdAt: any;
}

export const Profile = () => {
  const { user, isAdmin } = useAuth();
  const { products } = useProducts();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    recipient: "",
    address: "",
    city: "",
    phone: ""
  });
  
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProfileAndOrders = async () => {
      try {
        // Fetch User Profile
        const userDoc = await getDocs(query(collection(db, "users"), where("__name__", "==", user.uid)));
        if (!userDoc.empty) {
            const data = userDoc.docs[0].data();
            if (data.defaultShipping) {
              setShippingDetails(data.defaultShipping);
            }
        }
        
        // Fetch Orders
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const userOrders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];
        setOrders(userOrders);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, "orders or users");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndOrders();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setProfileSaving(true);
    try {
      const { doc, updateDoc } = await import("firebase/firestore");
      await updateDoc(doc(db, "users", user.uid), {
        defaultShipping: shippingDetails
      });
      setIsEditingProfile(false);
      toast.success("Profile saved successfully");
    } catch (err) {
      toast.error("Failed to save profile");
      handleFirestoreError(err, OperationType.UPDATE, "users");
    } finally {
      setProfileSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen py-24 px-6 md:px-12 flex items-center justify-center bg-[#f0ede8]">
        <div className="text-center">
          <h2 className="text-3xl font-serif mb-4">Please log in</h2>
          <p className="text-muted-foreground">You need to log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-32 px-6 md:px-12 bg-[#f0ede8]">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-4">
          <h1 className="text-4xl font-serif">My Account</h1>
          {isAdmin && (
            <Link to="/admin">
              <Badge variant="outline" className="px-4 py-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer text-sm font-medium">
                Admin Dashboard
              </Badge>
            </Link>
          )}
        </div>
        
        <div className="mb-16">
          <div className="flex items-center justify-between border-b border-border mb-6 pb-4">
            <h2 className="text-2xl font-serif">Personal Details</h2>
            <Button variant="ghost" size="sm" onClick={() => setIsEditingProfile(!isEditingProfile)}>
              {isEditingProfile ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-8 rounded-2xl shadow-sm mb-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Name</p>
              <p className="font-medium">{user.displayName || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>

          {isEditingProfile ? (
            <div className="bg-white p-8 rounded-2xl shadow-sm space-y-4">
              <h3 className="font-serif text-lg mb-4">Default Shipping Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Recipient Name</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-border p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    placeholder="Recipient Name"
                    value={shippingDetails.recipient}
                    onChange={e => setShippingDetails(prev => ({ ...prev, recipient: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Address</label>
                  <textarea
                    className="w-full rounded-lg border border-border p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none min-h-[80px]"
                    placeholder="House No, Street Name, Area..."
                    value={shippingDetails.address}
                    onChange={e => setShippingDetails(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">City</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-border p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      placeholder="City Name"
                      value={shippingDetails.city}
                      onChange={e => setShippingDetails(prev => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full rounded-lg border border-border p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      placeholder="+234..."
                      value={shippingDetails.phone}
                      onChange={e => setShippingDetails(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <Button onClick={handleSaveProfile} disabled={profileSaving}>
                  {profileSaving ? "Saving..." : "Save Details"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="font-serif text-lg mb-4">Default Shipping Information</h3>
              {shippingDetails.address ? (
                <div className="text-sm text-muted-foreground space-y-1">
                  {shippingDetails.recipient && <p className="text-foreground font-medium">{shippingDetails.recipient}</p>}
                  <p>{shippingDetails.address}</p>
                  {shippingDetails.city && <p>{shippingDetails.city}</p>}
                  <p>Phone: {shippingDetails.phone}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No default shipping details set.</p>
              )}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-serif mb-6 border-b border-border pb-4">Order History</h2>
          
          {loading ? (
            <div className="text-center text-muted-foreground py-12 animate-pulse">
              Loading your orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl shadow-sm text-center">
              <PackageOpen className="w-12 h-12 mx-auto text-muted-foreground opacity-30 mb-4" />
              <h3 className="text-xl font-medium mb-2">No orders yet</h3>
              <p className="text-muted-foreground">When you make a purchase, it will appear here.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Order ID: {order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.createdAt?.toDate ? new Date(order.createdAt.toDate()).toLocaleDateString() : 'Just now'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-medium text-lg">₦{order.total.toLocaleString()}</p>
                      <Badge variant="outline" className={`px-3 py-1 ${order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-primary/5'}`}>
                        {order.status === 'pending' && <Clock className="w-3 h-3 inline mr-1" />}
                        {order.status === 'delivered' && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                        <span className="capitalize">{order.status}</span>
                      </Badge>
                    </div>
                  </div>
                  
                  {order.shipping && (
                    <div className="text-sm bg-muted/20 p-4 rounded-xl">
                      <p className="font-medium mb-1">Shipping Information:</p>
                      {order.shipping.recipient && <p className="text-muted-foreground font-medium">{order.shipping.recipient}</p>}
                      <p className="text-muted-foreground">
                        {order.shipping.address}{order.shipping.city && `, ${order.shipping.city}`}
                      </p>
                      <p className="text-muted-foreground">Phone: {order.shipping.phone}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {order.items.map((item, idx) => {
                      const product = products.find(p => p.id === item.productId);
                      if (!product) return null;
                      return (
                        <div key={idx} className="flex gap-4">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-20 h-24 object-cover rounded-md"
                          />
                          <div className="flex flex-col justify-center">
                            <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            <p className="text-sm font-medium mt-1">₦{(product.price * item.quantity).toLocaleString()}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
