import { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cart, cartCount, cartTotal } = useContext(CartContext);

  return (
    <div className="cart-page">
      <h1>Your Cart ({cartCount} items)</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={`${item.id}-${item.quantity}`} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>${item.price.toFixed(2)} × {item.quantity}</p>
                  <p>Item Total: ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Order Total: ${cartTotal.toFixed(2)}</h2>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;