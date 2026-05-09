import { useState, useEffect, useMemo } from "react";
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
  CheckCircle2
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

// --- Types ---
interface Product {
  id: number;
  name: string;
  category: "Clothes" | "Shoes" | "Bags";
  price: number;
  image: string;
  isSustainable: boolean;
  description: string;
  longDescription?: string;
  details?: string[];
  materials?: string[];
  careInstructions?: string;
  sizingGuide?: string;
}

// --- Mock Data ---
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Organic Cotton Trench",
    category: "Clothes",
    price: 285,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop",
    isSustainable: true,
    description: "Ethically sourced organic cotton, dyed with natural pigments.",
    longDescription: "A timeless silhouette reimagined for the conscious era. This trench coat is crafted from GOTS-certified organic cotton, grown without harmful pesticides and dyed using circular water systems. Its durable weave ensures it will be a staple in your wardrobe for decades.",
    details: ["Relaxed fit", "Double-breasted closure", "Adjustable waist belt", "Water-resistant finish"],
    materials: ["100% GOTS Organic Cotton", "Recycled Polyester lining", "Corozo nut buttons"],
    careInstructions: "Machine wash cold on gentle cycle. Do not bleach. Hang dry in shade. Cool iron if necessary.",
    sizingGuide: "Fits true to size. Designed for a relaxed fit. Take your normal size."
  },
  {
    id: 2,
    name: "Vegan Leather Tote",
    category: "Bags",
    price: 195,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop",
    isSustainable: true,
    description: "Crafted from recycled pineapple leaf fibers.",
    longDescription: "Innovation meets luxury. This tote is made from Piñatex, a natural leather alternative made from pineapple leaf fibers—a byproduct of existing agriculture. It's lightweight, durable, and completely biodegradable at the end of its long life.",
    details: ["Spacious interior", "Internal zip pocket", "Reinforced handles", "Magnetic closure"],
    materials: ["Piñatex (Pineapple leaf fiber)", "Organic cotton canvas lining"],
    careInstructions: "Wipe clean with a damp cloth. Do not machine wash or tumble dry. Condition the Piñatex occasionally with natural wax.",
    sizingGuide: "One size fits all. Dimensions: 15\" W x 12\" H x 6\" D."
  },
  {
    id: 3,
    name: "Recycled Wool Knit",
    category: "Clothes",
    price: 145,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop",
    isSustainable: true,
    description: "Soft, warm, and 100% recycled wool from post-consumer waste.",
    longDescription: "Warmth without the footprint. Our recycled wool sweater is made from pre-loved garments that have been sorted by color, shredded, and spun into new yarn. This process eliminates the need for new dyes and significantly reduces water and energy consumption.",
    details: ["Classic crew neck", "Ribbed cuffs and hem", "Mid-weight knit", "Naturally odor-resistant"],
    materials: ["100% Recycled Wool"],
    careInstructions: "Hand wash in cold water with wool detergent. Dry flat. Do not wring or hang to dry.",
    sizingGuide: "Regular fit. For a looser fit, we recommend sizing up."
  },
  {
    id: 4,
    name: "Hemp Canvas Sneakers",
    category: "Shoes",
    price: 120,
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop",
    isSustainable: true,
    description: "Durable hemp upper with natural rubber soles.",
    longDescription: "The ultimate everyday sneaker, built to last. Hemp is one of the most sustainable fibers on earth, requiring minimal water and no pesticides. Paired with a natural rubber sole, these sneakers are as kind to your feet as they are to the planet.",
    details: ["Breathable hemp upper", "Natural rubber outsole", "Cork insole", "Recycled cotton laces"],
    materials: ["Hemp Canvas", "Natural Rubber", "Cork"],
    careInstructions: "Spot clean with a damp cloth and mild soap. Allow to air dry completely before wearing.",
    sizingGuide: "True to size. If you are between sizes, we recommend sizing down."
  },
  {
    id: 5,
    name: "Linen Summer Dress",
    category: "Clothes",
    price: 175,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop",
    isSustainable: true,
    description: "Breathable European linen, handmade in small batches.",
    longDescription: "Effortless elegance for warmer days. This dress is made from premium European flax, a carbon-negative crop. Each piece is handmade in a small atelier that prioritizes artisan well-being and zero-waste cutting techniques.",
    details: ["A-line silhouette", "Side seam pockets", "Adjustable straps", "Pre-washed for softness"],
    materials: ["100% European Flax Linen"],
    careInstructions: "Machine wash on delicate cycle. Line dry or tumble dry low. Iron on reverse side while slightly damp.",
    sizingGuide: "Relaxed fit. Straps are adjustable to accommodate different torso lengths."
  },
  {
    id: 6,
    name: "Cork Leather Belt Bag",
    category: "Bags",
    price: 110,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
    isSustainable: true,
    description: "Water-resistant cork leather, harvested without harming trees.",
    longDescription: "Functional, modern, and regenerative. Cork is harvested by stripping the bark from cork oak trees, which then regenerates, absorbing more CO2 in the process. This belt bag is water-resistant, ultra-light, and perfect for hands-free exploration.",
    details: ["Adjustable strap", "Front zip pocket", "Hidden back pocket", "Lightweight design"],
    materials: ["Natural Cork Leather", "Recycled metal hardware"],
    careInstructions: "Wipe with a soft, damp cloth and mild soap. Allow to dry naturally.",
    sizingGuide: "Strap adjusts from 30\" to 45\" to be worn around the waist or across the body."
  }
];

const CATEGORIES = ["All", "Clothes", "Shoes", "Bags"];

// --- Components ---

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, loginWithGoogle, logout } = useAuth();
  const { cartItemCount, cart, removeFromCart, updateQuantity } = useCart();

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
              <a href="#sustainability" className="text-xl font-serif hover:text-primary transition-colors">Sustainability</a>
              <a href="#about" className="text-xl font-serif hover:text-primary transition-colors">Our Story</a>
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden md:flex items-center gap-6 text-sm uppercase tracking-widest font-medium">
          <Link to="/" className="hover:text-primary transition-colors">Shop</Link>
          <a href="#sustainability" className="hover:text-primary transition-colors">Sustainability</a>
          <a href="#about" className="hover:text-primary transition-colors">Story</a>
        </div>
      </div>

      <Link to="/" className="absolute left-1/2 -translate-x-1/2 text-2xl md:text-3xl font-serif tracking-tighter italic whitespace-nowrap">
        MIRIAM'S COLLECTIONS
      </Link>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="hidden sm:flex">
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
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:bg-destructive/10">Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" className="hidden sm:flex" onClick={loginWithGoogle}>
            <User className="w-4 h-4 mr-2" />
            Sign In with Google
          </Button>
        )}
        <Sheet>
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
              <h2 className="text-2xl font-serif mb-6">Shopping Cart ({cartItemCount})</h2>
              
              <ScrollArea className="flex-1 pr-4 -mr-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                    <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                    <p>Your cart is empty.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.map(item => {
                      const product = PRODUCTS.find(p => p.id === item.productId);
                      if (!product) return null;
                      return (
                        <div key={item.productId} className="flex gap-4 border-b border-border pb-4">
                          <img src={product.image} alt={product.name} className="w-20 h-24 object-cover rounded-md" referrerPolicy="no-referrer" />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="font-serif text-lg leading-tight mb-1">{product.name}</h4>
                              <p className="text-sm text-muted-foreground">₦{product.price}</p>
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
                        const product = PRODUCTS.find(p => p.id === item.productId);
                        return total + (product ? product.price * item.quantity : 0);
                      }, 0)}
                    </span>
                  </div>
                  <Button className="w-full rounded-full py-6 text-lg">Checkout</Button>
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

const ProductGrid = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const { wishlistProductIds, toggleWishlist } = useWishlist();
  const { loginWithGoogle, user } = useAuth();
  const { addToCart } = useCart();

  const filteredProducts = useMemo(() => {
    let result = activeTab === "All" 
      ? [...PRODUCTS] 
      : PRODUCTS.filter(p => p.category === activeTab);

    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    if (sortBy === "name-az") result.sort((a, b) => a.name.localeCompare(b.name));
    
    return result;
  }, [activeTab, sortBy]);

  return (
    <section id="shop" className="py-24 px-6 md:px-12 bg-[#f0ede8]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-2 block">Our Curation</span>
          <h2 className="text-4xl md:text-5xl font-serif">The Sustainable Edit</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex gap-6 overflow-x-auto pb-2 no-scrollbar">
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

          <div className="flex items-center gap-2 min-w-[180px]">
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
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <Button 
                      className="w-full rounded-full bg-white text-black hover:bg-white/90 border-none" 
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
                  <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                </div>
                <span className="font-medium text-lg">₦{product.price}</span>
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
  const product = PRODUCTS.find(p => p.id === Number(id));
  const { wishlistProductIds, toggleWishlist } = useWishlist();
  const { user, loginWithGoogle } = useAuth();
  const { addToCart } = useCart();

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24">
        <h2 className="text-3xl font-serif mb-4">Product Not Found</h2>
        <Button onClick={() => navigate("/")}>Back to Shop</Button>
      </div>
    );
  }

  const relatedProducts = useMemo(() => {
    const sameCategory = PRODUCTS.filter(p => p.id !== product.id && p.category === product.category);
    const otherCategories = PRODUCTS.filter(p => p.id !== product.id && p.category !== product.category);
    return [...sameCategory, ...otherCategories].slice(0, 4);
  }, [product.id, product.category]);

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
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square rounded-xl bg-muted overflow-hidden opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                  <img src={product.image} alt="" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>
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
              <div className="flex items-center gap-1 mb-8">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-primary text-primary" />
                ))}
                <span className="text-xs text-muted-foreground ml-2">(24 Reviews)</span>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {product.longDescription || product.description}
              </p>
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
                className="flex-1 rounded-full py-8 text-lg"
                onClick={() => addToCart(product.id, 1)}
              >
                Add to Bag
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full py-8 text-lg border-primary text-primary hover:bg-primary/5"
                onClick={() => {
                  if (!user) {
                    loginWithGoogle();
                  } else {
                    toggleWishlist(product.id);
                  }
                }}
              >
                <Heart className={`w-5 h-5 mr-2 ${wishlistProductIds.includes(product.id) ? "fill-primary" : ""}`} /> 
                {wishlistProductIds.includes(product.id) ? "Wishlisted" : "Wishlist"}
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
            <li><Link to="/" className="hover:text-primary transition-colors">New Arrivals</Link></li>
            <li><Link to="/" className="hover:text-primary transition-colors">Best Sellers</Link></li>
            <li><Link to="/" className="hover:text-primary transition-colors">Clothes</Link></li>
            <li><Link to="/" className="hover:text-primary transition-colors">Shoes</Link></li>
            <li><Link to="/" className="hover:text-primary transition-colors">Bags</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-xl mb-6">Information</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li><a href="#about" className="hover:text-primary transition-colors">Our Story</a></li>
            <li><a href="#sustainability" className="hover:text-primary transition-colors">Sustainability</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-xl mb-6">Newsletter</h4>
          <p className="text-sm text-muted-foreground mb-6">
            Join our community for exclusive updates on conscious living.
          </p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Your email" 
              className="bg-muted border-none rounded-full px-4 py-2 text-sm w-full focus:ring-1 focus:ring-primary outline-none"
            />
            <Button className="rounded-full px-6">Join</Button>
          </div>
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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
