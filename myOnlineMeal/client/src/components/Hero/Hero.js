import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Delicious Food Delivered To Your Doorstep</h1>
        <p className="hero-subtitle">Order your favorite meals from the best restaurants in town</p>
        <div className="hero-buttons">
          <button 
            onClick={() => navigate('/menu')} 
            className="hero-btn primary-btn"
          >
            Order Now
          </button>
          <button 
            onClick={() => navigate('/menu')} 
            className="hero-btn secondary-btn"
          >
            View Menu
          </button>
        </div>
      </div>
      <div className="hero-image">
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836" 
          alt="Delicious food"
        />
      </div>
    </section>
  );
};

export default Hero;