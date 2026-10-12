import React from 'react';
import { motion } from 'framer-motion';
import Footer from '../common/Footer';
import { fadeInUp, staggerContainer } from '../utils/animations';

const webcamStreams = [
  {
    src: "https://hazcams.com/station/siloam-springs-ar-us-001",
    title: "Siloam Springs Webcam",
  },
  {
    src: "https://hazcams.com/station/helena-ar-us-001",
    title: "Helena Webcam",
  },
  {
    src: "https://hazcams.com/station/el-dorado-ar-us-001",
    title: "El Dorado Webcam",
  },
  {
    src: "https://hazcams.com/station/stuttgart-ar-us-001",
    title: "Stuttgart Webcam",
  },
  {
    src: "https://embed.wowza.com/api/video/embed.jsp?id=7mrxztvs&pi=d7cc1ce4-7e69-472c-a96c-608e9a8b39d6",
    title: "Arkansas Live Stream",
  },
];

function LiveCam() {
  return (
    <>
      <div className="container py-4 px-3 px-md-4 overflow-hidden">
        <motion.div
          className="d-flex align-items-center gap-4 gap-md-5 flex-column"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {webcamStreams.map((stream, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="ratio ratio-16x9 custom-iframe-container scroll-hide w-100"
            >
              <iframe
                src={stream.src}
                title={stream.title}
                allowFullScreen
                className="border rounded-3"
                style={{ width: '100%', height: '100%' }}
              ></iframe>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <Footer />
    </>
  );
}

export default LiveCam;