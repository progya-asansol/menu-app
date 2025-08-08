import React from 'react';
import './Services.css';

const services = [
  {
    id: 1,
    title: "Fast Delivery",
    description: "Get your food delivered in under 30 minutes or it's free!",
    icon: "🚚"
  },
  {
    id: 2,
    title: "Fresh Food",
    description: "100% fresh ingredients from local farms",
    icon: "🍅"
  },
  {
    id: 3,
    title: "24/7 Support",
    description: "Our team is always ready to help you",
    icon: "📞"
  }
];

const Services = () => {
  return (
    <section className="services">
      <h2 className="section-title">Why Choose Us</h2>
      <div className="services-grid">
        {services.map(service => (
          <div key={service.id} className="service-card">
            <div className="service-icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;