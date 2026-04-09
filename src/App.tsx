import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  ArrowUpDown
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

// --- Types ---
interface Product {
  id: number;
  name: string;
  category: "Clothes" | "Shoes" | "Bags";
  price: number;
  image: string;
  isSustainable: boolean;
  description: string;
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
    description: "Ethically sourced organic cotton, dyed with natural pigments."
  },
  {
    id: 2,
    name: "Vegan Leather Tote",
    category: "Bags",
    price: 195,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop",
    isSustainable: true,
    description: "Crafted from recycled pineapple leaf fibers."
  },
  {
    id: 3,
    name: "Recycled Wool Knit",
    category: "Clothes",
    price: 145,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop",
    isSustainable: true,
    description: "Soft, warm, and 100% recycled wool from post-consumer waste."
  },
  {
    id: 4,
    name: "Hemp Canvas Sneakers",
    category: "Shoes",
    price: 120,
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop",
    isSustainable: true,
    description: "Durable hemp upper with natural rubber soles."
  },
  {
    id: 5,
    name: "Linen Summer Dress",
    category: "Clothes",
    price: 175,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop",
    isSustainable: true,
    description: "Breathable European linen, handmade in small batches."
  },
  {
    id: 6,
    name: "Cork Leather Belt Bag",
    category: "Bags",
    price: 110,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
    isSustainable: true,
    description: "Water-resistant cork leather, harvested without harming trees."
  }
];

const CATEGORIES = ["All", "Clothes", "Shoes", "Bags"];

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

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
        isScrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"
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
                <a key={cat} href="#" className="text-2xl font-serif hover:text-primary transition-colors">
                  {cat}
                </a>
              ))}
              <Separator />
              <a href="#sustainability" className="text-xl font-serif hover:text-primary transition-colors">Sustainability</a>
              <a href="#about" className="text-xl font-serif hover:text-primary transition-colors">Our Story</a>
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden md:flex items-center gap-6 text-sm uppercase tracking-widest font-medium">
          <a href="#" className="hover:text-primary transition-colors">Shop</a>
          <a href="#sustainability" className="hover:text-primary transition-colors">Sustainability</a>
          <a href="#about" className="hover:text-primary transition-colors">Story</a>
        </div>
      </div>

      <a href="/" className="absolute left-1/2 -translate-x-1/2 text-2xl md:text-3xl font-serif tracking-tighter italic">
        Ethos & Aura
      </a>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <Search className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <User className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingBag className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
            0
          </span>
        </Button>
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
          <Button size="lg" className="rounded-full px-8 py-6 text-lg bg-white text-black hover:bg-white/90 border-none">
            Explore Collection <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
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

  const filteredProducts = activeTab === "All" 
    ? [...PRODUCTS] 
    : PRODUCTS.filter(p => p.category === activeTab);

  const sortedProducts = filteredProducts.sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "name-az") return a.name.localeCompare(b.name);
    return 0; // Default: featured (original order)
  });

  return (
    <section className="py-24 px-6 md:px-12 bg-[#f0ede8]">
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
          {sortedProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="group"
            >
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
                >
                  <Heart className="w-4 h-4" />
                </Button>
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Button className="w-full rounded-full bg-white text-black hover:bg-white/90 border-none">
                    Add to Bag
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-serif mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                </div>
                <span className="font-medium text-lg">${product.price}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
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
          <a href="/" className="text-3xl font-serif tracking-tighter italic mb-6 block">
            Ethos & Aura
          </a>
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
            <li><a href="#" className="hover:text-primary transition-colors">New Arrivals</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Best Sellers</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Clothes</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Shoes</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Bags</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-xl mb-6">Information</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-primary transition-colors">Our Story</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Sustainability</a></li>
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
        <p>© 2026 Ethos & Aura. All rights reserved.</p>
        <div className="flex gap-8">
          <div className="flex items-center gap-2"><Truck className="w-3 h-3" /> Global Shipping</div>
          <div className="flex items-center gap-2"><ShieldCheck className="w-3 h-3" /> Secure Payment</div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="min-h-screen selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <main>
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
              Ethos & Aura was born from a simple realization: the fashion industry needed a soul. We set out to bridge the gap between high-end luxury and radical transparency. Every artisan we partner with, every farm we source from, and every thread we use is chosen with intention.
            </p>
            <Button variant="outline" className="rounded-full px-8 py-6 border-primary text-primary hover:bg-primary hover:text-white">
              Read Our Full Manifesto
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
