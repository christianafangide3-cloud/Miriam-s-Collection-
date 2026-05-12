import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export interface Product {
  id: string;
  name: string;
  category: "Clothes" | "Shoes" | "Bags" | string;
  price: number;
  image: string;
  isSustainable: boolean;
  description: string;
  longDescription?: string;
  details?: string[];
  materials?: string[];
  careInstructions?: string;
  sizingGuide?: string;
  additionalImages?: string[];
}

interface ProductsContextType {
  products: Product[];
  loading: boolean;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Note: since we only want active products, we just fetch all
    // in the real world we'd paginate or filter, but for Phase 1 this is fine.
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedProducts: Product[] = [];
      snapshot.forEach(doc => {
        fetchedProducts.push({
          id: doc.id,
          ...doc.data()
        } as Product);
      });
      setProducts(fetchedProducts);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loading }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
