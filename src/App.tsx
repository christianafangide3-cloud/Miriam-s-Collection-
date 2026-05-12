import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useParams, 
  useNavigate,
  useLocation
} from "react-router-dom";
import { AdminDashboard } from "./pages/AdminDashboard";
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Leaf, 
  ShieldCheck, 
  Truck, 
  Instagram, 
  Facebook, 
  Twitter,
  ArrowRight,
  ChevronRight,
  Search,
  User,
  Heart,
  ArrowLeft,
  Star,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "./contexts/AuthContext";
import { useWishlist } from "./hooks/useWishlist";
import { useCart } from "./contexts/CartContext";
import { useProducts, Product } from "./contexts/ProductsContext";
import { db } from "./lib/firebase";
import { addDoc, collection, serverTimestamp, query, getDocs, orderBy, doc } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "./lib/firestore-errors";

const CATEGORIES = ["All", "Clothes", "Shoes", "Bags"];

// --- Components ---

import { Profile } from "./pages/Profile";
import { WishlistPage } from "./pages/Wishlist";
import { Discover } from "./pages/Discover";
import { Sustainability } from "./pages/Sustainability";
import { Story } from "./pages/Story";
import { Contact } from "./pages/Contact";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { ShippingReturns } from "./pages/ShippingReturns";
import { FAQ } from "./pages/FAQ";
import { Checkout } from "./pages/Checkout";
import { OrderSuccess } from "./pages/OrderSuccess";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, isAdmin, loginWithGoogle, logout } = useAuth();
  const { cartItemCount, cart, removeFromCart, updateQuantity } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-12 py-4 flex items-center justify-between ${
        isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="flex items-center gap-8">
        <Sheet>
          <SheetTrigger 
            render={
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-6 h-6" />
              </Button>
            }
          />
          <SheetContent side="left" className="bg-background">
            <div className="flex flex-col gap-6 mt-12">
              {CATEGORIES.map((cat) => (
                <Link key={cat} to="/" className="text-2xl font-serif hover:text-primary transition-colors">
                  {cat}
                </Link>
              ))}
              <Separator />
              <Link to="/sustainability" className="text-xl font-serif hover:text-primary transition-colors">Sustainability</Link>
              <Link to="/story" className="text-xl font-serif hover:text-primary transition-colors">Our Story</Link>
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden md:flex items-center gap-6 text-sm uppercase tracking-widest font-medium">
          <Link to="/" className="hover:text-primary transition-colors">Shop</Link>
          <Link to="/discover" className="hover:text-primary transition-colors flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Discover
          </Link>
          <Link to="/sustainability" className="hover:text-primary transition-colors">Sustainability</Link>
          <Link to="/story" className="hover:text-primary transition-colors">Story</Link>
        </div>
      </div>

      <Link to="/" className="absolute left-1/2 -translate-x-1/2 text-2xl md:text-3xl font-serif tracking-tighter italic whitespace-nowrap">
        MIRIAM'S COLLECTIONS
      </Link>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="hidden sm:flex" onClick={() => {
          document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
        }}>
          <Search className="w-5 h-5" />
        </Button>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger 
              render={
                <Button variant="ghost" size="icon" className="rounded-full overflow-hidden border border-border">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-48 bg-background border-border">
              <DropdownMenuLabel className="font-serif">{user.displayName || "My Account"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/profile">Profile & Orders</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/wishlist">Wishlist</Link>
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/admin">Admin Dashboard</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:bg-destructive/10">Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" className="hidden sm:flex" onClick={loginWithGoogle}>
            <User className="w-4 h-4 mr-2" />
            Sign In with Google
          </Button>
        )}
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="relative cursor-pointer" />}>
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </SheetTrigger>
          <SheetContent side="right" className="bg-background w-[400px] sm:w-[540px]">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif">
                  Shopping Cart ({cartItemCount})
                </h2>
              </div>
              
              <ScrollArea className="flex-1 pr-4 -mr-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                    <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                    <p>Your cart is empty.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.map(item => {
                      const product = products.find(p => p.id === item.productId);
                      if (!product) return null;
                      return (
                        <div key={item.productId} className="flex gap-4 border-b border-border pb-4">
                          <img src={product.image} alt={product.name} className="w-20 h-24 object-cover rounded-md" referrerPolicy="no-referrer" />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="font-serif text-lg leading-tight mb-1">{product.name}</h4>
                              <p className="text-sm text-muted-foreground">₦{product.price.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-2 border border-border rounded-full px-2 py-1">
                                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}>-</Button>
                                <span className="text-sm w-4 text-center">{item.quantity}</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</Button>
                              </div>
                              <Button variant="ghost" className="text-xs text-destructive h-auto p-0 hover:bg-transparent hover:underline" onClick={() => removeFromCart(item.productId)}>Remove</Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
              
              {cart.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border">
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-serif text-xl">Total</span>
                    <span className="font-medium text-xl">
                      ₦{cart.reduce((total, item) => {
                        const product = products.find(p => p.id === item.productId);
                        return total + (product ? product.price * item.quantity : 0);
                      }, 0).toLocaleString()}
                    </span>
                  </div>
                  <Button 
                    className="w-full rounded-full py-6 text-lg" 
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate("/checkout");
                    }}
                  >
                    Checkout
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "linear" }}
        className="absolute inset-0"
      >
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop" 
          alt="Sustainable Fashion"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>

      <div className="relative h-full flex flex-col items-center justify-center text-center px-6 text-white">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xs md:text-sm uppercase tracking-[0.4em] mb-4"
        >
          Conscious Luxury
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-5xl md:text-8xl font-serif mb-8 max-w-4xl leading-[0.9]"
        >
          Elegance That <br /> <span className="italic">Endures</span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <a href="#shop" className="inline-flex items-center justify-center rounded-full px-8 py-6 text-lg font-medium bg-white text-black hover:bg-white/90 border-none transition-colors">
            Explore Collection <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60">
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <div className="w-px h-12 bg-white/30 relative overflow-hidden">
          <motion.div 
            animate={{ y: [0, 48] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-1/2 bg-white"
          />
        </div>
      </div>
    </section>
  );
};

const FeaturedCategories = () => {
  const categories = [
    { name: "Apparel", image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop" },
    { name: "Footwear", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop" },
    { name: "Accessories", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop" }
  ];

  return (
    <section className="py-24 px-6 md:px-12 bg-background">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat, idx) => (
          <motion.div 
            key={cat.name}
            whileHover={{ y: -10 }}
            className="group relative aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer"
          >
            <img 
              src={cat.image} 
              alt={cat.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="text-3xl font-serif mb-2">{cat.name}</h3>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                View All <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const ProductRating = ({ productId }: { productId: string }) => {
  const [rating, setRating] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const q = query(collection(db, `products/${productId}/reviews`));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const total = snapshot.docs.reduce((acc, doc) => acc + (doc.data().rating || 0), 0);
          setRating(total / snapshot.docs.length);
          setCount(snapshot.docs.length);
        }
      } catch (err) {
        console.error("Error fetching rating", err);
      }
    };
    fetchRating();
  }, [productId]);

  if (count === 0) return null;

  return (
    <div className="flex items-center gap-1 mt-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star 
            key={s} 
            className={`w-3 h-3 ${rating >= s ? 'fill-primary text-primary' : rating >= s - 0.5 ? 'fill-primary/50 text-primary' : 'text-muted-foreground/30'}`} 
          />
        ))}
      </div>
      <span className="text-[10px] text-muted-foreground">({count})</span>
    </div>
  );
};

const ProductGrid = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get('category');

  const [activeTab, setActiveTab] = useState(categoryParam || "All");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const { wishlistProductIds, toggleWishlist } = useWishlist();
  const { loginWithGoogle, user } = useAuth();
  const { addToCart } = useCart();
  const { products, loading } = useProducts();

  useEffect(() => {
    if (categoryParam) {
      setActiveTab(categoryParam);
      // scroll to product grid
      document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [categoryParam]);

  const filteredProducts = useMemo(() => {
    let result = activeTab === "All" 
      ? [...products] 
      : products.filter(p => p.category === activeTab);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    if (sortBy === "name-az") result.sort((a, b) => a.name.localeCompare(b.name));
    
    return result;
  }, [activeTab, sortBy, products, searchQuery]);

  if (loading) {
    return (
      <section id="shop" className="py-24 px-6 md:px-12 bg-[#f0ede8] min-h-[500px] flex items-center justify-center">
        <div className="text-xl font-serif animate-pulse text-muted-foreground">Loading collection...</div>
      </section>
    );
  }

  return (
    <section id="shop" className="py-24 px-6 md:px-12 bg-[#f0ede8]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-2 block">Our Curation</span>
          <h2 className="text-4xl md:text-5xl font-serif">The Sustainable Edit</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 overflow-hidden">
          <div className="flex items-center border border-border/50 rounded-full px-3 py-2 bg-white shadow-sm w-full sm:w-auto">
            <Search className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none focus:outline-none text-sm w-full sm:w-[150px] md:w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-2 no-scrollbar pl-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`text-sm uppercase tracking-widest font-medium transition-all relative pb-1 whitespace-nowrap ${
                  activeTab === cat ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
                {activeTab === cat && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-px bg-primary"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 min-w-[180px] shrink-0">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground whitespace-nowrap">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-8 border-none bg-transparent focus:ring-0 text-xs uppercase tracking-widest font-medium p-0 gap-1">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="bg-background border-muted">
                <SelectItem value="featured" className="text-xs uppercase tracking-widest">Featured</SelectItem>
                <SelectItem value="price-low" className="text-xs uppercase tracking-widest">Price: Low to High</SelectItem>
                <SelectItem value="price-high" className="text-xs uppercase tracking-widest">Price: High to Low</SelectItem>
                <SelectItem value="name-az" className="text-xs uppercase tracking-widest">Name: A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="group"
            >
              <Link to={`/product/${product.id}`}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl mb-6 bg-muted">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {product.isSustainable && (
                    <Badge className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm text-primary hover:bg-white/90 border-none px-3 py-1">
                      <Leaf className="w-3 h-3 mr-1" /> Sustainable
                    </Badge>
                  )}
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="absolute top-4 right-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => { 
                      e.preventDefault(); 
                      e.stopPropagation(); 
                      if (!user) {
                        loginWithGoogle();
                      } else {
                        toggleWishlist(product.id);
                      }
                    }}
                  >
                    <Heart className={`w-4 h-4 ${wishlistProductIds.includes(product.id) ? "fill-primary text-primary" : ""}`} />
                  </Button>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <Button 
                      className="w-full rounded-full bg-white text-black hover:bg-white/90 border-none shadow-lg" 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        e.stopPropagation(); 
                        addToCart(product.id, 1);
                      }}
                    >
                      Quick Add
                    </Button>
                  </div>
                </div>
              </Link>
              <div className="flex justify-between items-start">
                <div>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-xl font-serif mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
                  </Link>
                  <ProductRating productId={product.id} />
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{product.description}</p>
                </div>
                <span className="font-medium text-lg">₦{product.price.toLocaleString()}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const product = products.find(p => p.id === id);
  const { wishlistProductIds, toggleWishlist } = useWishlist();
  const { user, loginWithGoogle } = useAuth();
  const { addToCart } = useCart();

  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [ratingInput, setRatingInput] = useState<number>(0);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (!product) return;
    const fetchReviews = async () => {
      try {
        const q = query(
          collection(db, `products/${product.id}/reviews`),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [product]);

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error("Please login to submit a review.");
      loginWithGoogle();
      return;
    }
    if (ratingInput < 1 || ratingInput > 5) {
      toast.error("Please select a rating between 1 and 5.");
      return;
    }
    if (!commentInput.trim()) {
      toast.error("Please enter a review comment.");
      return;
    }

    setIsSubmittingReview(true);
    try {
      if (!product) return;
      const reviewData = {
        productId: product.id,
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        rating: ratingInput,
        comment: commentInput.trim(),
        createdAt: serverTimestamp(),
      };
      
      const newRef = await addDoc(collection(db, `products/${product.id}/reviews`), reviewData);
      
      // Optimitistic update
      setReviews(prev => [{ id: newRef.id, ...reviewData, createdAt: { toDate: () => new Date() } }, ...prev]);
      setRatingInput(0);
      setCommentInput("");
      toast.success("Review submitted successfully!");
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `products/${product?.id}/reviews`);
      toast.error("Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 space-y-4">
        <div className="text-xl font-serif animate-pulse">Loading piece...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24">
        <h2 className="text-3xl font-serif mb-4">Product Not Found</h2>
        <Button onClick={() => navigate("/")}>Back to Shop</Button>
      </div>
    );
  }

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const sameCategory = products.filter(p => p.id !== product.id && p.category === product.category);
    const otherCategories = products.filter(p => p.id !== product.id && p.category !== product.category);
    return [...sameCategory, ...otherCategories].slice(0, 4);
  }, [product, products]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background pt-24 pb-12"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <Button 
          variant="ghost" 
          className="mb-8 pl-0 hover:bg-transparent hover:text-primary"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {product.additionalImages && product.additionalImages.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {[product.image, ...product.additionalImages].slice(0, 3).map((img, i) => (
                  <div key={i} className="aspect-square rounded-xl bg-muted overflow-hidden opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square rounded-xl bg-muted overflow-hidden opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                    <img src={product.image} alt="" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none uppercase tracking-widest text-[10px]">
                  {product.category}
                </Badge>
                {product.isSustainable && (
                  <div className="flex items-center text-xs text-primary font-medium">
                    <Leaf className="w-3 h-3 mr-1" /> Sustainable Choice
                  </div>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-serif mb-4">{product.name}</h1>
              <p className="text-2xl font-medium mb-6">₦{product.price}</p>
              <div className="flex items-center gap-1 mb-8 cursor-pointer" onClick={() => document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })}>
                {[1, 2, 3, 4, 5].map((s) => {
                   const avgRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
                   return <Star key={s} className={`w-4 h-4 ${avgRating >= s ? 'fill-primary text-primary' : avgRating >= s - 0.5 ? 'fill-primary/50 text-primary' : 'text-muted-foreground/30'}`} />;
                })}
                <span className="text-xs text-muted-foreground ml-2">({reviews.length} Review{reviews.length !== 1 ? 's' : ''})</span>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {product.longDescription || product.description}
              </p>

              {product.additionalImages && product.additionalImages.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-sm uppercase tracking-widest font-semibold mb-4">Gallery</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {product.additionalImages.map((img, i) => (
                      <div key={i} className="aspect-square rounded-xl bg-muted overflow-hidden">
                        <img 
                          src={img} 
                          alt={`${product.name} detail ${i + 1}`} 
                          className="w-full h-full object-cover transition-transform hover:scale-105" 
                          referrerPolicy="no-referrer" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-8 mb-12">
              <div>
                <h4 className="text-sm uppercase tracking-widest font-semibold mb-4">Details</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
                  {(product.details || ["Ethically made", "Sustainable materials"]).map((detail) => (
                    <li key={detail} className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-primary/60" /> {detail}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm uppercase tracking-widest font-semibold mb-4">Materials</h4>
                <div className="flex flex-wrap gap-2">
                  {(product.materials || ["Organic Cotton"]).map((material) => (
                    <Badge key={material} variant="outline" className="rounded-full px-4 py-1 border-border font-normal">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>

              {product.careInstructions && (
                <div>
                  <h4 className="text-sm uppercase tracking-widest font-semibold mb-4">Care Instructions</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.careInstructions}
                  </p>
                </div>
              )}

              {product.sizingGuide && (
                <div>
                  <h4 className="text-sm uppercase tracking-widest font-semibold mb-4">Sizing Guide</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.sizingGuide}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <Button 
                size="lg" 
                variant="outline"
                className="flex-1 rounded-full py-8 text-lg"
                onClick={() => addToCart(product.id, 1)}
              >
                Add to Bag
              </Button>
              <Button 
                size="lg" 
                className="flex-1 rounded-full py-8 text-lg"
                onClick={() => navigate('/checkout', { state: { buyNowProduct: product.id } })}
              >
                Buy Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full py-8 px-6 text-lg border-primary text-primary hover:bg-primary/5 shrink-0"
                onClick={() => {
                  if (!user) {
                    loginWithGoogle();
                  } else {
                    toggleWishlist(product.id);
                  }
                }}
              >
                <Heart className={`w-5 h-5 ${wishlistProductIds.includes(product.id) ? "fill-primary" : ""}`} /> 
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-muted/50">
                <Truck className="w-5 h-5 mx-auto mb-2 text-primary/60" />
                <span className="text-[10px] uppercase tracking-widest block">Free Shipping</span>
              </div>
              <div className="text-center p-4 rounded-xl bg-muted/50">
                <ShieldCheck className="w-5 h-5 mx-auto mb-2 text-primary/60" />
                <span className="text-[10px] uppercase tracking-widest block">Ethical Sourcing</span>
              </div>
              <div className="text-center p-4 rounded-xl bg-muted/50">
                <Leaf className="w-5 h-5 mx-auto mb-2 text-primary/60" />
                <span className="text-[10px] uppercase tracking-widest block">Eco-Friendly</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Customer Reviews */}
        <section id="reviews-section" className="mt-24 border-t border-border pt-16">
          <h3 className="text-3xl font-serif mb-12">Customer Reviews</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h4 className="text-xl font-medium mb-6">Write a Review</h4>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex gap-1 text-muted-foreground">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-6 h-6 cursor-pointer transition-colors ${ratingInput >= star ? 'fill-primary text-primary' : 'hover:fill-primary/50'}`} 
                        onClick={() => setRatingInput(star)}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Your Review</label>
                  <textarea 
                    className="w-full min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                    placeholder="What did you think about this product?"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                  ></textarea>
                </div>
                <Button 
                  className="rounded-full px-8" 
                  onClick={handleSubmitReview}
                  disabled={isSubmittingReview}
                >
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-medium mb-6">Reviews ({reviews.length})</h4>
              {reviewsLoading ? (
                <div className="bg-muted/30 rounded-xl p-8 text-center animate-pulse">
                  <p className="text-muted-foreground">Loading reviews...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="bg-muted/30 rounded-xl p-8 text-center">
                  <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                  <p className="text-muted-foreground">
                    No reviews yet. Be the first to review this product!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-border pb-6 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{review.userName || 'Anonymous'}</span>
                        <span className="text-xs text-muted-foreground">
                          {review.createdAt?.toDate ? new Date(review.createdAt.toDate()).toLocaleDateString() : 'Just now'}
                        </span>
                      </div>
                      <div className="flex gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="mt-32">
          <h3 className="text-3xl font-serif mb-12">Related Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="group">
                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-muted mb-4">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" referrerPolicy="no-referrer" />
                </div>
                <h4 className="font-serif text-lg group-hover:text-primary transition-colors">{p.name}</h4>
                <p className="text-sm font-medium">₦{p.price}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

const SustainabilitySection = () => {
  return (
    <section id="sustainability" className="py-24 px-6 md:px-12 bg-primary text-primary-foreground overflow-hidden relative">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-xs uppercase tracking-[0.4em] mb-4 block opacity-70">Our Commitment</span>
          <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">
            Fashion That <br /> <span className="italic">Respects the Earth</span>
          </h2>
          <p className="text-lg opacity-80 mb-12 max-w-lg leading-relaxed">
            We believe that luxury shouldn't come at the cost of our planet. Every piece in our collection is vetted for ethical production, fair wages, and sustainable materials.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-xl mb-2">Eco Materials</h4>
                <p className="text-sm opacity-70">Organic, recycled, and regenerative fibers only.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-xl mb-2">Ethical Labor</h4>
                <p className="text-sm opacity-70">Certified fair trade and safe working conditions.</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative aspect-square"
        >
          <div className="absolute inset-0 border border-white/20 rounded-full animate-spin-slow" />
          <img 
            src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop" 
            alt="Sustainability"
            className="w-full h-full object-cover rounded-full p-8"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-background pt-24 pb-12 px-6 md:px-12 border-t">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
        <div className="lg:col-span-1">
          <Link to="/" className="text-3xl font-serif tracking-tighter italic mb-6 block">
            MIRIAM'S COLLECTIONS
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            Curating the finest sustainable fashion for the conscious individual. Ethical production, timeless design.
          </p>
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" className="rounded-full border">
              <Instagram className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full border">
              <Facebook className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full border">
              <Twitter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div>
          <h4 className="font-serif text-xl mb-6">Shop</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li><Link to="/discover" className="hover:text-primary transition-colors flex items-center gap-2">Discover <Sparkles className="w-3 h-3 text-primary" /></Link></li>
            <li><Link to="/" className="hover:text-primary transition-colors">New Arrivals</Link></li>
            <li><Link to="/?category=Clothes" className="hover:text-primary transition-colors">Clothes</Link></li>
            <li><Link to="/?category=Shoes" className="hover:text-primary transition-colors">Shoes</Link></li>
            <li><Link to="/?category=Bags" className="hover:text-primary transition-colors">Bags</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-xl mb-6">Information</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li><Link to="/story" className="hover:text-primary transition-colors">Our Story</Link></li>
            <li><Link to="/sustainability" className="hover:text-primary transition-colors">Sustainability</Link></li>
            <li><Link to="/shipping-returns" className="hover:text-primary transition-colors">Shipping & Returns</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-xl mb-6">Newsletter</h4>
          <p className="text-sm text-muted-foreground mb-6">
            Join our community for exclusive updates on conscious living.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input 
              type="email" 
              placeholder={subscribed ? "Success!" : "Your email"}
              className="bg-muted border-none rounded-full px-4 py-2 text-sm w-full focus:ring-1 focus:ring-primary outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={subscribed}
            />
            <Button className="rounded-full px-6" disabled={subscribed}>
              {subscribed ? "Joined" : "Join"}
            </Button>
          </form>
        </div>
      </div>

      <Separator className="mb-8" />
      
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-muted-foreground">
        <p>© 2026 MIRIAM'S COLLECTIONS. All rights reserved.</p>
        <div className="flex gap-8">
          <div className="flex items-center gap-2"><Truck className="w-3 h-3" /> Global Shipping</div>
          <div className="flex items-center gap-2"><ShieldCheck className="w-3 h-3" /> Secure Payment</div>
        </div>
      </div>
    </footer>
  );
};

const HomePage = () => {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <ProductGrid />
      <SustainabilitySection />
      
      {/* About Section */}
      <section id="about" className="py-24 px-6 md:px-12 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs uppercase tracking-[0.4em] text-primary font-semibold mb-6 block">Our Story</span>
          <h2 className="text-4xl md:text-6xl font-serif mb-8 italic">"Style is a way to say who you are without having to speak."</h2>
          <p className="text-xl text-muted-foreground leading-relaxed mb-12">
            MIRIAM'S COLLECTIONS was born from a simple realization: the fashion industry needed a soul. We set out to bridge the gap between high-end luxury and radical transparency. Every artisan we partner with, every farm we source from, and every thread we use is chosen with intention.
          </p>
          <Button variant="outline" className="rounded-full px-8 py-6 border-primary text-primary hover:bg-primary hover:text-white">
            Read Our Full Manifesto
          </Button>
        </div>
      </section>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen selection:bg-primary selection:text-primary-foreground">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/sustainability" element={<Sustainability />} />
            <Route path="/story" element={<Story />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/shipping-returns" element={<ShippingReturns />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster />
    </Router>
  );
}
