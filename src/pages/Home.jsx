import React, { useEffect, useState } from "react";
import "../assets/css/style.css";
import "../assets/css/Responsive.css";
import Main from "../components/Main";
import Sponsor from "../components/Sponsor";
import Forecast from "../components/Forecast";
import Update from "../components/Update";
import Snapshot from "../components/Snapshot";
import SponsorSlider from "../components/SponsorSlider";
import FacebookSlider from "../components/FacebookSlider";
import Blog from "../components/Blog";
import Footer from "../common/Footer";
import HomeBg from "../assets/images/home_bg.svg";
import Navbar from "../common/Navbar";
import axios from "axios";
import { BASEURL } from "../Constant/API";

function Home() {
  const [homeData, setHomeData] = useState(null);
  const [topSponsor, setTopSponsor] = useState("");
  const [team, setTeam] = useState("");
  const [sponsors, setSponsors] = useState("");
  const [socialPost, setSocialPost] = useState("");
  const [snapshots, setSnapshots] = useState("");
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  const [faqData, setFaqData] = useState(null);
  const [presentLocation, setPresentLocation] = useState("");
  const [weatherKey, setWeatherKey] = useState("")
  const [facebookToken, setFacebookToken] = useState("");
  const [PageId, setPageId] = useState("");

  useEffect(() => {
    const fetchHomeData = async () => {
      try { 
        const response = await axios.get(`${BASEURL}/main/home`);
        setHomeData(response.data.data);
        setTopSponsor(response.data.data.topSponsor);
        setTeam(response.data.data.teams);
        setSponsors(response.data.data.sponsors);
        setSocialPost(response.data.data.posts);
        setSnapshots(response.data.data.snapshots);
        setFaqData(response.data.data.faqs);
        setWeatherKey(response.data.data.weather_key);
        setPageId(response.data.data.facebook_page_id.value);
        setFacebookToken(response.data.data.facebook_page_access_token.value);
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };

    fetchHomeData();
  }, []);

  // Get user geolocation
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
          // Use Arkansas coordinates as default if geolocation is denied or fails
          setLocation({
            latitude: 35.201,
            longitude: -91.8318,
            error: error.message,
          });
          console.error(
            "Geolocation error, using default Arkansas coordinates:",
            error.message
          );
        }
      );
    } else {
      // Use Arkansas coordinates as default if geolocation is not supported
      setLocation({
        latitude: 35.201,
        longitude: -91.8318,
        error: "Geolocation is not supported by this browser.",
      });
      console.error(
        "Geolocation is not supported, using default Arkansas coordinates."
      );
    }
  }, []);

  const weatherKeyParam =
    weatherKey || import.meta.env.VITE_WEATHER_API_KEY || "";

  // Fetch weather data when location is available
  useEffect(() => {
    const fetchWeatherData = async () => {
      const { latitude, longitude } = location;

      // Only proceed if we have latitude and longitude
      if (!latitude || !longitude) return;

      setWeatherLoading(true);
      setWeatherError(null);

      try {
        const url = `https://api.weatherapi.com/v1/forecast.json?q=${latitude},${longitude}&days=1&aqi=yes&alerts=yes&key=${weatherKeyParam}`;

        const response = await axios.get(url);
        setWeatherData(response.data);
         if (response.data.location) {
          setPresentLocation(`${response.data.location.name}, ${response.data.location.country}`);
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setWeatherError(error.message || "Failed to fetch weather data");
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeatherData();
  }, [location.latitude, location.longitude]);

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${HomeBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* <Navbar /> */}
        <Main
          topSponsor={topSponsor}
          weatherData={weatherData}
          weatherLoading={weatherLoading}
          weatherError={weatherError}
          presentLocation={presentLocation}
        />
      </div>
      <Sponsor sponsors={sponsors} />
      <Forecast weatherData={weatherData} weatherLoading={weatherLoading} />
      <Update />
      <Snapshot />
      <SponsorSlider snapshots={snapshots} />
      <FacebookSlider facebookToken={facebookToken} pageId={PageId} />
      <Blog socialPost={socialPost} />
      <Footer />
    </>
  );
}

export default Home;
