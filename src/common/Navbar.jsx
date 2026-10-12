import React, { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import axios from 'axios'; // Added axios import
import { motion, AnimatePresence } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/style.css';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner, // Added spinner for loading state
} from 'reactstrap';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { BASEURL } from '../Constant/API';

const navItems = [
  { path: "/", label: "Home" },
  { path: "/weather", label: "Weather" },
  { path: "/alert", label: "Get Alerts" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact Us" },
  { path: "/livecam", label: "Live Cam" },
  {
    path: "https://arkwxshop.org/",
    label: "Our Shop",
    external: true,
  },
];

function Navbar() {
  const [isSticky, setIsSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState(false);
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    company_name: '',
    advertise_file: null,
    message: '',
    url: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [header, setHeader] = useState('');

  const toggle = () => {
    setModal(!modal);
    // Reset form state when closing modal
    if (modal) {
      setFormData({
        name: '',
        email: '',
        phone_number: '',
        company_name: '',
        advertise_file: null,
        message: '',
        url: ''
      });
      setFormError('');
      setFormSuccess('');
      setImagePreview(null);
    }
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await axios.get(`${BASEURL}/main/home`);
        setHeader(response.data.data.header);
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };

    fetchHomeData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        advertise_file: file
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({
        ...formData,
        advertise_file: null
      });
      setImagePreview(null);
    }
  };

  const isFormValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    const validFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];

    return (
      formData.name.trim() !== '' &&
      formData.email.trim() !== '' &&
      emailRegex.test(formData.email.trim()) &&
      formData.phone_number.trim() !== '' &&
      phoneRegex.test(formData.phone_number.trim()) &&
      formData.company_name.trim() !== '' &&
      formData.message.trim() !== '' &&
      formData.advertise_file &&
      validFileTypes.includes(formData.advertise_file.type)
    );
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    const validFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];

    if (formData.url.trim()) {
      const urlRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+([/\w-]*)*$/;
      if (!urlRegex.test(formData.url.trim())) {
        return false;
      }
    }

    return (
      formData.name.trim() !== '' &&
      formData.email.trim() !== '' &&
      emailRegex.test(formData.email.trim()) &&
      formData.phone_number.trim() !== '' &&
      phoneRegex.test(formData.phone_number.trim()) &&
      formData.company_name.trim() !== '' &&
      formData.message.trim() !== '' &&
      formData.advertise_file &&
      validFileTypes.includes(formData.advertise_file.type)
    );
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setFormError('');
    setFormSuccess('');

    // Create FormData object for file upload
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('email', formData.email);
    submitData.append('phone_number', formData.phone_number);
    submitData.append('company_name', formData.company_name);
    submitData.append('message', formData.message);
    submitData.append('url', formData.url);
    
    if (formData.advertise_file) {
      submitData.append('advertise_file', formData.advertise_file);
    }

    try {
      const response = await axios.post(`${BASEURL}/main/advertise/with/us`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);

      if (response.data.status === true) {
        setFormSuccess(response.data.action || 'Your sponsor request has been created successfully!');
        // Clear form after successful submission
        setFormData({
          name: '',
          email: '',
          phone_number: '',
          company_name: '',
          advertise_file: null,
          message: '',
          url: ''
        });
        toggle();
        setFormSuccess('');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Upper Scrolling Bar */}
      <div className="upper-bar text-white py-1">
        <div className="scrolling-text">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="mx-2 small">
              {header.header}
            </span>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={`main-navbar d-flex align-items-center justify-content-between px-3 px-md-4 py-2 ${
          isSticky ? "sticky-navbar" : ""
        }`}
      >
        {/* Logo */}
        <Link
          className="d-flex align-items-center text-white text-decoration-none"
          to="/"
        >
          <motion.img
            src="/weather.svg"
            alt="LOGO"
            style={{ width: "50px" }}
            whileHover={{ scale: 1.08, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        </Link>

        {/* Navigation Links - shown on desktop, hidden on mobile */}
        <Nav className="d-none d-lg-flex align-items-center gap-2 gap-xl-3">
          {navItems.map((item) =>
            item.external ? (
              <a
                key={item.path}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className="custom-nav-link nav-item text-white fw-semibold p-2 position-relative albertmedium"
              >
                {item.label}
              </a>
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `custom-nav-link nav-item text-white fw-semibold p-2 position-relative albertmedium ${
                    isActive ? "active" : ""
                  }`
                }
              >
                {item.label}
              </NavLink>
            )
          )}
        </Nav>

        {/* Advertise Button - hidden on small screens */}
        <motion.div
          onClick={toggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-danger d-none d-lg-block text-decoration-none px-4 py-2 fw-semibold text-white rounded albertsemibold"
          style={{ background: "#FF5B63", cursor: "pointer" }}
        >
          Advertise With Us
        </motion.div>

        {/* Burger Menu - only shown on mobile */}
        <div
          className="burger-container d-lg-none d-flex align-items-center justify-content-center"
          onClick={toggleMenu}
          style={{
            position: "relative",
            width: "40px",
            height: "30px",
            cursor: "pointer",
            zIndex: 1500,
            visibility: menuOpen ? "hidden" : "visible",
          }}
        >
          <div
            className="burger-line"
            style={{
              position: "absolute",
              width: "26px",
              height: "3px",
              backgroundColor: "#fff",
              borderRadius: "2px",
              transition: "all 0.3s ease",
              top: "2px",
            }}
          ></div>
          <div
            className="burger-line"
            style={{
              position: "absolute",
              width: "26px",
              height: "3px",
              backgroundColor: "#fff",
              borderRadius: "2px",
              transition: "all 0.3s ease",
              top: "12px",
            }}
          ></div>
          <div
            className="burger-line"
            style={{
              position: "absolute",
              width: "26px",
              height: "3px",
              backgroundColor: "#fff",
              borderRadius: "2px",
              transition: "all 0.3s ease",
              top: "22px",
            }}
          ></div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu-overlay d-lg-none"
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.98)",
              zIndex: 2000,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Always-visible Mobile Overlay Header with Close Icon */}
            <div
              className="d-flex align-items-center justify-content-between px-3 px-sm-4 py-3 w-100"
              style={{ flexShrink: 0 }}
            >
              <Link
                className="d-flex align-items-center text-white text-decoration-none"
                to="/"
                onClick={toggleMenu}
              >
                <img
                  src="/weather.svg"
                  alt="LOGO"
                  style={{ width: "44px" }}
                />
              </Link>

              <motion.button
                type="button"
                aria-label="Close Menu"
                onClick={toggleMenu}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                className="btn p-0 border-0 d-flex align-items-center justify-content-center"
                style={{
                  position: "relative",
                  width: "40px",
                  height: "40px",
                  cursor: "pointer",
                  background: "transparent",
                }}
              >
                <span
                  className="line-1-active"
                  style={{
                    position: "absolute",
                    width: "26px",
                    height: "3px",
                    backgroundColor: "#FF5B63",
                    borderRadius: "2px",
                  }}
                ></span>
                <span
                  className="line-3-active"
                  style={{
                    position: "absolute",
                    width: "26px",
                    height: "3px",
                    backgroundColor: "#FF5B63",
                    borderRadius: "2px",
                  }}
                ></span>
              </motion.button>
            </div>

            {/* Mobile Menu Links */}
            <div
              className="container flex-grow-1 d-flex flex-column justify-content-center align-items-center pb-4"
              style={{ overflowY: "auto" }}
            >
              <ul className="list-unstyled text-center mb-3 w-100">
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.path}
                    className="mb-2 mb-sm-3"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * index, duration: 0.28 }}
                  >
                    {item.external ? (
                      <a
                        href={item.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={toggleMenu}
                        className="albertsemibold d-block py-1 py-sm-2 text-decoration-none text-white fs-5 fs-sm-4"
                      >
                        {item.label.toUpperCase()}
                      </a>
                    ) : (
                      <NavLink
                        to={item.path}
                        onClick={toggleMenu}
                        className={({ isActive }) =>
                          `albertsemibold d-block py-1 py-sm-2 text-decoration-none text-white fs-5 fs-sm-4 ${
                            isActive ? "text-danger" : ""
                          }`
                        }
                      >
                        {item.label.toUpperCase()}
                      </NavLink>
                    )}
                  </motion.li>
                ))}
              </ul>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.28 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  toggleMenu();
                  toggle();
                }}
                className="btn-danger text-decoration-none px-4 py-2 fw-semibold text-white rounded albertsemibold mt-1"
                style={{ background: "#FF5B63", cursor: "pointer" }}
              >
                Advertise With Us
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        isOpen={modal}
        toggle={toggle}
        centered
        style={{
          backgroundColor: "#212121",
          borderRadius: "25px",
          maxWidth: "600px",
          width: "95%",
          margin: "0 auto",
        }}
      >
        <ModalHeader
          toggle={toggle}
          style={{ backgroundColor: "#212121", color: "white" }}
        >
          Become Our Sponsor
        </ModalHeader>

        <ModalBody
          className="text-white"
          style={{ backgroundColor: "#212121" }}
        >
          <h5 className="mb-4">Interested in Sponsoring?</h5>

          {formSuccess && (
            <div className="alert alert-success">{formSuccess}</div>
          )}

          {formError && <div className="alert alert-danger">{formError}</div>}

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                className="customInput"
                type="text"
                id="name"
                placeholder="John Cook"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                className="customInput"
                type="email"
                id="email"
                placeholder="Johncook@gmail.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="phone_number">Phone Number</Label>
              <Input
                className="customInput"
                type="text"
                id="phone_number"
                placeholder="+923211234567"
                value={formData.phone_number}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="company_name">Company Name</Label>
              <Input
                className="customInput"
                type="text"
                id="company_name"
                placeholder="Company Name"
                value={formData.company_name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="url">Website URL</Label>
              <Input
                className="customInput"
                type="text"
                id="url"
                placeholder="example.com"
                value={formData.url}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label for="advertise_file">Company Logo</Label>
              <Input
                className="customInput"
                type="file"
                id="advertise_file"
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: "none" }}
              />
              <div
                className="border border-secondary rounded d-flex flex-column align-items-center justify-content-center customInput p-3"
                style={{
                  height: "150px",
                  width: "150px",
                  borderStyle: "dashed",
                  cursor: "pointer",
                  position: "relative",
                }}
                onClick={() => document.getElementById("advertise_file").click()}
              >
                {imagePreview ? (
                  <>
                    <div
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        background: "rgba(0,0,0,0.5)",
                        borderRadius: "50%",
                        padding: "3px",
                        cursor: "pointer",
                        zIndex: 1,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData({ ...formData, advertise_file: null });
                        setImagePreview(null);
                      }}
                    >
                      <FaTimes color="white" size={14} />
                    </div>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </>
                ) : (
                  <>
                    <FaPlus />
                    <span className="ms-2">Add Logo</span>
                  </>
                )}
              </div>
            </FormGroup>

            <FormGroup>
              <Label for="message">Message</Label>
              <Input
                className="customInput"
                type="textarea"
                id="message"
                rows="4"
                placeholder="Write your message..."
                value={formData.message}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
          </Form>
        </ModalBody>

        <ModalFooter
          className="d-flex justify-content-between gap-2"
          style={{ backgroundColor: "#212121" }}
        >
          <Button
            style={{ flex: 1, background: "#fff", color: "#000" }}
            onClick={toggle}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            color="danger"
            style={{ flex: 1 }}
            onClick={handleSubmit}
            disabled={isLoading || !isFormValid()}
          >
            {isLoading ? <Spinner size="sm" /> : "Submit"}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Navbar;