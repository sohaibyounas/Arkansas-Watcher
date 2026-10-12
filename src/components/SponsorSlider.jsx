import React from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import snapshot1 from "../assets/images/snapshot1.svg";
import snapshot2 from "../assets/images/snapshot2.svg";
import snapshot3 from "../assets/images/snapshot3.svg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import ImageComponent from "./ImageComponent";
import { Link } from "react-router-dom";
import { fadeInUp, staggerContainer } from "../utils/animations";

const slides = [
  {
    image: snapshot1,
    title: "Beautiful Snowy Scene in Ozark, AR",
    author: "Sarah Elizabeth Ball",
  },
  {
    image: snapshot2,
    title: "Beautiful Snowy Scene in Ozark, AR",
    author: "Sarah Elizabeth Ball",
  },
  {
    image: snapshot3,
    title: "Beautiful Snowy Scene in Ozark, AR",
    author: "Sarah Elizabeth Ball",
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

// Reusable card component for sponsor slides
const SponsorCard = ({ slide, isSnapshot = false }) => (
  <Link to="/snapshots" state={{ slide }} className="px-2 d-block text-decoration-none">
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260 }}
      className="rounded overflow-hidden shadow-sm"
      style={{ backgroundColor: "#121212", height: "360px" }}
    >
      <div className="overflow-hidden" style={{ height: "260px" }}>
        <ImageComponent
          src={isSnapshot ? `${slide.file}` : slide.image}
          alt="..."
          shimmerHeight={260}
          shimmerWidth={400}
        />
      </div>
      <div className="text-white text-center py-3 px-2">
        <p className="mb-1 fw-semibold small">
          {isSnapshot
            ? `${slide.comment.split(" ").slice(0, 30).join(" ")}${
                slide.comment.split(" ").length > 30 ? "..." : ""
              }`
            : slide.title}
        </p>
        <p className="mb-0 small text-secondary">
          {isSnapshot ? `${slide.first_name} ${slide.last_name}` : slide.author}
        </p>
      </div>
    </motion.div>
  </Link>
);

function SponsorSlider({ snapshots }) {
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
  const displayData = snapshots && snapshots.length > 0 ? snapshots : slides;

  // Check if slider is needed (more than 3 items)
  const useSlider = displayData.length > 3;

  // Check if we're using snapshots or default slides
  const isUsingSnapshots = snapshots && snapshots.length > 0;

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
        {useSlider ? (
          <Slider {...settings}>
            {displayData.map((slide, index) => (
              <SponsorCard
                key={index}
                slide={slide}
                isSnapshot={isUsingSnapshots}
              />
            ))}
          </Slider>
        ) : (
          <div className="row g-4 justify-content-center">
            {displayData.map((slide, index) => (
              <motion.div
                className="col-lg-4 col-md-6 col-12"
                key={index}
                variants={fadeInUp}
              >
                <SponsorCard slide={slide} isSnapshot={isUsingSnapshots} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default SponsorSlider;
