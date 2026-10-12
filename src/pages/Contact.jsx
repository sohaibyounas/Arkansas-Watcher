import React, { useState } from 'react';
import { motion } from 'framer-motion';
import contactBg from '../assets/images/contactBg.png';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { BASEURL } from '../Constant/API';
import { fadeInLeft, fadeInRight } from '../utils/animations';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    feedback: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const validateForm = () => {
    // Name validation
    if (!formData.name.trim()) {
      return false;
    }
    
    // Phone validation
    if (!formData.phone) {
      return false;
    }
    
    // Email validation
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return false;
    }
    
    // Feedback validation
    if (!formData.feedback.trim()) {
      return false;
    }
    
    return true;
  };

  const isFormValid = validateForm();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const response = await fetch(`${BASEURL}/main/contact-us`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          feedback: formData.feedback
        })
      });
      
      const responseData = await response.json();
      console.log('API Response:', responseData);
      
      if (response.ok && responseData.status === true) {
        setSubmitStatus({
          type: 'success',
          message: responseData.action || 'Contact Request Send'
        });
        
        setFormData({
          name: '',
          phone: '',
          email: '',
          feedback: ''
        });
      } else {
        throw new Error(responseData.message || 'Server responded with an error');
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to submit the form. Please try again later.'
      });
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-vh-100 bg-cover bg-center position-relative d-flex flex-column justify-content-between overflow-hidden"
      style={{
        backgroundImage: `url(${contactBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <main className="container py-5 px-3 px-md-4 my-auto">
        <div className="row gy-4 align-items-center">
          {/* Left Text Content */}
          <motion.div
            className="col-lg-6 col-md-12 text-white text-center text-lg-start mt-3 mt-lg-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInLeft}
          >
            <h1 className="display-5 fw-bold mb-3 mb-md-4">Contact Us Any Time</h1>
            <p className="lead mb-0" style={{ lineHeight: '2rem', fontWeight: '100' }}>
              Whether you need weather updates or have feedback, our team is ready to help. Drop us a message, and we'll get back to you shortly.
            </p>
          </motion.div>

          {/* Right Form Content */}
          <motion.div
            className="col-lg-6 col-md-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInRight}
          >
            <div
              className="p-3 p-sm-4 rounded-4 shadow"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(4px)',
                color: 'white',
              }}
            >
              {submitStatus && (
                <div className={`alert ${submitStatus.type === 'success' ? 'alert-success' : 'alert-danger'} mb-3`}>
                  {submitStatus.message}
                </div>
              )}
              
              <form id="contactForm" onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="mb-3">
                  <label htmlFor="contactName" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="contactName"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Cook"
                    className="form-control bg-transparent text-white border-light"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div className="mb-3">
                  <label htmlFor="contactPhoneNumber" className="form-label">Phone Number</label>
                  <input
                    type="text"
                    id="contactPhoneNumber"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1234567890"
                    className="form-control bg-transparent text-white border-light"
                    required
                  />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="contactEmail" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="johncook@gmail.com"
                    className="form-control bg-transparent text-white border-light"
                    required
                  />
                </div>

                {/* Feedback */}
                <div className="mb-3">
                  <label htmlFor="contactFeedback" className="form-label">Feedback</label>
                  <textarea
                    id="contactFeedback"
                    name="feedback"
                    value={formData.feedback}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Write your feedback..."
                    className="form-control bg-transparent text-white border-light"
                    required
                  ></textarea>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-danger w-100 py-2"
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Contact;