import React from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import snapshot1 from "../assets/images/snapshot1.svg";
import snapshot2 from "../assets/images/snapshot2.svg";
import snapshot3 from "../assets/images/snapshot3.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaArrowRight } from "react-icons/fa";
import ImageComponent from "./ImageComponent";
import { useNavigate } from "react-router-dom";
import { fadeInUp, staggerContainer } from "../utils/animations";

const slides = [
  {
    image: snapshot1,
    title: "Beautiful Snowy Scene in Ozark, AR",
    description:
      "Flooding is one the most common and dangerous natural disaster often underestimated until its too late. Floods can occur due to heavy rainfall, storm...",
  },
  {
    image: snapshot2,
    title: "Beautiful Snowy Scene in Ozark, AR",
    description:
      "Flooding is one the most common and dangerous natural disaster often underestimated.",
  },
  {
    image: snapshot3,
    title: "Beautiful Snowy Scene in Ozark, AR",
    description:
      "Flooding is one the most common and dangerous natural disaster often underestimated until its too late. .",
  },
];

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="position-absolute top-50 p-2 z-1 cursor-pointer customrightArrow"
      onClick={onClick}
    >
      <IoIosArrowForward style={{ color: "#ffffff", fontSize: "32px" }} />
    </div>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="position-absolute top-50 p-2 z-1 customleftArrow"
      onClick={onClick}
    >
      <IoIosArrowBack style={{ color: "#ffffff", fontSize: "32px" }} />
    </div>
  );
};

// Reusable card component for blog posts
const BlogCard = ({ post, index, onClicked }) => (
  <motion.div
    whileHover={{ y: -6 }}
    transition={{ type: "spring", stiffness: 260 }}
    className="px-2 position-relative"
  >
    <div
      className="rounded overflow-hidden shadow-sm"
      onClick={onClicked}
      style={{
        backgroundColor: "#121212",
        height: "380px",
        cursor: onClicked ? "pointer" : "auto",
      }}
    >
      <div className="overflow-hidden" style={{ height: "260px" }}>
        <ImageComponent
          src={post.image}
          alt="..."
          shimmerHeight={260}
          shimmerWidth={400}
        />
      </div>
      <div className="text-white text-center py-3 px-2">
        <p className="mb-1 fw-semibold small">{post.title}</p>
        <p className="mb-0 pb-2 small text-secondary">
          {post.description.split(" ").slice(0, 24).join(" ")}
          {post.description.split(" ").length > 24 ? "..." : ""}
        </p>
      </div>
    </div>
    <div
      className="bg-danger position-absolute d-flex align-items-center justify-content-center p-1 rounded"
      style={{ width: "40px", height: "40px", top: "10px", right: "20px" }}
    >
      <FaArrowRight className="text-white" />
    </div>
  </motion.div>
);

function Blog({ socialPost }) {
  const navigate = useNavigate();
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

  // Determine which data to use
  const displayData = socialPost && socialPost.length > 0 ? socialPost : slides;

  // Check if slider is needed (more than 3 items)
  const useSlider = displayData.length > 3;

  return (
    <div
      className="position-relative py-5 overflow-hidden"
      style={{ backgroundColor: "#1B1B1B" }}
    >
      <motion.div
        className="container px-4 px-md-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
      >
        <motion.h1
          variants={fadeInUp}
          className="text-white fw-bold text-center text-md-start fs-2 fs-md-1 mb-4 mb-md-5"
        >
          Blog Posts
        </motion.h1>

        {useSlider ? (
          <Slider {...settings}>
            {displayData.map((post, index) => (
              <BlogCard
                post={post}
                index={index}
                key={index}
                onClicked={() => navigate("/blogs")}
              />
            ))}
          </Slider>
        ) : (
          <div className="row g-4 justify-content-center">
            {displayData.map((post, index) => (
              <motion.div
                className="col-lg-4 col-md-6 col-12"
                key={index}
                variants={fadeInUp}
              >
                <BlogCard
                  post={post}
                  index={index}
                  onClicked={() => navigate("/blogs")}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Blog;