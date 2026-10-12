import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { BASEURL } from '../Constant/API';
import ImageComponent from '../components/ImageComponent';
import Footer from '../common/Footer';
import { ShimmerThumbnail } from 'react-shimmer-effects';
import { fadeInUp, staggerContainer } from '../utils/animations';

function Sponsors() {
  const [sponsorData, setSponsorData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsorData = async () => {
      try {
        const response = await axios.get(`${BASEURL}/main/home`);
        setSponsorData(response.data.data.sponsors);
      } catch (error) {
        console.error('Error fetching sponsor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsorData();
  }, []);

  return (
    <div style={{ backgroundColor: '#1B1B1B', minHeight: '100vh' }} className="overflow-hidden">
      <div className="container py-4 py-md-5 px-3 px-md-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center text-md-start"
        >
          <h2 className="text-white mb-3 mb-md-4">Sponsors</h2>
          <h5 className="mb-4 mb-md-5 lh-base" style={{ color: '#A4A4A4' }}>
            Meet the partners who share our vision and drive our ambitions forward. Their collaboration fuel our progress and innovation.
          </h5>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {(loading ? Array(3).fill({}) : sponsorData || []).map((post, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              className="row g-0 mb-4 rounded overflow-hidden shadow-sm"
            >
              <div
                className="col-12 col-sm-6 col-lg-3 d-flex align-items-center justify-content-center p-3"
                style={{ background: '#141414' }}
              >
                {loading ? (
                  <ShimmerThumbnail className="dark-shimmer" height={180} width={180} rounded />
                ) : (
                  <ImageComponent
                    src={post.company_logo}
                    alt={post.name}
                    shimmerHeight={189}
                    shimmerWidth={180}
                    width="180px"
                    height="180px"
                  />
                )}
              </div>
              <div
                className="col-12 col-sm-6 col-lg-3 d-flex flex-column justify-content-center align-items-center text-center p-4"
                style={{ background: '#101010' }}
              >
                {loading ? (
                  <>
                    <ShimmerThumbnail className="dark-shimmer" height={15} width={100} />
                    <ShimmerThumbnail className="dark-shimmer" height={15} width={100} />
                  </>
                ) : (
                  <>
                    <p className="mb-1" style={{ color: '#BE4E54' }}>Company Name</p>
                    <p className="text-white fw-bold mb-0 text-break">{post.name}</p>
                  </>
                )}
              </div>
              <div
                className="col-12 col-sm-6 col-lg-3 d-flex flex-column justify-content-center align-items-center text-center p-4"
                style={{ background: '#191919' }}
              >
                {loading ? (
                  <>
                    <ShimmerThumbnail className="dark-shimmer" height={15} width={100} />
                    <ShimmerThumbnail className="dark-shimmer" height={15} width={100} />
                  </>
                ) : (
                  <>
                    <p className="mb-1" style={{ color: '#BE4E54' }}>Website</p>
                    <p className="text-white fw-bold mb-0 text-break">{post.url}</p>
                  </>
                )}
              </div>
              <div
                className="col-12 col-sm-6 col-lg-3 d-flex flex-column justify-content-center align-items-center text-center p-4"
                style={{ background: '#101010' }}
              >
                {loading ? (
                  <>
                    <ShimmerThumbnail className="dark-shimmer" height={15} width={100} />
                    <ShimmerThumbnail className="dark-shimmer" height={15} width={100} />
                  </>
                ) : (
                  <>
                    <p className="mb-1" style={{ color: '#BE4E54' }}>Phone Number</p>
                    <p className="text-white fw-bold mb-0 text-break">{post.phone_number}</p>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

export default Sponsors;
