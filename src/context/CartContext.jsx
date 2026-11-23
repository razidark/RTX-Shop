/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // Sync cart with backend or load from local storage based on auth state
  useEffect(() => {
    if (authLoading) return;

    const syncCart = async () => {
      if (user) {
        try {
          const savedCart = localStorage.getItem('rtx-shop-cart');
          const localItems = savedCart ? JSON.parse(savedCart) : [];
          const cartOwner = localStorage.getItem('rtx-shop-cart-owner') || 'guest';

          if (cartOwner === 'guest' && localItems.length > 0) {
            // Push guest items to server to merge
            for (const item of localItems) {
              await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: item.id, quantity: item.quantity })
              });
            }
          }

          // Mark current user as owner
          localStorage.setItem('rtx-shop-cart-owner', user.id);

          const res = await fetch('/api/cart');
          if (res.ok) {
            const serverCart = await res.json();
            setCartItems(serverCart);
          }
        } catch (err) {
          console.error('Error syncing cart with DB:', err);
        }
      } else {
        localStorage.setItem('rtx-shop-cart-owner', 'guest');
        const savedCart = localStorage.getItem('rtx-shop-cart');
        setCartItems(savedCart ? JSON.parse(savedCart) : []);
      }
    };

    syncCart();
  }, [user, authLoading]);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('rtx-shop-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (product, quantity = 1) => {
    if (user) {
      try {
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id, quantity })
        });
        
        if (!res.ok) {
          const data = await res.json();
          alert(data.error || 'Erro ao adicionar item ao carrinho');
          return;
        }

        const cartRes = await fetch('/api/cart');
        if (cartRes.ok) {
          const serverCart = await cartRes.json();
          setCartItems(serverCart);
        }
      } catch (err) {
        console.error('Error adding to backend cart:', err);
      }
    } else {
      setCartItems(prev => {
        const existingItem = prev.find(item => item.id === product.id);
        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          if (product.stock !== undefined && newQuantity > product.stock) {
            alert(`Desculpe, temos apenas ${product.stock} unidades deste produto em estoque.`);
            return prev;
          }
          return prev.map(item => 
            item.id === product.id ? { ...item, quantity: newQuantity } : item
          );
        }
        if (product.stock !== undefined && quantity > product.stock) {
          alert(`Desculpe, temos apenas ${product.stock} unidades deste produto em estoque.`);
          return prev;
        }
        return [...prev, { ...product, quantity }];
      });
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
      try {
        const res = await fetch(`/api/cart/${productId}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          const cartRes = await fetch('/api/cart');
          if (cartRes.ok) {
            const serverCart = await cartRes.json();
            setCartItems(serverCart);
          }
        }
      } catch (err) {
        console.error('Error removing from backend cart:', err);
      }
    } else {
      setCartItems(prev => prev.filter(item => item.id !== productId));
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    if (user) {
      try {
        const res = await fetch(`/api/cart/${productId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity })
        });

        if (!res.ok) {
          const data = await res.json();
          alert(data.error || 'Erro ao atualizar quantidade');
          return;
        }

        const cartRes = await fetch('/api/cart');
        if (cartRes.ok) {
          const serverCart = await cartRes.json();
          setCartItems(serverCart);
        }
      } catch (err) {
        console.error('Error updating quantity in backend cart:', err);
      }
    } else {
      setCartItems(prev => 
        prev.map(item => 
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await fetch('/api/cart', {
          method: 'DELETE'
        });
        setCartItems([]);
      } catch (err) {
        console.error('Error clearing backend cart:', err);
      }
    } else {
      setCartItems([]);
    }
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

