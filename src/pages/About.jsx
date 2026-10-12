import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import aboutMission from '../assets/images/aboutmission.svg';
import aboutVision from '../assets/images/aboutvission.svg';
import aboutBg from '../assets/images/aboutBg.png';
import Navbar from '../common/Navbar';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from '../common/Footer';
import team1 from '../assets/images/team-1.jpg';
import team2 from '../assets/images/team-2.jpg';
import team3 from '../assets/images/team-3.jpg';
import { BASEURL } from '../Constant/API';
import axios from 'axios';
import { ShimmerThumbnail } from 'react-shimmer-effects';
import ImageComponent from '../components/ImageComponent';
import { fadeInUp, fadeInLeft, fadeInRight, scaleUp } from '../utils/animations';

// Fallback team members if API fails or returns too few items
const fallbackTeamMembers = [
  {
    name: 'Sarah Johnson',
    designation: 'Chief Meteorologist',
    image: team1
  },
  {
    name: 'Cameron Barnes',
    designation: 'Vice President, Producer, Chief Forecaster',
    image: team2
  },
  {
    name: 'Michelle Lee',
    designation: 'Storm Tracker',
    image: team3
  },
  {
    name: 'Robert Wilson',
    designation: 'Senior Weather Analyst',
    image: team1
  },
  {
    name: 'Jessica Adams',
    designation: 'Community Outreach Director',
    image: team2
  }
];

function About() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASEURL}/main/teams`);
        // Check if we have enough team members, if not use fallback
        const teamData = response.data.data;
        if (teamData && teamData.length >= 3) {
          setTeam(teamData);
        } else {
          // If API returns fewer than 3 items, duplicate them or use fallback
          const enhancedTeam = teamData && teamData.length > 0 
            ? [...teamData, ...teamData, ...teamData].slice(0, 5) // Duplicate existing items
            : fallbackTeamMembers;
          setTeam(enhancedTeam);
        }
      } catch (error) {
        console.error("Error fetching team data:", error);
        setTeam(fallbackTeamMembers); // Use fallback data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);
  
  // Calculate optimal slidesToShow based on team length
  const getSlidesToShow = (teamLength) => {
    if (teamLength < 2) return 1;
    if (teamLength < 3) return 2;
    return 3;
  };

  // Dynamic slider settings based on team length
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: getSlidesToShow(team.length),
    slidesToScroll: 1,
    centerMode: team.length >= 3,
    centerPadding: '0',
    focusOnSelect: true,
    beforeChange: (current, next) => setActiveSlide(next),
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: Math.min(2, team.length),
          centerMode: false
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: '5%'
        }
      }
    ]
  };

  return (
    <>
      {/* Hero Section */}
      <div 
        className="position-relative d-flex align-items-center overflow-hidden"
        style={{
          backgroundImage: `url(${aboutBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '60vh'
        }}
      >
        <main className="container mx-auto py-5 px-3 px-md-4 d-flex justify-content-center align-items-center">
          <motion.div
            className="text-white text-center my-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h1 className="display-4 fw-bold mb-4">About Us</h1>
            <p
              className="mx-auto mb-0 fw-medium fs-6 fs-md-5 lh-lg"
              style={{ maxWidth: '64rem', color: '#BBB6B6' }}
            >
              Welcome to Arkansas Weather Watchers, your trusted source for comprehensive weather updates 
              across Arkansas. Whether you're preparing for severe weather or planning your week, we've 
              got you covered. Our team is dedicated to bringing you the most accurate and up-to-date 
              weather information available.
            </p>
          </motion.div>
        </main>
      </div>

      {/* Our Mission Section */}
      <section 
        className="min-vh-50 d-flex align-items-center py-5 overflow-hidden"
        style={{ backgroundColor: '#1B1B1B' }}
      >
        <div className="container px-3 px-md-4">
          <div className="row gy-4 align-items-center justify-content-between text-center text-lg-start">
            <motion.div
              className="col-lg-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInLeft}
            >
              <h2 className="text-white display-5 fw-bold mb-3 mb-md-4">Our Mission</h2>
              <p className="lead mb-0" style={{ lineHeight: '2rem', color: '#BBB6B6' }}>
                At Arkansas Weather Watchers, our mission is to provide the most accurate
                and timely weather information to the people of Arkansas. We are dedicated
                to enhancing public safety and preparedness through comprehensive
                weather updates, live storm coverage, and community engagement.
              </p>
            </motion.div>
            <motion.div
              className="col-lg-4 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={scaleUp}
            >
              <motion.img 
                whileHover={{ rotate: 12, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
                src={aboutMission}
                alt="Settings Icon"
                className="img-fluid"
                style={{ maxWidth: '12rem', height: 'auto' }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section 
        className="min-vh-50 d-flex align-items-center py-5 overflow-hidden"
        style={{ backgroundColor: '#0F0F0F' }}
      >
        <div className="container px-3 px-md-4">
          <div className="row gy-4 align-items-center justify-content-between text-center text-lg-start">
            <motion.div
              className="col-lg-4 text-center order-lg-1 order-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={scaleUp}
            >
              <motion.img 
                whileHover={{ scale: 1.06 }}
                transition={{ type: "spring", stiffness: 200 }}
                src={aboutVision}
                alt="Bulb Icon"
                className="img-fluid"
                style={{ maxWidth: '12rem', height: 'auto' }}
              />
            </motion.div>
            <motion.div
              className="col-lg-8 order-lg-2 order-1"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInRight}
            >
              <h2 className="text-white display-5 fw-bold mb-3 mb-md-4">Our Vision</h2>
              <p className="lead mb-0" style={{ lineHeight: '2rem', color: '#BBB6B6' }}>
                Our vision is to ensure that every Arkansan can stay ahead of the weather, making 
                informed decisions to protect themselves, their families, and their properties.
                By leveraging advanced meteorological tools and fostering a connected, informed 
                community, we strive to be the trusted source for all things weather-related in Arkansas.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section with Elevated Center Slide */}
      <section className="py-5 overflow-hidden" style={{ backgroundColor: '#1B1B1B' }}>
        <div className="container px-3 px-md-4">
          <div className="row gy-4 align-items-center">
            <motion.div
              className="col-lg-5 text-center text-lg-start"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInLeft}
            >
              <div className="pt-lg-4">
                <h2 className="text-white display-5 fw-bold mb-3 mb-md-4">Meet our Team</h2>
                <p className="mb-0" style={{ color: '#BBB6B6' }}>
                  Meet the talented individuals whose passion and expertise fuel 
                  our success. Each one brings something unique to the table.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              className="col-lg-7"
              style={{ minHeight: '460px' }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInRight}
            > 
              {loading ? (
                <div className="d-flex flex-wrap justify-content-center align-items-center gap-3 mt-3">
                  {Array(3)
                    .fill()
                    .map((_, index) => (
                      <ShimmerThumbnail
                        key={`shimmer-${index}`}
                        height={350}
                        width={200}
                        rounded
                        className="dark-shimmer"
                        style={{ border: "1px solid #333", flexShrink: 0 }}
                      />
                    ))}
                </div>
              ) : (
                <div className="elevated-slider-container position-relative" style={{ padding: "30px 0" }}>
                  {team.length > 0 ? (
                    <Slider {...sliderSettings} className="elevated-slider">
                      {team.map((member, index) => (
                        <div key={index} className="px-2">
                          <div 
                            className="team-slide position-relative transition-all rounded-3" 
                            style={{
                              height: activeSlide === index % team.length ? '430px' : '370px',
                              transform: activeSlide === index % team.length ? 'translateY(-15px)' : 'translateY(0)',
                              transition: 'all 0.3s ease',
                              overflow: 'hidden'
                            }}
                          >
                            <ImageComponent
                              src={member.image}
                              alt={member.name || "..."}
                              shimmerHeight={300}
                              shimmerWidth={220}
                            />
                            <div 
                              className="position-absolute bottom-0 left-0 p-3 text-white" 
                              style={{ 
                                width: '100%',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))'
                              }}
                            >
                              <h5 className="mb-1 fw-bold">{member.name}</h5>
                              <p className="mb-0 small">{member.designation}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </Slider>
                  ) : (
                    <div className="text-center py-5 text-white">
                      <p>No team members found.</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />

      {/* custom CSS for the slider */}
      <style>{`
        .elevated-slider .slick-slide {
          transition: all 0.3s ease;
          opacity: 0.7;
        }
        
        .elevated-slider .slick-center .team-slide {
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
        }
        
        /* Fade effect for non-active slides */
        .elevated-slider .slick-slide.slick-active {
          opacity: 1;
        }
        
        .elevated-slider .slick-slide.slick-center {
          opacity: 1;
        }

        /* Custom dots styling */
        .elevated-slider .slick-dots {
          bottom: -40px;
        }

        .elevated-slider .slick-dots li button:before {
          color: white;
          opacity: 0.5;
        }

        .elevated-slider .slick-dots li.slick-active button:before {
          opacity: 1;
          color: white;
        }

        /* Custom arrow positioning */
        .elevated-slider .slick-prev, 
        .elevated-slider .slick-next {
          z-index: 1;
          width: 40px;
          height: 40px;
          top: 50%;
          transform: translateY(-50%);
        }
        
        .elevated-slider .slick-prev {
          left: -15px;
        }
        
        .elevated-slider .slick-next {
          right: -15px;
        }
        
        /* Ensure slides are visible even with few items */
        .elevated-slider .slick-track {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Fix for centerMode with few items */
        .elevated-slider.slick-slider {
          margin: 0 auto;
          max-width: 92%;
        }
      `}</style>
    </>
  );
}

function CustomNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ 
        ...style, 
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(255, 255, 255, 0.2)",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        cursor: "pointer"
      }}
      onClick={onClick}
    >
      <span className="carousel-control-next-icon" aria-hidden="true"></span>
    </div>
  );
}

function CustomPrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ 
        ...style, 
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(255, 255, 255, 0.2)",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        cursor: "pointer"
      }}
      onClick={onClick}
    >
      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    </div>
  );
}

export default About;