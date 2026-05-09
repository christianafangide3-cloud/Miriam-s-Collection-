import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, onSnapshot, setDoc, deleteDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export function useWishlist() {
  const { user } = useAuth();
  const [wishlistProductIds, setWishlistProductIds] = useState<number[]>([]);
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
      const ids: number[] = [];
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

  const toggleWishlist = async (productId: number) => {
    if (!user) return false; // Not logged in

    const docRef = doc(db, 'users', user.uid, 'wishlist', productId.toString());
    
    try {
      if (wishlistProductIds.includes(productId)) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, {
          productId: productId,
          savedAt: serverTimestamp()
        });
      }
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, docRef.path);
      return false;
    }
  };

  return { wishlistProductIds, toggleWishlist, loading };
}
