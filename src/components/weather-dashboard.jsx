"use client";

import CurrentWeather from "@/components/current-weather";
import DailyForecast from "@/components/daily-forecast";
import HourlyForecast from "@/components/hourly-forecast";
import LoadingWeather from "@/components/loading-weather";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WeatherDetails from "@/components/weather-details";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function WeatherDashboard() {
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  const fetchWeatherData = async (query) => {
    setLoading(true);
    setError(null);

    if (!apiKey) {
      console.error("OpenWeather API key is missing");
      setError(
        "API key is missing. Please add your OpenWeather API key to the environment variables."
      );
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching weather data for:", query);

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric`
      );

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${apiKey}&units=metric`
      );

      setWeather({
        current: response.data,
        forecast: forecastResponse.data,
      });
      setLocation(query);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      if (err.response) {
        if (err.response.status === 401) {
          setError("Authentication failed. Please check your API key.");
        } else if (err.response.status === 404) {
          setError(
            `Location "${query}" not found. Please try another location.`
          );
        } else {
          setError(
            `Error: ${
              err.response.data.message || "Failed to fetch weather data"
            }`
          );
        }
      } else if (err.request) {
        setError(
          "No response received from weather service. Please check your internet connection."
        );
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async (query) => {
    if (!apiKey) return;
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
      );
      setSuggestions(response.data);
      // Only show suggestions if there is some text entered
      if (query.trim()) {
        setShowSuggestions(true);
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  // Debounce suggestion calls when searchQuery changes
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const debounceTimer = setTimeout(() => {
        fetchSuggestions(searchQuery);
      }, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (!apiKey) {
      console.error("OpenWeather API key is missing");
      setError(
        "API key is missing. Please add your OpenWeather API key to the environment variables."
      );
      setLoading(false);
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const locationResponse = await axios.get(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`
            );

            if (locationResponse.data && locationResponse.data.length > 0) {
              const cityName = locationResponse.data[0].name;
              setSearchQuery(cityName);
              fetchWeatherData(cityName);
            }
          } catch (err) {
            console.error("Error getting location:", err);
            fetchWeatherData("London");
          }
        },
        () => {
          fetchWeatherData("London");
        }
      );
    } else {
      fetchWeatherData("London");
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchWeatherData(searchQuery);
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="relative flex gap-2 mb-6">
        <Input
          type="text"
          placeholder="Search location..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          // Hide suggestions when input loses focus
          onBlur={() => {
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          className="bg-white/20 backdrop-blur-md border-none text-white placeholder:text-white/70"
        />
        <Button type="submit" variant="secondary" size="icon">
          <Search className="h-4 w-4" />
        </Button>
        {/* Suggestion Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute top-full left-0 right-0 z-10 bg-white text-black rounded-md shadow-md mt-1 max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  const selectedCity = `${suggestion.name}${
                    suggestion.state ? `, ${suggestion.state}` : ""
                  }, ${suggestion.country}`;
                  setSearchQuery(selectedCity);
                  setShowSuggestions(false);
                  setSuggestions([]);
                  fetchWeatherData(suggestion.name);
                }}
              >
                {suggestion.name}
                {suggestion.state ? `, ${suggestion.state}` : ""}
                {`, ${suggestion.country}`}
              </li>
            ))}
          </ul>
        )}
      </form>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingWeather error={error} />
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 bg-white/20 backdrop-blur-md rounded-xl text-white text-center"
          >
            {error}
          </motion.div>
        ) : (
          <motion.div
            key="weather"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {weather && (
              <>
                <CurrentWeather data={weather.current} location={location} />
                <HourlyForecast data={weather.forecast} />
                <DailyForecast data={weather.forecast} />
                <WeatherDetails data={weather.current} />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
