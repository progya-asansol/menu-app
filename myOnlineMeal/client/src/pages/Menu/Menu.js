// src/components/Menu.js
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../../context/CartContext';
import './Menu.css';

const Menu = () => {
  const { cart, addToCart, removeFromCart, cartCount } = useContext(CartContext);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [error, setError] = useState(null);

  // Debug context values
  console.log('CartContext values:', { cart, addToCart, removeFromCart, cartCount });

  const fallbackMenu = [
    {
      id: 1,
      name: "Margherita Pizza",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
      description: "Classic pizza with tomato sauce, mozzarella, and basil",
      category: "Italian"
    },
    {
      id: 2,
      name: "Spaghetti Carbonara",
      price: 14.50,
      image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb",
      description: "Pasta with eggs, cheese, pancetta, and black pepper",
      category: "Italian"
    },
    {
      id: 3,
      name: "Butter Chicken",
      price: 15.99,
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
      description: "Tender chicken in creamy tomato sauce",
      category: "Indian"
    },
    {
      id: 4,
      name: "Classic Cheeseburger",
      price: 9.99,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
      description: "Beef patty with cheese and special sauce",
      category: "American"
    },
    {
      id: 5,
      name: "Chicken Fried Rice",
      price: 11.99,
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b",
      description: "Stir-fried rice with chicken and vegetables",
      category: "Chinese"
    },
    {
      id: 6,
      name: "Mango Lassi",
      price: 3.99,
      image: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a",
      description: "Refreshing yogurt-based drink with mango",
      category: "Beverage"
    }
  ];

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        console.log('Attempting to fetch menu from API...');
        const response = await axios.get('http://localhost:5000/api/menu', {
          timeout: 5000,
        });
        setMenuItems(response.data);
      } catch (err) {
        console.error('Connection issue, using fallback:', {
          message: err.message,
          code: err.code,
          response: err.response ? err.response.data : null,
        });
        try {
          setMenuItems(fallbackMenu);
          setUsingFallback(true);
        } catch (fallbackErr) {
          console.error('Fallback failed:', fallbackErr);
          setError('Failed to load menu. Please try again later.');
          setMenuItems([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  const handleRemoveFromCart = (itemId) => {
    if (typeof removeFromCart === 'function') {
      removeFromCart(itemId);
    } else {
      console.error('removeFromCart is not a function');
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading our delicious menu...</p>
      </div>
    );
  }

  return (
    <div className="menu-container">
      {usingFallback && (
        <div className="fallback-notice">
          <div className="warning-icon">⚠️</div>
          <div>
            <h3>We're having trouble loading the live menu</h3>
            <p>Showing our standard menu instead - all items available</p>
          </div>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}

      <div className="cart-button-floating">
        🛒 {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
      </div>

      <h1 className="menu-title">Our Menu</h1>

      <div className="menu-grid">
        {menuItems.length > 0 ? (
          menuItems.map((item) => {
            const cartItem = cart.find((ci) => ci.id === item.id);
            const quantity = cartItem ? cartItem.quantity : 0;

            return (
              <div key={item.id} className="menu-item">
                <div className="image-container">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                    onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  <span className="price-badge">${item.price.toFixed(2)}</span>
                </div>
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p className="item-description">{item.description}</p>
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="quantity-btn minus"
                      disabled={quantity === 0}
                    >
                      -
                    </button>
                    <span className="quantity">{quantity}</span>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="quantity-btn plus"
                    >
                      +
                    </button>
                    {quantity > 0 && (
                      <span className="item-total">
                        ${(item.price * quantity).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="no-items">No menu items available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Menu;