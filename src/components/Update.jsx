import React from 'react';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import { fadeInUp, staggerContainer } from '../utils/animations';

const updateCards = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fluent-color_people-16-uZB74oN80K3nOGHGQYyBBbhn1deQgo.png",
    alt: "Public Interaction",
    title: "Public Interaction",
    description: "Engage with our community through live chats and social media.",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%206-nbiysgAfSyPmLP9iwHN6RIcDnv65Nc.png",
    alt: "Live Storm Coverage",
    title: "Live Storm Coverage",
    description: "Stay safe with our real-time storm tracking and live updates.",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2055-faczVeLkib0PFc3FM7SR4g7hHQyA47.png",
    alt: "YouTube Channel",
    title: "YouTube Channel",
    description: "Subscribe to our YouTube channel for forecasts and weather discussions.",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/glow-arrow-graph-analytics-3d-icon-bubble-speech-chat-3d-rendering%201-L8FrISzOnFihl3ENr4qdIKj4fVjxvz.png",
    alt: "7-Day Forecasts",
    title: "7-Day Forecasts",
    description: "Plan ahead with our reliable weekly weather forecasts.",
  },
];

function Update() {
  return (
    <div className="font-sans bg-dark text-white py-5 overflow-hidden">
      <div className="container px-3 px-md-4 py-lg-4">
        <div className="mx-lg-4 mx-0 text-center text-md-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
          >
            <h1 className="display-5 fw-bold mb-3 mb-md-4">Get Updated About Arkansas Weather</h1>
            <h5 className="mb-4 mb-md-5 albertregular lh-base" style={{ color: '#BBBBBB', maxWidth: '850px' }}>
              Your trusted source for comprehensive weather updates across Arkansas! Whether you're preparing for severe weather or planning your week, we've got you covered. Our team is dedicated to bringing you the most accurate and up-to-date weather information available.
            </h5>
          </motion.div>

          <motion.div
            className="row g-4 mx-0"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {updateCards.map((card, idx) => (
              <motion.div
                key={idx}
                className="col-12 col-sm-6 col-lg-3"
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 260 }}
              >
                <div className="bg-black rounded-4 p-4 h-100 text-center text-sm-start">
                  <img
                    src={card.src}
                    alt={card.alt}
                    className="img-fluid mb-3"
                    style={{ width: '90px', height: '90px', objectFit: 'contain' }}
                  />
                  <h5 className="fw-semibold mb-2">{card.title}</h5>
                  <p className="mb-0" style={{ color: '#B7B7B7' }}>
                    {card.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Update;
