import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import facebook1 from "../assets/images/facebook1.svg";
import facebook2 from "../assets/images/facebook2.svg";
import facebook3 from "../assets/images/facebook3.svg";
import ImageComponent from "./ImageComponent";
import like from "../assets/images/like.png";
import love from "../assets/images/love.png";
import shock from "../assets/images/shock.png";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment, FaWhatsapp } from "react-icons/fa";
import { PiShareFatLight } from "react-icons/pi";
import { HiDotsHorizontal } from "react-icons/hi";
import { fadeInUp } from "../utils/animations";

// Fallback slides
const fallbackSlides = [
  { image: facebook1, message: "Fallback Image 1" },
  { image: facebook2, message: "Fallback Image 2" },
  { image: facebook3, message: "Fallback Image 3" },
];

// Arrow components
const NextArrow = ({ onClick }) => (
  <div
    className="position-absolute top-50 p-2 z-1 cursor-pointer customrightArrow"
    onClick={onClick}
  >
    <IoIosArrowForward style={{ color: "#ffffff", fontSize: "32px" }} />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="position-absolute top-50 p-2 z-1 customleftArrow"
    onClick={onClick}
  >
    <IoIosArrowBack style={{ color: "#ffffff", fontSize: "32px" }} />
  </div>
);

function FacebookSlider({ facebookToken, pageId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Facebook posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // First, fetch basic page information including the profile picture
        const pageInfoResponse = await axios.get(
          `https://graph.facebook.com/v19.0/${pageId}`,
          {
            params: {
              access_token: facebookToken,
              fields: "name,picture{url}",
            },
          }
        );

        // Then fetch posts with engagement metrics
        const postsResponse = await axios.get(
          `https://graph.facebook.com/v19.0/${pageId}/posts`,
          {
            params: {
              access_token: facebookToken,
              fields:
                "message,full_picture,created_time,permalink_url,likes.limit(0).summary(true),comments.limit(0).summary(true),shares",
              limit: 10, // Fetch up to 10 posts
            },
          }
        );

        const fetchedPosts = postsResponse.data.data
          .filter((post) => post.full_picture || post.message) // Include posts with either image or message
          .map((post) => ({
            pageName: pageInfoResponse.data.name,
            pagePicture: pageInfoResponse.data.picture?.data?.url || facebook1,
            image: post.full_picture || facebook1, // Fallback image if no picture
            message: post.message || "Facebook post",
            created_time: post.created_time,
            url: post.permalink_url || `https://www.facebook.com/${pageId}`,
            likesCount: post.likes?.summary?.total_count || 0,
            commentsCount: post.comments?.summary?.total_count || 0,
            sharesCount: post.shares?.count || 0,
          }));

        setPosts(fetchedPosts);
        setLoading(false);
      } catch (err) {
        console.error(
          "Error fetching Facebook data:",
          err.response?.data || err.message
        );
        setLoading(false);
      }
    };

    fetchPosts();
  }, [facebookToken, pageId]);

  const formatFacebookTime = (isoString) => {
    if (!isoString) return "";
    const now = new Date();
    const postTime = new Date(isoString);
    const seconds = Math.floor((now - postTime) / 1000);

    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

    return postTime.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 578,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div
      className="position-relative py-5 overflow-hidden"
      style={{ backgroundColor: "#0F0F0F" }}
    >
      <motion.div
        className="container px-4 px-md-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={fadeInUp}
      >
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 px-0 mb-4 mb-md-5">
          <h1 className="mb-0 text-white fw-bold text-center text-sm-start fs-2 fs-md-1">
            Our Facebook Page
          </h1>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={`https://www.facebook.com/profile.php?id=${pageId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary px-4 py-2 fs-6 fs-md-5 rounded"
          >
            Follow Page
          </motion.a>
        </div>

        {loading ? (
          <div className="text-white text-center py-4">Loading posts...</div>
        ) : (
          <Slider {...settings}>
            {(posts.length > 0 ? posts : fallbackSlides).map((post, index) => (
              <div key={index} className="px-2">
                <div
                  className="bg-white rounded d-flex flex-column justify-content-between overflow-hidden"
                  style={{ minHeight: "410px" }}
                >
                  <div>
                    <div className="d-flex align-items-center justify-content-between px-3 pb-2 pt-3">
                      <div className="d-flex align-items-center">
                        <img
                          src={post?.pagePicture || facebook1}
                          alt="..."
                          className="rounded-circle object-fit-cover"
                          style={{ width: "44px", height: "44px" }}
                        />
                        <div className="d-flex flex-column ms-2">
                          <h5 className="mb-0 text-dark" style={{ fontSize: "15px" }}>
                            {post?.pageName || "Arkansas Weather Watchers"}
                          </h5>
                          <p className="mb-0 small" style={{ color: "#606060" }}>
                            {formatFacebookTime(post.created_time)}
                          </p>
                        </div>
                      </div>
                      <HiDotsHorizontal className="text-dark" />
                    </div>
                    <p
                      className="px-3 lh-sm text-dark small mb-2"
                      style={{ minHeight: "38px" }}
                    >
                      {post.message.length > 95
                        ? `${post.message.substring(0, 95)}...`
                        : post.message}
                    </p>
                    <img
                      src={post.image}
                      alt="..."
                      className="object-fit-cover w-100"
                      style={{ height: "220px" }}
                    />
                  </div>
                  <div>
                    <div className="px-3 pt-2 d-flex justify-content-between align-items-center text-dark">
                      <div className="d-flex align-items-center">
                        <img src={like} alt="..." />
                        <img src={love} alt="..." />
                        <img src={shock} alt="..." />
                        <small className="ms-1">{post?.likesCount || 0}</small>
                      </div>
                      <div className="d-flex">
                        <small className="me-2">
                          {post?.commentsCount || 0} Comments
                        </small>
                        <small>{post?.sharesCount || 0} Shares</small>
                      </div>
                    </div>
                    <hr className="my-2" />
                    <div className="d-flex justify-content-around align-items-center flex-wrap gap-2 px-2 pb-3 small">
                      <div
                        className="d-flex align-items-center gap-1"
                        style={{ color: "#5A5A5A" }}
                      >
                        <AiOutlineLike style={{ color: "#5A5A5A" }} />
                        <span>Like</span>
                      </div>
                      <div
                        className="d-flex align-items-center gap-1"
                        style={{ color: "#5A5A5A" }}
                      >
                        <FaRegComment style={{ color: "#5A5A5A" }} />
                        <span>Comment</span>
                      </div>
                      <div
                        className="d-flex align-items-center gap-1"
                        style={{ color: "#5A5A5A" }}
                      >
                        <FaWhatsapp style={{ color: "#5A5A5A" }} />
                        <span>Send</span>
                      </div>
                      <div
                        className="d-flex align-items-center gap-1"
                        style={{ color: "#5A5A5A" }}
                      >
                        <PiShareFatLight style={{ color: "#5A5A5A" }} />
                        <span>Share</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </motion.div>
    </div>
  );
}

export default FacebookSlider;