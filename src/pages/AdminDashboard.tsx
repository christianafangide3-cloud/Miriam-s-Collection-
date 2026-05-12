import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, setDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Upload, Trash2, Image as ImageIcon, Loader2, Package, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { Badge } from '@/components/ui/badge';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard');
  
  // Product Form
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Clothes');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stats
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const adminDoc = await getDocs(collection(db, 'admins'));
        const adminIds = adminDoc.docs.map(d => d.id);
        if (adminIds.includes(user.uid) || adminDoc.empty) { // If no admins exist, we let them create for demo/first setup. Realistically, we'd have a server or manual step.
          setIsAdmin(true);
          // If they're the first user and no admins, make them admin
          if (adminDoc.empty) {
            await setDoc(doc(db, 'admins', user.uid), {
              email: user.email,
              createdAt: serverTimestamp()
            });
          }
          fetchProducts();
          fetchOrders();
        }
      } catch (err) {
        console.error("Not an admin or error checking admin status.", err);
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminAndFetch();
  }, [user]);

  const fetchProducts = async () => {
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'products');
    }
  };

  const fetchOrders = async () => {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      setOrders(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'orders');
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
      fetchOrders();
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'orders');
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !imageFile) return;

    setIsSubmitting(true);
    
    try {
      // 1. Upload Image
      const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        }, 
        (error) => {
          console.error("Upload error", error);
          setIsSubmitting(false);
        }, 
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // 2. Add Product Document
          try {
            const productData = {
              name,
              category,
              price: Number(price),
              description,
              image: downloadURL,
              isSustainable: false,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            };
            
            const newDocRef = await addDoc(collection(db, 'products'), productData);
            
            // Reset form
            setName('');
            setPrice('');
            setDescription('');
            setImageFile(null);
            setUploadProgress(0);
            
            fetchProducts();
          } catch (dbError) {
             handleFirestoreError(dbError, OperationType.CREATE, 'products');
          } finally {
            setIsSubmitting(false);
          }
        }
      );
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-20 text-center">Loading Admin...</div>;

  if (!user || !isAdmin) {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center">
        <h2 className="text-2xl font-serif mb-4">Admin Access Required</h2>
        <p className="text-muted-foreground mb-8">You need to be logged in as an administrator to view this page.</p>
        {!user && <Button onClick={() => window.location.href = '/'}>Go back Home</Button>}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-serif">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your products and orders</p>
        </div>
        <div className="flex bg-muted/50 p-1 rounded-lg">
          <button 
            className={`px-6 py-2 border-none rounded-md text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-white shadow-sm text-black' : 'text-muted-foreground hover:text-black'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`px-6 py-2 border-none rounded-md text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-white shadow-sm text-black' : 'text-muted-foreground hover:text-black'}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button 
            className={`px-6 py-2 border-none rounded-md text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-white shadow-sm text-black' : 'text-muted-foreground hover:text-black'}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-2">Total Revenue</h3>
              <p className="text-4xl font-serif">₦{totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-2">Total Orders</h3>
              <p className="text-4xl font-serif">{orders.length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-2">Pending Orders</h3>
              <p className="text-4xl font-serif text-yellow-600">{pendingOrders}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-serif text-2xl">Recent Orders</h3>
               <Button variant="outline" size="sm" onClick={() => setActiveTab('orders')}>View All</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Order ID</th>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Date</th>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Amount</th>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.slice(0, 5).map(order => (
                    <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{order.id}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                         {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Just now'}
                      </td>
                      <td className="px-6 py-4 font-medium">₦{order.total?.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`
                          ${order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                          ${order.status === 'shipped' || order.status === 'processing' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                          ${order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                        `}>
                          {order.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                        No orders yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Add Product Form */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border shadow-sm h-fit">
            <h2 className="text-xl font-medium mb-6">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <input 
                  type="text" required
                  className="w-full rounded-md border border-input px-3 py-2 text-sm"
                  value={name} onChange={e => setName(e.target.value)} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select 
                    className="w-full rounded-md border border-input px-3 py-2 text-sm bg-white"
                    value={category} onChange={e => setCategory(e.target.value)}
                  >
                    <option value="Clothes">Clothes</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Bags">Bags</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₦)</label>
                  <input 
                    type="number" required min="1"
                    className="w-full rounded-md border border-input px-3 py-2 text-sm"
                    value={price} onChange={e => setPrice(e.target.value)} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  className="w-full rounded-md border border-input px-3 py-2 text-sm min-h-[80px]"
                  value={description} onChange={e => setDescription(e.target.value)} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Main Image</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-input rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {imageFile ? (
                      <p className="text-sm font-medium text-primary text-center px-4">{imageFile.name}</p>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload photo</p>
                      </>
                    )}
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageFileChange} />
                </label>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting || !imageFile}>
                {isSubmitting ? (
                   <span className="flex items-center gap-2">
                     <Loader2 className="w-4 h-4 animate-spin" /> 
                     {uploadProgress > 0 ? `Uploading... ${Math.round(uploadProgress)}%` : 'Saving...'}
                   </span>
                ) : (
                  <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> Add Product</span>
                )}
              </Button>
            </form>
          </div>

          {/* Existing Products List */}
          <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium">Live Products ({products.length})</h2>
                {products.length === 0 && (
                  <Button variant="outline" onClick={async () => {
                    if (!confirm('Seed sample data?')) return;
                    const SAMPLE_PRODUCTS = [
                      {
                        name: "Organic Cotton Trench",
                        category: "Clothes",
                        price: 28500,
                        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop",
                        description: "Ethically sourced organic cotton, dyed with natural pigments."
                      },
                      {
                        name: "Vegan Leather Tote",
                        category: "Bags",
                        price: 19500,
                        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop",
                        description: "Crafted from recycled pineapple leaf fibers."
                      },
                      {
                        name: "Recycled Wool Knit",
                        category: "Clothes",
                        price: 14500,
                        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop",
                        description: "Soft, warm, and 100% recycled wool from post-consumer waste."
                      },
                      {
                        name: "Hemp Canvas Sneakers",
                        category: "Shoes",
                        price: 12000,
                        image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop",
                        description: "Durable hemp upper with natural rubber soles."
                      }
                    ];
                    for (const p of SAMPLE_PRODUCTS) {
                      await addDoc(collection(db, 'products'), {
                        ...p,
                        isSustainable: true,
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp()
                      });
                    }
                    fetchProducts();
                  }}>
                    Seed Samples
                  </Button>
                )}
              </div>
             {products.length === 0 ? (
               <div className="border border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center text-muted-foreground">
                 <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
                 <p>No products added directly yet.</p>
                 <p className="text-sm">Storefront currently displays placeholder data.</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {products.map(product => (
                   <div key={product.id} className="flex gap-4 border rounded-xl p-4 bg-white shadow-sm items-center">
                     <img src={product.image} alt={product.name} className="w-20 h-20 rounded-lg object-cover bg-muted" />
                     <div className="flex-1 min-w-0">
                       <h3 className="font-medium text-sm truncate">{product.name}</h3>
                       <p className="text-muted-foreground text-xs">{product.category} • ₦{product.price}</p>
                     </div>
                     <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10"
                       onClick={async () => {
                         if (confirm('Delete this product?')) {
                           await deleteDoc(doc(db, 'products', product.id));
                           fetchProducts();
                         }
                       }}
                     >
                       <Trash2 className="w-4 h-4" />
                     </Button>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>
      )}
      
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground">
              <Package className="w-12 h-12 mb-4 opacity-20" />
              <p>No orders yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4 font-medium">Order ID</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Items</th>
                    <th className="px-6 py-4 font-medium">Total</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map(order => (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-muted/30 cursor-pointer" onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}>
                        <td className="px-6 py-4 font-mono text-xs">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order.createdAt?.toDate ? new Date(order.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          {order.items?.length || 0} items
                        </td>
                        <td className="px-6 py-4 font-medium">
                          ₦{order.total?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={`
                            ${order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                            ${order.status === 'shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                            ${order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                          `}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <select 
                            className="border border-input rounded-md px-2 py-1 bg-transparent text-sm"
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                      {expandedOrderId === order.id && (
                        <tr className="bg-muted/10">
                          <td colSpan={6} className="px-6 py-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div>
                                <h4 className="font-semibold text-xs uppercase tracking-widest mb-4">Shipping Info</h4>
                                {order.shipping ? (
                                  <div className="space-y-2 text-sm text-muted-foreground">
                                    {order.shipping.recipient && <p><span className="text-foreground font-medium">Recipient:</span> {order.shipping.recipient}</p>}
                                    <p><span className="text-foreground font-medium">Address:</span> {order.shipping.address}</p>
                                    {order.shipping.city && <p><span className="text-foreground font-medium">City:</span> {order.shipping.city}</p>}
                                    <p><span className="text-foreground font-medium">Phone:</span> {order.shipping.phone}</p>
                                    <p><span className="text-foreground font-medium">User ID:</span> {order.userId}</p>
                                  </div>
                                ) : (
                                  <p className="text-sm text-muted-foreground italic">No shipping info provided.</p>
                                )}
                              </div>
                              <div>
                                <h4 className="font-semibold text-xs uppercase tracking-widest mb-4">Items</h4>
                                <div className="space-y-3">
                                  {order.items?.map((item: any, idx: number) => {
                                    const product = products.find(p => p.id === item.productId);
                                    return (
                                      <div key={idx} className="flex justify-between text-sm border-b border-border/50 pb-2 last:border-0">
                                        <span>{product?.name || item.productId} x {item.quantity}</span>
                                        <span>₦{((product?.price || 0) * item.quantity).toLocaleString()}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
