import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import sunny from '../assets/images/sunny.svg';
import thunderRain from '../assets/images/thunderrain.svg';
import cloud from '../assets/images/cloud.svg';
import rain from '../assets/images/rain.svg';
import sunnyCloud from '../assets/images/sun_cloud.svg';
import AirCondition from '../assets/images/air_condition.svg';
import sunrise from '../assets/images/sunrise.svg';
import sunset from '../assets/images/sunset.svg';
import { FaCircle, FaPlay } from 'react-icons/fa';
import { fadeInUp, fadeInLeft, fadeInRight, scaleUp, staggerContainer } from '../utils/animations';

function Weather({ weatherData, weatherLoading }) {
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const weatherImages = [sunny, sunnyCloud, thunderRain, sunnyCloud, rain, sunny, cloud, sunnyCloud];
  const conditions = weatherData
    ? [
        {
          title: "Real Feel",
          amount: `${weatherData?.current?.feelslike_c}° C`,
        },
        {
          title: "Wind",
          amount: `${weatherData?.current?.wind_kph} km/h`,
        },
        {
          title: "Chances of rain",
          amount: `${weatherData?.forecast?.forecastday[0]?.day?.daily_chance_of_rain}%`,
        },
        {
          title: 'UV Index',
          amount: weatherData?.current.uv,
        },
        {
          title: 'Visibility',
          amount: `${weatherData?.current?.vis_km} km`,
        },
        {
          title: 'Humidity',
          amount: `${weatherData?.current?.humidity}%`,
        },
      ]
    : [];

  useEffect(() => {
    if (weatherData?.forecast?.forecastday?.[0]?.hour) {
      // Get current hour
      const currentHour = new Date().getHours();

      // Get hours at intervals of 3, starting from the current hour
      let hoursToShow = [];
      const hourData = weatherData?.forecast?.forecastday[0]?.hour;

      // We'll select 8 time points with a step of 3 hours
      for (let i = 0; i < 8; i++) {
        // Calculate the hour index with a step of 3 hours
        const hourIndex = (currentHour + i * 3) % 24;
        hoursToShow.push(hourData[hourIndex]);
      }

      // Process and format the selected hourly data points
      const processedHourlyData = hoursToShow.map((hour) => {
        const hourValue = new Date(hour.time).getHours();
        const formattedTime =
          hourValue === 0
            ? '12 AM'
            : hourValue === 12
            ? '12 PM'
            : hourValue < 12
            ? `${hourValue} AM`
            : `${hourValue - 12} PM`;

        return {
          hourTime: formattedTime,
          hourTemp: hour.temp_f,
        };
      });

      setHourlyForecast(processedHourlyData);
    }
  }, [weatherData]);

  return (
    <div className="text-white font-sans py-5 overflow-hidden" style={{ backgroundColor: '#0F0F0F' }}>
      <div className="container px-3 px-md-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <h1 className="text-center fw-bold mb-3 mb-md-4">Today's Hourly Weather Forecast</h1>
          <p className="text-center mb-4 mb-md-5 mx-auto" style={{ color: '#B7B7B7', maxWidth: '680px' }}>
            Today's weather outlook is here! Stay informed about temperature changes and weather conditions to make the most of your day.
          </p>
        </motion.div>

        <motion.div
          className="row g-3 mb-4 justify-content-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {hourlyForecast.map((item, i) => (
            <motion.div
              key={i}
              className="col-6 col-sm-4 col-md-3 col-lg"
              variants={scaleUp}
              whileHover={{ y: -6, scale: 1.03 }}
            >
              <div
                className="p-3 text-center h-100 d-flex flex-column align-items-center justify-content-between"
                style={{
                  background: "linear-gradient(to bottom left, #E9B851, #BE4E54)",
                  borderRadius: '18px',
                }}
              >
                <span className="fw-semibold d-block mb-2" id={`thSlot${i + 1}`}>
                  {item?.hourTime}
                </span>
                <div
                  className="bg-white rounded-circle d-flex align-items-center justify-content-center p-2 mx-auto"
                  style={{ width: '48px', height: '48px' }}
                >
                  <img
                    src={weatherImages[i % weatherImages?.length]}
                    alt="Weather Icon"
                    className="img-fluid"
                  />
                </div>
                <span className="fw-bold d-block mt-2" id={`thSlot${i + 1}T`}>
                  {item?.hourTemp}°F
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="row g-4 align-items-stretch">
          <motion.div
            className="col-lg-8 col-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInLeft}
          >
            <div
              className="p-4 p-md-5 h-100 d-flex flex-column justify-content-center"
              style={{
                backgroundImage: `url(${AirCondition})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: '32px',
                minHeight: '320px',
              }}
            >
              <h2 className="fw-bold mb-3">Air Conditions</h2>
              <div className="row g-3 mt-1">
                {weatherLoading ? (
                  <div className="col-6 col-sm-4">
                    <p className="text-secondary mb-1">-</p>
                    <p className="fw-bold fs-4 mb-0">--</p>
                  </div>
                ) : (
                  conditions.map((condition, i) => (
                    <div className="col-6 col-sm-4" key={i}>
                      <p className="text-secondary mb-1 small">{condition?.title}</p>
                      <p className="fw-bold fs-5 fs-md-4 mb-0">{condition?.amount}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="col-lg-4 col-12 d-flex flex-column justify-content-between gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInRight}
          >
            <div className="row g-3">
              <div className="col-6">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="p-3 text-center d-flex flex-column justify-content-center align-items-center custom_height"
                  style={{
                    backgroundImage: `url(${sunrise})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: '28px',
                  }}
                >
                  <h4 className="fw-bold mb-2">Sunrise</h4>
                  {weatherLoading ? (
                    <p className="fw-bold fs-5 mb-0">-</p>
                  ) : (
                    <p className="fw-bold fs-5 mb-0" id="sunriseTime">
                      {weatherData?.forecast?.forecastday[0]?.astro?.sunrise}
                    </p>
                  )}
                </motion.div>
              </div>
              <div className="col-6">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="p-3 text-center d-flex flex-column justify-content-center align-items-center custom_height"
                  style={{
                    backgroundImage: `url(${sunset})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: '28px',
                  }}
                >
                  <h4 className="fw-bold mb-2">Sunset</h4>
                  {weatherLoading ? (
                    <p className="fw-bold fs-5 mb-0">-</p>
                  ) : (
                    <p className="fw-bold fs-5 mb-0" id="sunsetTime">
                      {weatherData?.forecast?.forecastday[0]?.astro?.sunset}
                    </p>
                  )}
                </motion.div>
              </div>
            </div>

            <div className="bg-black text-white rounded-4 p-3 p-md-4">
              <p className="fw-bold mb-2">Listen to Today's Weather Summary</p>
              <div
                className="d-flex align-items-center rounded"
                style={{ backgroundColor: '#161616', padding: '8px 15px' }}
              >
                <FaPlay className="text-white me-2 flex-shrink-0" style={{ cursor: 'pointer' }} />
                <FaCircle className="text-white flex-shrink-0" />
                <div className="progress w-100" style={{ height: '5px', marginLeft: '-14px' }}>
                  <div className="progress-bar bg-light" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Weather;
