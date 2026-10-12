import { useEffect, useState } from "react"; // Add this with other imports
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/css/Responsive.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Weather from "./pages/Weather";
import Notification from "./pages/Notification";
import Contact from "./pages/Contact";
import Navbar from "./common/Navbar";
import { IoMdArrowRoundUp } from "react-icons/io";
import Blogs from "./pages/Blogs";
import Sponsors from "./pages/Sponsors";
import BlogDetail from "./pages/BlogDetail";
import Snapshots from "./pages/Snapshots";
import LiveCam from "./pages/LiveCam";
import { pageTransition } from "./utils/animations";

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/alert" element={<Notification />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogdetail" element={<BlogDetail />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/snapshots" element={<Snapshots />} />
          <Route path="/livecam" element={<LiveCam />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setShowBtn(window.scrollY > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Router>
      <Navbar />
      <AnimatedRoutes />

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showBtn && (
          <motion.button
            id="scrollTopBtn"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.25 }}
            className="btn text-white scroll-top-btn d-flex align-items-center justify-content-center"
          >
            <IoMdArrowRoundUp />
          </motion.button>
        )}
      </AnimatePresence>
    </Router>
  );
}

export default App;
