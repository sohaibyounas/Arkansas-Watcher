import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";
import NotifyBg from "../assets/images/NotifyBg.png";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import axios from "axios";
import { BASEURL } from "../Constant/API";
import { ShimmerThumbnail } from "react-shimmer-effects";
import { fadeInUp, staggerContainer } from "../utils/animations";

function Notification() {
  const [faq, setFaq] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState("");
  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };

  useEffect(() => {
    const fetchFaqData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASEURL}/main/faqs`);
        console.log(response.data);
        setFaq(response.data.data);
      } catch (error) {
        console.error("Error fetching FAQ data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqData();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <div
        className="min-vh-60 bg-cover bg-center position-relative d-flex align-items-center"
        style={{
          backgroundImage: `url(${NotifyBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "55vh",
        }}
      >
        <main className="container d-flex justify-content-center align-items-center py-5 px-3 px-md-4">
          <motion.div
            className="text-white text-center my-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h1 className="display-4 fw-bold mb-4">Notification Alerts</h1>
            <p
              className="mx-auto mb-0 fs-6 fs-md-5 lh-lg"
              style={{ maxWidth: "950px", color: "#B3BFB2" }}
            >
              Stay informed and prepared for weather events with Arkansas
              Weather Watchers! Subscribe now to receive timely notifications
              straight to your inbox or mobile device. Whether it's severe
              thunderstorms, tornado warnings, or updates on local weather
              conditions, our notifications will keep you informed and safe.
              We'll send out alerts when we're live on our social media
              platforms, so you can join us for real-time updates and
              discussions.
            </p>
          </motion.div>
        </main>
      </div>
      {/* Hero Section End */}

      <div className="text-white py-5" style={{ background: "#1B1B1B" }}>
        <main className="container max-w-4xl px-3 px-md-4">
          <motion.section
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {/* Main Title */}
            <motion.h1 variants={fadeInUp} className="display-5 fw-bold mb-4">
              Terms of Service for receiving Messages
            </motion.h1>

            {/* Introduction Text */}
            <motion.p variants={fadeInUp} className="text-warning fs-5 mb-5">
              By subscribing to Arkansas Weather Watchers' alert service, you
              agree to receive text messages regarding severe weather alerts,
              updates, and related information. Please read the following terms
              carefully:
            </motion.p>

            {/* Terms Sections */}
            <motion.div variants={fadeInUp} className="mb-4">
              <p>
                <strong className="text-white fs-5 d-block d-sm-inline me-sm-2">
                  Service Description
                </strong>{" "}
                Arkansas Weather Watchers, in partnership with FireTEXT®
                Dispatch Solutions, sends alerts via text messages to inform
                subscribers about severe weather events such as storms, tornado
                warnings, and other significant weather conditions.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="mb-4">
              <p>
                <strong className="text-white fs-5 d-block d-sm-inline me-sm-2">
                  Message Frequency
                </strong>{" "}
                Subscribers may receive multiple messages per day during severe
                weather events or when critical updates are issued by relevant
                authorities.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="mb-4">
              <p>
                <strong className="text-white fs-5 d-block d-sm-inline me-sm-2">
                  Message Content
                </strong>{" "}
                Text messages may include information about weather alerts,
                safety instructions, and notifications about Arkansas Weather
                Watchers' activities.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="mb-4">
              <p>
                <strong className="text-white fs-5 d-block d-sm-inline me-sm-2">
                  Cost
                </strong>{" "}
                Standard message and data rates may apply depending on your
                mobile service provider.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="mb-4">
              <p>
                <strong className="text-white fs-5 d-block d-sm-inline me-sm-2">
                  Opt-Out
                </strong>{" "}
                You can opt-out of receiving messages at any time by replying
                STOP to any message received from Arkansas Weather Watchers. You
                will no longer receive alerts after opting out, and your
                subscription will be terminated.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="mb-4">
              <p>
                <strong className="text-white fs-5 d-block d-sm-inline me-sm-2">
                  Privacy
                </strong>{" "}
                Your privacy is important to us. Arkansas Weather Watchers nor
                FireTEXT® Dispatch Solutions will not share your personal
                information with third parties without your consent, except as
                required by law.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="mb-4">
              <p>
                <strong className="text-white fs-5 d-block d-sm-inline me-sm-2">
                  Support
                </strong>{" "}
                For support or questions regarding the message service, please
                contact FireTEXT® Dispatch Solutions' support team at{" "}
                <a href="mailto:support@firetext.net" className="text-info">
                  support@firetext.net
                </a>
                .
              </p>
            </motion.div>

            {/* Final Notice */}
            <motion.p variants={fadeInUp} className="text-warning fs-5 mt-5">
              By subscribing to our alert service, you acknowledge that you have
              read, understood, and agree to these terms of service. For more
              information, visit our website or contact our support team.
            </motion.p>

            {/* Get Alerts Button */}
            <motion.div variants={fadeInUp} className="text-center mt-5">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="btn btn-danger btn-lg w-100"
                style={{ maxWidth: "400px" }}
              >
                Get Alerts
              </motion.button>
            </motion.div>
          </motion.section>
        </main>
      </div>

      <div className="text-white py-5" style={{ background: "#0F0F0F" }}>
        <motion.div
          className="container px-3 px-md-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeInUp}
        >
          <h3 className="mb-4 mb-md-5">Frequently Asked Questions?</h3>
          <Accordion flush open={open} toggle={toggle}>
            {loading
              ? Array(faq?.length || 5)
                  .fill()
                  .map((_, index) => (
                    <ShimmerThumbnail
                      key={`shimmer-${index}`}
                      height={60}
                      width="100%"
                      rounded
                      className="mb-3 dark-shimmer"
                      style={{ border: "1px solid #333" }}
                    />
                  ))
              : faq &&
                faq.map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    className="mb-3 border rounded bg-transparent text-white"
                  >
                    <AccordionHeader
                      targetId={faq.id}
                      className="albertsemibold"
                    >
                      <span
                        className="rounded text-center me-3 flex-shrink-0"
                        style={{
                          width: "25px",
                          height: "25px",
                          background: "#202020",
                          padding: "3px 0 0 0",
                        }}
                      >
                        {faq.id}
                      </span>
                      {faq.question}
                    </AccordionHeader>
                    <AccordionBody accordionId={faq.id} className="albertlight">
                      {faq.answer}
                    </AccordionBody>
                  </AccordionItem>
                ))}
          </Accordion>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

export default Notification;
