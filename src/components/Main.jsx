import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../common/Navbar";
import HomeBg from "../assets/images/home_bg.svg";
import sun from "../assets/images/sun.svg";
import sunCloud from "../assets/images/sun_cloud.svg";
import { BASEURL } from "../Constant/API";
import ImageComponent from "./ImageComponent";
import { fadeInLeft, fadeInRight, scaleUp, staggerContainer } from "../utils/animations";

function Main({
  topSponsor,
  weatherData,
  weatherLoading,
  presentLocation,
}) {
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);

  // Get alerts array safely
  const alerts = weatherData?.alerts?.alert || [];
  const hasAlerts = alerts.length > 0;

  // Auto-rotate alerts every 5 seconds
  useEffect(() => {
    if (hasAlerts && alerts.length > 1) {
      const interval = setInterval(() => {
        setCurrentAlertIndex((prevIndex) => (prevIndex + 1) % alerts.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [hasAlerts, alerts.length]);

  // Current alert data
  const currentAlert = hasAlerts ? alerts[currentAlertIndex] : null;

  return (
    <>
      <style>{`
        .alert-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          background-color: rgba(255, 91, 99, 0.2);
          border: 1px solid rgba(255, 91, 99, 0.4);
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
          margin-bottom: 12px;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .alert-content {
          position: relative;
          min-height: 120px;
        }
      `}</style>

      <div className="home min-vh-80 overflow-hidden">
        <main className="container py-4 py-md-5 px-3 px-md-4">
          <motion.div
            className="row gy-4 align-items-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {/* Left Column - Text Content with Weather Alerts */}
            <motion.div className="col-lg-6 col-md-12" variants={fadeInLeft}>
              <div className="text-white pb-2 pb-lg-4 px-2 px-md-4 text-center text-lg-start">
                <h5 className="mb-3 mb-md-4 d-flex align-items-center justify-content-center justify-content-lg-start">
                  <div
                    className="bg-white"
                    style={{ width: "1.5rem", height: "2px" }}
                  ></div>
                  <span className="ms-2">Arkansas Weather Watcher</span>
                </h5>
                <h2 className="fw-bold mb-4 mb-md-5 albertbold display-6">
                  Your Go-To Source for All Things Weather in Arkansas!
                </h2>

                {/* Weather Alerts Section */}
                <div className="alert-content position-relative">
                  <AnimatePresence mode="wait">
                    {hasAlerts ? (
                      <motion.div
                        key={currentAlertIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35 }}
                      >
                        <div className="alert-badge">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="me-1"
                          >
                            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                          </svg>
                          Alert {currentAlertIndex + 1} of {alerts.length}
                        </div>

                        <h5
                          className="albertmedium mb-3"
                          style={{ lineHeight: "1.4" }}
                        >
                          {currentAlert.headline}
                        </h5>

                        <p
                          className="mb-4 albertregular"
                          style={{
                            color: "#D3D1D2",
                            lineHeight: "1.5",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {currentAlert.desc}
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="no-alerts"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                      >
                        <h5 className="albertmedium mb-3">
                          No Active Weather Alerts
                        </h5>
                        <p
                          className="mb-4 albertregular"
                          style={{ color: "#D3D1D2" }}
                        >
                          Currently, there are no weather alerts for Arkansas.
                          Stay tuned for the latest weather updates and warnings.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-lg px-4 text-white"
                  style={{ backgroundColor: "#FF5B63" }}
                >
                  {hasAlerts ? "View Full Alert" : "Learn more"}
                </motion.button>
              </div>
            </motion.div>

            {/* Middle Column - Weather Card */}
            <motion.div
              className="col-lg-3 col-md-6 col-sm-12 d-flex justify-content-center align-items-center"
              variants={scaleUp}
            >
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 250 }}
                className="position-relative w-100 mx-auto my-2"
                style={{ maxWidth: "305px" }}
              >
                <div
                  className="position-absolute rounded-3 opacity-50"
                  style={{
                    top: "-1px",
                    left: "3px",
                    width: "calc(100% - 6px)",
                    height: "100%",
                    background:
                      "linear-gradient(to bottom left, #E9B851, #BE4E54)",
                    transform: "rotate(6deg)",
                  }}
                ></div>
                <div
                  className="position-relative rounded-3 p-4 text-white"
                  style={{
                    width: "100%",
                    maxWidth: "305px",
                    background:
                      "linear-gradient(to bottom left, #E9B851, #BE4E54)",
                  }}
                >
                  <div className="text-center">
                    {presentLocation ? (
                      <h5 className="text-white fw-bold">{presentLocation}</h5>
                    ) : (
                      <h2 className="fs-2 mb-1">Arkansas</h2>
                    )}
                    <p className="mb-2">
                      Chances of Rain:{" "}
                      <span id="rainChances">
                        {
                          weatherData?.forecast?.forecastday[0]?.day
                            ?.daily_chance_of_rain
                        }
                        %
                      </span>
                    </p>
                    {weatherLoading ? (
                      <h2 className="fw-bold" style={{ fontSize: "52px" }}>
                        {" "}
                        -{" "}
                      </h2>
                    ) : (
                      <h2 className="fw-bold" style={{ fontSize: "52px" }}>
                        {weatherData?.current?.temp_f}°f
                      </h2>
                    )}
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <div className="text-center">
                      <img
                        src={sunCloud}
                        alt="Min Temp"
                        className="mx-auto"
                        style={{ width: "28px", height: "28px" }}
                      />
                      <div className="d-flex align-items-center justify-content-center mt-1">
                        <svg
                          style={{ width: "12px", height: "12px" }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                          />
                        </svg>
                        <p className="ms-1 mb-0 small">Min Temp</p>
                      </div>
                      {weatherLoading ? (
                        <p id="minTemp" className="mb-0 mt-1"> -</p>
                      ) : (
                        <p id="minTemp" className="mb-0 mt-1 fw-semibold">
                          {weatherData?.forecast?.forecastday[0]?.day.mintemp_f}
                        </p>
                      )}
                    </div>
                    <div className="text-center">
                      <img
                        src={sun}
                        alt="Max Temp"
                        className="mx-auto"
                        style={{ width: "28px", height: "28px" }}
                      />
                      <div className="d-flex align-items-center justify-content-center mt-1">
                        <svg
                          style={{ width: "12px", height: "12px" }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                          />
                        </svg>
                        <p className="ms-1 mb-0 small">Max Temp</p>
                      </div>
                      {weatherLoading ? (
                        <p className="mb-0 mt-1"> - </p>
                      ) : (
                        <p className="mb-0 mt-1 fw-semibold">
                          {weatherData?.forecast?.forecastday[0]?.day.maxtemp_f}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Image */}
            <motion.div
              className="col-lg-3 col-md-6 col-sm-12 d-flex justify-content-center"
              variants={fadeInRight}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-danger bg-opacity-25 border border-danger rounded d-flex align-items-center justify-content-center overflow-hidden mx-auto"
                style={{ width: "100%", maxWidth: "305px", minHeight: "310px" }}
              >
                <ImageComponent
                  src={topSponsor?.company_logo}
                  alt="Arkansas Weather"
                  shimmerHeight={310}
                  shimmerWidth={300}
                  rounded="rounded"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </>
  );
}

export default Main;
