import React from 'react';
import { motion } from 'framer-motion';
import Footer from '../common/Footer';
import { useLocation } from 'react-router-dom';
import { fadeInUp, scaleUp, staggerContainer } from '../utils/animations';

function Snapshots() {
  const { state } = useLocation();
  const slide = state?.slide || {};

  return (
    <>
      <div style={{ backgroundColor: "#1B1B1B" }} className="overflow-hidden">
        <div className="container px-3 px-md-4">
          <motion.div
            className="text-white"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h2 variants={fadeInUp} className="text-white pt-4 pt-md-5 mb-3">
              Snapshot
            </motion.h2>
            <motion.img
              variants={scaleUp}
              src={slide.image || slide.file}
              alt="..."
              className="rounded-3 my-3 w-100 object-fit-cover"
              style={{ maxHeight: "420px", minHeight: "220px" }}
            />
            <motion.h2 variants={fadeInUp} className="text-white fw-bold mb-4">
              {slide.author || `${slide.first_name || ""} ${slide.last_name || ""}`}
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="pb-5 mb-0 lh-lg"
              style={{ color: '#BBBBBB' }}
            >
              {slide.title || slide.comment}
            </motion.p>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Snapshots;
