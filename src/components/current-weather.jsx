"use client";

import { motion } from "framer-motion";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Sun,
} from "lucide-react";

export default function CurrentWeather({ data, location }) {
  if (!data) return null;

  const getWeatherIcon = (weatherId) => {
    // Weather condition codes: https://openweathermap.org/weather-conditions
    if (weatherId >= 200 && weatherId < 300)
      return <CloudLightning className="h-24 w-24" />;
    if (weatherId >= 300 && weatherId < 400)
      return <CloudDrizzle className="h-24 w-24" />;
    if (weatherId >= 500 && weatherId < 600)
      return <CloudRain className="h-24 w-24" />;
    if (weatherId >= 600 && weatherId < 700)
      return <CloudSnow className="h-24 w-24" />;
    if (weatherId >= 700 && weatherId < 800)
      return <CloudFog className="h-24 w-24" />;
    if (weatherId === 800) return <Sun className="h-24 w-24" />;
    return <Cloud className="h-24 w-24" />;
  };

  const weatherIcon = getWeatherIcon(data.weather[0].id);
  const temperature = Math.round(data.main.temp);
  const description = data.weather[0].description;
  const feelsLike = Math.round(data.main.feels_like);

  return (
    <motion.div
      className="p-6 rounded-xl bg-white/20 backdrop-blur-md text-white shadow-lg"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
    >
      <div className="flex flex-col items-center md:flex-row md:justify-between">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h1 className="text-3xl font-bold">{location}</h1>
          <p className="text-xl capitalize">{description}</p>
          <p className="text-sm">Feels like {feelsLike}°C</p>
        </div>

        <div className="flex items-center">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            className="text-white"
          >
            {weatherIcon}
          </motion.div>
          <span className="text-6xl font-bold ml-4">{temperature}°C</span>
        </div>
      </div>
    </motion.div>
  );
}
