import { createContext, useState } from 'react';

   export const CartContext = createContext();

   export const CartProvider = ({ children }) => {
     const [cart, setCart] = useState([]);

     const addToCart = (item) => {
       setCart((prevCart) => {
         const existingItem = prevCart.find((ci) => ci.id === item.id);
         if (existingItem) {
           return prevCart.map((ci) =>
             ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
           );
         }
         return [...prevCart, { ...item, quantity: 1 }];
       });
     };

     const removeFromCart = (itemId) => {
       setCart((prevCart) => {
         const existingItem = prevCart.find((ci) => ci.id === itemId);
         if (!existingItem) return prevCart;
         if (existingItem.quantity === 1) {
           return prevCart.filter((ci) => ci.id !== itemId);
         }
         return prevCart.map((ci) =>
           ci.id === itemId ? { ...ci, quantity: ci.quantity - 1 } : ci
         );
       });
     };

     const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

     return (
       <CartContext.Provider value={{ cart, addToCart, removeFromCart, cartCount }}>
         {children}
       </CartContext.Provider>
     );
   };