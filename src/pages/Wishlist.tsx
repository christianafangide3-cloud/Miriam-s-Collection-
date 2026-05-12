import { useWishlist } from "../hooks/useWishlist";
import { useProducts } from "../contexts/ProductsContext";
import { useCart } from "../contexts/CartContext";
import { HeartOff, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export const WishlistPage = () => {
  const { wishlistProductIds, toggleWishlist, loading: wishlistLoading } = useWishlist();
  const { products, loading: productsLoading } = useProducts();
  const { addToCart } = useCart();

  const loading = wishlistLoading || productsLoading;
  
  const wishlistedProducts = products.filter(p => wishlistProductIds.includes(p.id));

  if (loading) {
    return (
      <div className="min-h-screen py-32 px-6 md:px-12 bg-[#f0ede8] flex items-center justify-center">
        <div className="text-xl font-serif animate-pulse text-muted-foreground">Loading your wishlist...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-32 px-6 md:px-12 bg-[#f0ede8]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif mb-4">Your Wishlist</h1>
        <p className="text-muted-foreground mb-12">Pieces you've saved for later.</p>
        
        {wishlistedProducts.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm text-center max-w-2xl mx-auto">
            <HeartOff className="w-12 h-12 mx-auto text-muted-foreground opacity-30 mb-4" />
            <h3 className="text-xl font-medium mb-4">Nothing here yet</h3>
            <p className="text-muted-foreground mb-8">You haven't saved any items to your wishlist. Let's find something you'll love.</p>
            <Link to="/">
              <Button className="rounded-full px-8 py-6">Explore Collections</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {wishlistedProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-4 rounded-xl">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Actions Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                    <button 
                      onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
                      className="self-end p-2 bg-white rounded-full text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                    >
                      <HeartOff className="w-4 h-4" />
                    </button>
                    
                    <Button 
                      className="w-full rounded-full bg-white text-black hover:bg-white/90 border-none" 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        addToCart(product.id, 1);
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <Link to={`/product/${product.id}`} className="hover:underline">
                      <h3 className="font-serif text-lg leading-tight mb-1">{product.name}</h3>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                  </div>
                  <span className="font-medium">₦{product.price.toLocaleString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
