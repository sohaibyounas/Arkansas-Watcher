import axios from "axios";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  IoSearchOutline,
  IoCloudOutline,
  IoRainyOutline,
  IoSpeedometerOutline,
  IoSunnyOutline,
} from "react-icons/io5";
import Footer from "../common/Footer";
import thermometer from "../assets/images/thermometer.svg";
import cloudSnow from "../assets/images/cloudSnow.svg";
import wind from "../assets/images/wind.svg";
import drop from "../assets/images/drop.svg";
import eye from "../assets/images/eye.svg";
import sunCapital from "../assets/images/sunCapital.svg";
import { BASEURL } from "../Constant/API";
import { fadeInUp, staggerContainer } from "../utils/animations";

const DEFAULT_LOCATION = {
  latitude: 34.9697,
  longitude: -92.3731,
  name: "Arkansas, USA",
};

const LAYERS = {
  clouds_new: "Clouds",
  precipitation_new: "Precipitation",
  pressure_new: "Pressure",
  wind_new: "Wind",
  temp_new: "Temperature",
};

// Shimmer component (placeholder for react-shimmer-effects)
const ShimmerThumbnail = ({ height, width, className, style }) => (
  <div
    className={`animate-pulse bg-gray-700 ${className}`}
    style={{ height, width, ...style }}
  />
);

function Weather() {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });
  const [forecastData, setForecastData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState("temp_new");
  const [weatherKey, setWeatherKey] = useState("");
  const [mapKey, setMapKey] = useState("");

  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Mapbox API key
  const mapboxToken = import.meta.env.VITE_MAPBOX_SECRET_TOKEN || "";
  const openWeatherApiKey =
    mapKey || import.meta.env.VITE_OPENWEATHER_API_KEY || "";

  // Load Mapbox GL JS
  useEffect(() => {
    if (!window.mapboxgl) {
      const script = document.createElement("script");
      script.src = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js";
      script.async = true;
      document.head.appendChild(script);

      const link = document.createElement("link");
      link.href = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Initialize map when location is available
  useEffect(() => {
    if (!location.latitude || !location.longitude) return;

    const initializeMap = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      if (!window.mapboxgl) return;

      window.mapboxgl.accessToken =
        import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || "";

      const map = new window.mapboxgl.Map({
        container: mapRef.current,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
        center: [location.longitude, location.latitude],
        zoom: 12, // Increased initial zoom for closer view
        attributionControl: false,
      });

      map.addControl(new window.mapboxgl.NavigationControl());
      mapInstanceRef.current = map;

      const addWeatherLayer = (layerName) => {
        if (!map.getSource(layerName)) {
          map.addSource(layerName, {
            type: "raster",
            tiles: [
              `https://tile.openweathermap.org/map/${layerName}/{z}/{x}/{y}.png?appid=${openWeatherApiKey}`,
            ],
            tileSize: 256,
          });

          map.addLayer({
            id: layerName,
            type: "raster",
            source: layerName,
            layout: { visibility: "visible" },
          });
        }
      };

      const removeLayers = () => {
        Object.keys(LAYERS).forEach((layer) => {
          if (map.getLayer(layer)) {
            map.removeLayer(layer);
            map.removeSource(layer);
          }
        });
      };

      map.on("load", () => {
        addWeatherLayer("temp_new");
      });

      // Store functions for later use
      map.addWeatherLayer = addWeatherLayer;
      map.removeLayers = removeLayers;
    };

    if (window.mapboxgl) {
      initializeMap();
    } else {
      const checkMapbox = setInterval(() => {
        if (window.mapboxgl) {
          clearInterval(checkMapbox);
          initializeMap();
        }
      }, 100);
    }
  }, [location.latitude, location.longitude, openWeatherApiKey]);

  // Handle layer changes
  const handleLayerChange = (layerName) => {
    setSelectedLayer(layerName);
    if (
      mapInstanceRef.current &&
      mapInstanceRef.current.removeLayers &&
      mapInstanceRef.current.addWeatherLayer
    ) {
      mapInstanceRef.current.removeLayers();
      mapInstanceRef.current.addWeatherLayer(layerName);
    }
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await axios.get(`${BASEURL}/main/keys`);
        console.log("Weather Key:", response.data);
        setWeatherKey(response.data.data.weather_Key);
        setMapKey(response.data.data.map_Key);
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };

    fetchHomeData();
  }, []);

  // Get user geolocation on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          });
        },
        (error) => {
          console.error("Geolocation error:", error.message);
          // Use Arkansas as default location
          setLocation({
            latitude: DEFAULT_LOCATION.latitude,
            longitude: DEFAULT_LOCATION.longitude,
            error: error.message,
          });
          setSelectedLocation(DEFAULT_LOCATION.name);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Use Arkansas as default location
      setLocation({
        latitude: DEFAULT_LOCATION.latitude,
        longitude: DEFAULT_LOCATION.longitude,
        error: "Geolocation is not supported by this browser.",
      });
      setSelectedLocation(DEFAULT_LOCATION.name);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search for locations using Mapbox geocoding API
  const searchLocations = useCallback(
    async (query) => {
      if (!query || query.trim() === "") {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
          )}.json?access_token=${mapboxToken}&types=place,locality,neighborhood&limit=5`
        );
        const data = await response.json();

        if (data && data.features) {
          setSearchResults(data.features);
          setShowDropdown(true);
        }
      } catch (error) {
        console.error("Error searching for locations:", error);
        setSearchResults([]);
      }
    },
    [mapboxToken]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      searchLocations(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, searchLocations]);

  const weatherKeyParam =
    weatherKey || import.meta.env.VITE_WEATHER_API_KEY || "";

  useEffect(() => {
    const fetchWeatherData = async () => {
      const lat = location.latitude || DEFAULT_LOCATION.latitude;
      const lon = location.longitude || DEFAULT_LOCATION.longitude;

      setWeatherLoading(true);
      setWeatherError(null);

      try {
        const url = `https://api.weatherapi.com/v1/forecast.json?q=${lat},${lon}&days=7&aqi=yes&alerts=yes&key=${weatherKeyParam}`;
        const response = await axios.get(url);
        setForecastData(response.data.forecast.forecastday);

        // Set location name - use the returned location or default
        if (!selectedLocation && response.data.location) {
          setSelectedLocation(
            `${response.data.location.name}, ${response.data.location.country}`
          );
        } else if (!selectedLocation) {
          setSelectedLocation(DEFAULT_LOCATION.name);
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setWeatherError(error.message || "Failed to fetch weather data");
      } finally {
        setWeatherLoading(false);
      }
    };
    fetchWeatherData();
  }, [location.latitude, location.longitude, selectedLocation, weatherKeyParam]);

  const handleLocationSelect = (feature) => {
    const [longitude, latitude] = feature.center;
    setLocation({
      latitude,
      longitude,
      error: null,
    });
    setSelectedLocation(feature.place_name); // Set full place name from Mapbox
    setSearchTerm(""); // Clear search bar
    setShowDropdown(false);

    // Update map to fit bounds if available, or use high zoom
    if (mapInstanceRef.current) {
      if (feature.bbox) {
        // Use bounding box for precise area coverage
        mapInstanceRef.current.fitBounds(
          [
            [feature.bbox[0], feature.bbox[1]], // southwest coordinates
            [feature.bbox[2], feature.bbox[3]], // northeast coordinates
          ],
          { padding: 50, maxZoom: 13 }
        );
      } else {
        // Fallback to high zoom level
        mapInstanceRef.current.flyTo({
          center: [longitude, latitude],
          zoom: 13, // High zoom for close view
        });
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchFocus = () => {
    if (searchTerm && searchResults.length > 0) {
      setShowDropdown(true);
    }
  };

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <div style={{ backgroundColor: "#1B1B1B" }} className="pb-5 overflow-hidden">
        <div className="container px-3 px-md-4 px-lg-5">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="d-flex flex-lg-row flex-column align-items-center justify-content-between gap-3 pt-4 pt-md-5 mb-4"
          >
            <h1 className="text-white fw-bold text-center text-lg-start mb-0">
              7 - Days Weather Forecast
            </h1>
            <div
              className="position-relative w-100"
              style={{ maxWidth: "20rem" }}
              ref={searchRef}
            >
              <input
                type="text"
                className="form-control bg-transparent text-white pe-5 ps-3 py-2 rounded border border-secondary"
                placeholder="Find your location..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
              />
              <IoSearchOutline
                className="position-absolute text-white"
                style={{
                  top: "50%",
                  right: "12px",
                  transform: "translateY(-50%)",
                }}
              />

              {/* Search Results Dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="position-absolute w-100 mt-1 bg-dark rounded border border-secondary py-1 z-3"
                  style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    zIndex: 1000,
                  }}
                >
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="px-3 py-2 text-white hover-bg-secondary cursor-pointer"
                      style={{
                        cursor: "pointer",
                        transition: "background-color 0.2s ease",
                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#333")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "transparent")
                      }
                      onClick={() => handleLocationSelect(result)}
                    >
                      {result.place_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {selectedLocation && (
            <div className="text-white text-center text-lg-start mb-3 pt-0">
              <p className="fs-5 mb-0">
                Currently showing weather for:{" "}
                <span style={{ color: "#FF5B63" }}>{selectedLocation}</span>
              </p>
            </div>
          )}

          <p
            style={{ color: "#BBBBBB" }}
            className="mb-4 albertregular pb-3 pb-md-4 pt-2 text-center text-lg-start"
          >
            Welcome to your 7-day weather forecast, where you can stay informed
            and plan your week with ease. This forecast provides accurate,
            up-to-date information on daily weather conditions, helping you
            prepare for whatever comes your way
          </p>

          {weatherLoading ? (
            // Display shimmer placeholders while loading
            Array(7)
              .fill()
              .map((_, index) => (
                <ShimmerThumbnail
                  key={index}
                  height={220}
                  width="100%"
                  rounded
                  className="mb-3 dark-shimmer"
                  style={{ border: "1px solid #333" }}
                />
              ))
          ) : weatherError ? (
            <div className="bg-dark text-white rounded p-4 text-center">
              <h4>Error loading weather data</h4>
              <p>{weatherError}</p>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {forecastData &&
                forecastData?.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    whileHover={{ y: -3 }}
                    className="bg-dark text-white rounded-3 mb-3 overflow-hidden"
                    style={{ border: "1px solid #333" }}
                  >
                    <div className="d-flex flex-lg-row flex-column justify-content-between align-items-center flex-wrap">
                      <div className="px-4 py-3 text-center text-lg-start">
                        <h4
                          className="mb-1 albertsemibold"
                          style={{ color: "#FF5B63" }}
                        >
                          {getDayName(item.date)}
                        </h4>
                        <h2
                          className="fw-bold py-2 albertsemibold mb-0"
                          style={{ fontSize: "42px" }}
                        >
                          {item?.day?.avgtemp_f}°F
                        </h2>
                        <p className="small mb-2 albertmedium">
                          {item?.day?.condition?.text}
                        </p>
                        <div className="d-flex align-items-center justify-content-center justify-content-lg-start">
                          <img
                            src={item.day.condition.icon}
                            alt="weather-icon"
                            style={{ width: "35px", height: "35px" }}
                            className="me-2"
                          />
                          <p className="mb-0 albertmedium">
                            Chances of rain: {item?.day?.daily_chance_of_rain}%
                          </p>
                        </div>
                      </div>
                      <div className="d-flex me-lg-4 my-2 my-lg-0 flex-column align-items-center">
                        <h6 className="text-white mb-2">
                          {formatDate(item.date)}
                        </h6>
                        <img
                          src={item.day.condition.icon}
                          alt={item.day.condition.text}
                        />
                      </div>

                      <div
                        className="row text-center mt-lg-0 mt-2 g-0 w-100"
                        style={{ flex: 1 }}
                      >
                        <div className="col-6 col-sm-4 col-lg m-0 bg-black py-2">
                          <div
                            className="fs-6 fs-md-5 albertmedium my-2 my-md-3"
                            style={{ color: "#DEDEDE" }}
                          >
                            Real Feel
                          </div>
                          <img src={thermometer} alt="thermometer" />
                          <div className="albertbold my-2 my-md-3 fs-6 fs-md-5">
                            {item.hour[0].feelslike_f}°F
                          </div>
                        </div>
                        <div className="col-6 col-sm-4 col-lg m-0 py-2">
                          <div
                            className="fs-6 fs-md-5 albertmedium my-2 my-md-3"
                            style={{ color: "#DEDEDE" }}
                          >
                            Humidity
                          </div>
                          <img src={drop} alt="humidity" />
                          <div
                            className="albertbold my-2 my-md-3 fs-6 fs-md-5"
                            style={{ color: "#DEDEDE" }}
                          >
                            {item.hour[0].humidity}%
                          </div>
                        </div>
                        <div className="col-6 col-sm-4 col-lg m-0 bg-black py-2">
                          <div
                            className="fs-6 fs-md-5 albertmedium my-2 my-md-3"
                            style={{ color: "#DEDEDE" }}
                          >
                            Wind
                          </div>
                          <img src={wind} alt="wind" />
                          <div className="albertbold my-2 my-md-3 fs-6 fs-md-5">
                            {item.hour[0].wind_mph} Km/h
                          </div>
                        </div>
                        <div className="col-6 col-sm-4 col-lg m-0 py-2">
                          <div
                            className="fs-6 fs-md-5 albertmedium my-2 my-md-3"
                            style={{ color: "#DEDEDE" }}
                          >
                            Precipitation
                          </div>
                          <img src={cloudSnow} alt="precipitation" />
                          <div className="albertbold my-2 my-md-3 fs-6 fs-md-5">
                            {item.hour[0].precip_mm}%
                          </div>
                        </div>
                        <div className="col-6 col-sm-4 col-lg bg-black m-0 py-2">
                          <div
                            className="fs-6 fs-md-5 albertmedium my-2 my-md-3"
                            style={{ color: "#DEDEDE" }}
                          >
                            UV Index
                          </div>
                          <img src={sunCapital} alt="uv-index" />
                          <div className="albertbold my-2 my-md-3 fs-6 fs-md-5">
                            {item.hour[0].uv}
                          </div>
                        </div>
                        <div className="col-6 col-sm-4 col-lg m-0 py-2">
                          <div
                            className="fs-6 fs-md-5 albertmedium my-2 my-md-3"
                            style={{ color: "#DEDEDE" }}
                          >
                            Visibility
                          </div>
                          <img src={eye} alt="visibility" />
                          <div className="albertbold my-2 my-md-3 fs-6 fs-md-5">
                            {item.hour[0].vis_km} Km
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </motion.div>
          )}

          <motion.div
            className="mt-5 mb-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeInUp}
          >
            <div
              className="bg-dark rounded p-2 p-md-4"
              style={{ border: "1px solid #333", position: "relative" }}
            >
              {/* Map Container */}
              <div
                ref={mapRef}
                id="map"
                className="w-100 rounded"
                style={{
                  height: "480px",
                  backgroundColor: "#333",
                  position: "relative",
                }}
              >
                {/* Menu inside the map */}
                <div
                  className="wmenu d-flex flex-column gap-2"
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    zIndex: 999,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    padding: "8px",
                    borderRadius: "8px",
                  }}
                >
                  <input
                    type="radio"
                    name="layer"
                    value="clouds_new"
                    id="clouds"
                    checked={selectedLayer === "clouds_new"}
                    onChange={(e) => handleLayerChange(e.target.value)}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor="clouds"
                    className={`btn btn-sm d-flex align-items-center gap-2 ${
                      selectedLayer === "clouds_new"
                        ? "btn-danger"
                        : "btn-outline-light"
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    <IoCloudOutline /> Clouds
                  </label>

                  <input
                    type="radio"
                    name="layer"
                    value="precipitation_new"
                    id="precipitation"
                    checked={selectedLayer === "precipitation_new"}
                    onChange={(e) => handleLayerChange(e.target.value)}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor="precipitation"
                    className={`btn btn-sm d-flex align-items-center gap-2 ${
                      selectedLayer === "precipitation_new"
                        ? "btn-danger"
                        : "btn-outline-light"
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    <IoRainyOutline /> Precipitation
                  </label>

                  <input
                    type="radio"
                    name="layer"
                    value="pressure_new"
                    id="pressure"
                    checked={selectedLayer === "pressure_new"}
                    onChange={(e) => handleLayerChange(e.target.value)}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor="pressure"
                    className={`btn btn-sm d-flex align-items-center gap-2 ${
                      selectedLayer === "pressure_new"
                        ? "btn-danger"
                        : "btn-outline-light"
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    <IoSpeedometerOutline /> Pressure
                  </label>

                  <input
                    type="radio"
                    name="layer"
                    value="wind_new"
                    id="mapWind"
                    checked={selectedLayer === "wind_new"}
                    onChange={(e) => handleLayerChange(e.target.value)}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor="mapWind"
                    className={`btn btn-sm d-flex align-items-center gap-2 ${
                      selectedLayer === "wind_new"
                        ? "btn-danger"
                        : "btn-outline-light"
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    <IoSpeedometerOutline /> Wind
                  </label>

                  <input
                    type="radio"
                    name="layer"
                    value="temp_new"
                    id="temperature"
                    checked={selectedLayer === "temp_new"}
                    onChange={(e) => handleLayerChange(e.target.value)}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor="temperature"
                    className={`btn btn-sm d-flex align-items-center gap-2 ${
                      selectedLayer === "temp_new"
                        ? "btn-danger"
                        : "btn-outline-light"
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    <IoSunnyOutline /> Temperature
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
      <style>{`
        .mapboxgl-ctrl-bottom-right .mapboxgl-ctrl-attrib {
          display: none;
        }
      `}</style>
    </>
  );
}

export default Weather;