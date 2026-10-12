import React, { useState } from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/images/logo.svg';
import { FaDiscord, FaFacebookF, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { LuSend } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import { BASEURL } from '../Constant/API';
import axios from 'axios';
import { fadeInUp, staggerContainer } from '../utils/animations';

function Footer() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleNewsletterSubmit = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    
    // Validate email
    if (!email) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await axios.post(`${BASEURL}/main/news/letter/create`, {
        email: email
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setSuccessMessage(response.data.action);
      setEmail('');
    } catch (error) {
      // Extract error message from axios error object
      const message = error.response?.data?.message || 
                      error.message || 
                      'Something went wrong. Please try again later.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-black text-white py-5">
      <div className="container px-3 px-md-4">
        <motion.div
          className="row gy-4 text-center text-md-start"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <motion.div className="col-lg-3 col-md-6 mb-2 mb-md-4" variants={fadeInUp}>
            <h5 className="fw-bold mb-3 mb-md-4">About Us</h5>
            <p>Your Go-To Source for All <br className="d-none d-md-inline" /> Things Weather in Arkansas!</p>
            <div className="d-flex align-items-center justify-content-center justify-content-md-start">
              <img src={logo} alt="Arkansas Weather Watcher Logo" className="me-2 img-fluid" width="170" />
            </div>
            <p className="mt-3 mb-0">Site Provide and Sponsored</p>
            <p className="text-decoration-underline mb-0">by FireTEXT* Dispatch Solutions</p>
          </motion.div>

          <motion.div className="col-lg-3 col-md-6 mb-2 mb-md-4" variants={fadeInUp}>
            <h5 className="fw-bold mb-3 mb-md-4">Services</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 gap-md-3 mb-0">
              <li><Link to="/weather" className="footer-links mb-1">7-days Forecast</Link></li>
              <li><Link to="/livecam" className="footer-links mb-1">Live storm Coverage</Link></li>
              <li><Link to="/weather" className="footer-links mb-1">Weather Summary</Link></li>
              <li><Link to="/alert" className="footer-links mb-1">Get Alerts</Link></li>
            </ul>
          </motion.div>

          <motion.div className="col-lg-3 col-md-6 mb-2 mb-md-4" variants={fadeInUp}>
            <h5 className="fw-bold mb-3 mb-md-4">Important Link</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 gap-md-3 mb-0">
              <li><Link to="/sponsors" className="footer-links mb-1">Sponsers</Link></li>
              <li><Link to="https://www.weather.gov/" target="_blank" className="footer-links mb-1">National Weather Service</Link></li>
              <li><Link to="https://www.idrivearkansas.com/" target="_blank" className="footer-links mb-1">IDriveArkansas</Link></li>
              <li><Link to="https://www.usgs.gov/programs/earthquake-hazards" target="_blank" className="footer-links mb-1">Earthquake Hazards</Link></li>
              <li><Link to="/blogs" className="footer-links mb-1">Weather Blogs</Link></li>
            </ul>
          </motion.div>

          <motion.div className="col-lg-3 col-md-6 mb-2 mb-md-4" variants={fadeInUp}>
            <h5 className="fw-bold mb-3">Newsletter</h5>
            <p>Subscribe our newsletter to get updates about our services, offer and weather conditions.</p>
            <div className="d-flex mb-2">
              <input 
                type="email" 
                name="email" 
                placeholder="Email Address" 
                className="form-control text-black" 
                style={{background: '#D9D9D9', borderRadius: '20px 0px 0px 20px'}} 
                value={email}
                onChange={handleEmailChange}
                disabled={isLoading}
                required 
              />
              <motion.button 
                type="button" 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-danger" 
                style={{borderRadius: '0px 20px 20px 0px'}} 
                onClick={handleNewsletterSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <LuSend />
                )}
              </motion.button>
            </div>
            {errorMessage && <div className="text-danger small mt-2">{errorMessage}</div>}
            {successMessage && <div className="text-success small mt-2">{successMessage}</div>}
          </motion.div>
        </motion.div>

        <hr className="border-light mt-4 mt-md-5" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center pt-3 gap-3">
          <div className="d-flex flex-wrap justify-content-center">
            {[FaFacebookF, FaXTwitter, FaYoutube, FaDiscord].map((Icon, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.12, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="rounded me-2 socials"
                style={{ padding: '11px 15px' }}
              >
                <Icon className="text-white fs-4" />
              </motion.div>
            ))}
          </div>

          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link to="/" className="text-decoration-underline footer-links">Privacy Policy</Link>
            <Link to="/" className="text-decoration-underline footer-links">Terms of Use</Link>
            <Link to="/contact" className="text-decoration-underline footer-links">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;