import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, onSnapshot, setDoc, deleteDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export function useWishlist() {
  const { user } = useAuth();
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setWishlistProductIds([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const wishlistRef = collection(db, 'users', user.uid, 'wishlist');

    const unsubscribe = onSnapshot(wishlistRef, (snapshot) => {
      const ids: string[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.productId !== undefined) {
           ids.push(data.productId);
        }
      });
      setWishlistProductIds(ids);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}/wishlist`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      toast.error("Please login to manage wishlist");
      return false;
    }

    const docRef = doc(db, 'users', user.uid, 'wishlist', productId);
    
    try {
      if (wishlistProductIds.includes(productId)) {
        await deleteDoc(docRef);
        toast("Removed from wishlist");
      } else {
        await setDoc(docRef, {
          productId: productId,
          savedAt: serverTimestamp()
        });
        toast.success("Added to wishlist");
      }
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, docRef.path);
      toast.error("Failed to update wishlist");
      return false;
    }
  };

  return { wishlistProductIds, toggleWishlist, loading };
}
