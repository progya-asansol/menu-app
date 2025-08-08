import Hero from '../../components/Hero/Hero';
import Services from '../Services/Services';
import TestimonialCard from '../../components/TestimonialCard/TestimonialCard';

import './Home.css'
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate=useNavigate();

    const handleOrderNow=()=>{
        navigate('/menu');
    }
  return (
    <div className="home-page">
        <Hero/>
        <Services/>
            <TestimonialCard />

      <section className="hero">
        <h1>Welcome to myOnlineMeal</h1>
        <p>Delicious food delivered to your doorstep</p>
        <button onClick={handleOrderNow} className="order-btn">Order Now</button>
      </section>
    </div>
  );
};

export default Home;