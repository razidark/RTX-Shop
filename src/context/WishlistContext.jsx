/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);

  // Sync wishlist with backend or load from local storage based on auth state
  useEffect(() => {
    if (authLoading) return;

    const syncWishlist = async () => {
      if (user) {
        try {
          const savedWishlist = localStorage.getItem('rtx-shop-wishlist');
          const localItems = savedWishlist ? JSON.parse(savedWishlist) : [];
          const wishlistOwner = localStorage.getItem('rtx-shop-wishlist-owner') || 'guest';

          if (wishlistOwner === 'guest' && localItems.length > 0) {
            // Push guest items to server to merge
            for (const item of localItems) {
              await fetch('/api/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: item.id })
              });
            }
          }

          // Mark current user as owner
          localStorage.setItem('rtx-shop-wishlist-owner', user.id);

          const res = await fetch('/api/wishlist');
          if (res.ok) {
            const serverWishlist = await res.json();
            setWishlistItems(serverWishlist);
          }
        } catch (err) {
          console.error('Error syncing wishlist with DB:', err);
        }
      } else {
        localStorage.setItem('rtx-shop-wishlist-owner', 'guest');
        const savedWishlist = localStorage.getItem('rtx-shop-wishlist');
        setWishlistItems(savedWishlist ? JSON.parse(savedWishlist) : []);
      }
    };

    syncWishlist();
  }, [user, authLoading]);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem('rtx-shop-wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = async (product) => {
    if (user) {
      try {
        const res = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id })
        });
        
        if (res.ok) {
          const wishlistRes = await fetch('/api/wishlist');
          if (wishlistRes.ok) {
            const serverWishlist = await wishlistRes.json();
            setWishlistItems(serverWishlist);
          }
        } else {
          const data = await res.json();
          alert(data.error || 'Erro ao adicionar item aos favoritos');
        }
      } catch (err) {
        console.error('Error adding to backend wishlist:', err);
      }
    } else {
      setWishlistItems(prev => {
        const exists = prev.some(item => item.id === product.id);
        if (exists) return prev;
        return [...prev, product];
      });
    }
  };

  const removeFromWishlist = async (productId) => {
    if (user) {
      try {
        const res = await fetch(`/api/wishlist/${productId}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          const wishlistRes = await fetch('/api/wishlist');
          if (wishlistRes.ok) {
            const serverWishlist = await wishlistRes.json();
            setWishlistItems(serverWishlist);
          }
        }
      } catch (err) {
        console.error('Error removing from backend wishlist:', err);
      }
    } else {
      setWishlistItems(prev => prev.filter(item => item.id !== productId));
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const toggleWishlist = async (product) => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      wishlistCount: wishlistItems.length
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
