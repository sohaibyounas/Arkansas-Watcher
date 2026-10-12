import React from "react";
import { motion } from "framer-motion";
import ImageComponent from "./ImageComponent";
import { useNavigate } from "react-router-dom";
import { fadeInLeft, fadeInUp, staggerContainer } from "../utils/animations";

const Sponsor = ({ sponsors }) => {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex align-items-center mx-auto justify-content-center py-5 px-3 px-md-5 overflow-hidden"
      style={{ background: "#1B1B1B" }}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="bg-dark rounded-3 d-flex flex-column flex-lg-row justify-content-between overflow-hidden w-100"
        style={{ maxWidth: "80rem" }}
      >
        {/* Left Section */}
        <motion.div
          variants={fadeInLeft}
          className="text-white custom_width d-flex flex-column justify-content-center p-4 p-md-5"
        >
          <div className="w-100 mx-lg-0 mx-auto text-lg-start text-center" style={{ maxWidth: "460px" }}>
            <h2 className="fw-bold mb-3 mb-md-4 display-6 albertbold">
              Our Sponsors Around the State
            </h2>
            <p className="mb-0" style={{ color: "#A2A2A2" }}>
              Meet the partners who share our vision and drive our ambitions
              forward. Their collaboration fuels our progress and innovation.
            </p>
          </div>
        </motion.div>

        {/* Right Section (Sponsor Grid) */}
        <div className="row custom_width g-0 px-0 px-lg-3 m-0">
          {sponsors &&
            sponsors?.map((item, index) => (
              <motion.div
                className="col-sm-6 col-12 p-1"
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/sponsors")}
              >
                <div
                  className="d-flex align-items-center bg-dark justify-content-center rounded overflow-hidden"
                  style={{ height: "160px" }}
                >
                  <ImageComponent
                    src={item?.company_logo}
                    alt="Natural State Wireless"
                    shimmerHeight={160}
                    shimmerWidth={300}
                  />
                </div>
              </motion.div>
            ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Sponsor;
