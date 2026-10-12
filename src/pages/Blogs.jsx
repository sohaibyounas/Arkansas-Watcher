import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import ImageComponent from "../components/ImageComponent";
import { FaArrowRight } from "react-icons/fa";
import { BASEURL } from "../Constant/API";
import { Link } from "react-router-dom";
import { ShimmerSectionHeader, ShimmerThumbnail } from "react-shimmer-effects";
import { fadeInUp, staggerContainer } from "../utils/animations";

function Blogs() {
  const [socialPost, setSocialPost] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASEURL}/main/home`);
        setSocialPost(response.data.data.posts);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div style={{ backgroundColor: "#1B1B1B" }} className="overflow-hidden">
      <div className="container py-4 py-md-5 px-3 px-md-4">
        <motion.h2
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-white text-center text-md-start mb-4"
        >
          Blog Post
        </motion.h2>
        <motion.div
          className="row g-4 justify-content-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {(loading ? Array(3).fill({}) : socialPost || []).map((post, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 260 }}
              className="col-12 col-md-6 col-lg-4"
            >
              <Link
                to="/blogdetail"
                state={{ post }}
                className="d-block text-decoration-none position-relative"
              >
                <div
                  className="rounded overflow-hidden shadow-sm"
                  style={{ backgroundColor: "#121212", height: "380px" }}
                >
                  <div className="overflow-hidden" style={{ height: "260px" }}>
                    {loading ? (
                      <ShimmerThumbnail
                        height={250}
                        width={360}
                        className="dark-shimmer w-100"
                      />
                    ) : (
                      <ImageComponent
                        src={post.image}
                        alt="..."
                        shimmerHeight={260}
                        shimmerWidth={400}
                      />
                    )}
                  </div>
                  <div className="text-white text-center py-3 px-2">
                    {loading ? (
                      <ShimmerSectionHeader center className="dark-shimmer" />
                    ) : (
                      <>
                        <p className="mb-1 fw-semibold small">{post.title}</p>
                        <p className="mb-0 small text-secondary">
                          {post.description?.split(" ").slice(0, 25).join(" ")}
                          {post.description?.split(" ").length > 25 ? "..." : ""}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div
                  className="bg-danger position-absolute d-flex align-items-center justify-content-center p-1 rounded"
                  style={{
                    width: "40px",
                    height: "40px",
                    top: "10px",
                    right: "10px",
                  }}
                >
                  <FaArrowRight className="text-white" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

export default Blogs;
