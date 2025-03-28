"use client"

import { motion } from "framer-motion"
import { Cloud, Sun, AlertCircle } from "lucide-react"

export default function LoadingWeather({ error = null }) {
  if (error && error.includes("API key")) {
    return (
      <div className="flex flex-col items-center justify-center p-10 rounded-xl bg-white/20 backdrop-blur-md text-white h-[400px]">
        <AlertCircle className="h-16 w-16 text-red-300 mb-4" />
        <h2 className="text-xl font-bold mb-2">API Key Error</h2>
        <p className="text-center mb-4">{error}</p>
        <div className="text-sm max-w-md text-center">
          <p>To fix this issue:</p>
          <ol className="list-decimal text-left mt-2 ml-4">
            <li>
              Sign up for a free API key at{" "}
              <a href="https://openweathermap.org/api" className="underline" target="_blank" rel="noopener noreferrer">
                OpenWeatherMap
              </a>
            </li>
            <li>Add your API key to the environment variables as NEXT_PUBLIC_OPENWEATHER_API_KEY</li>
            <li>Note that new API keys may take a few hours to activate</li>
          </ol>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center p-10 rounded-xl bg-white/20 backdrop-blur-md text-white h-[400px]">
      <motion.div
        className="relative"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <Sun className="h-16 w-16 text-yellow-300" />
        <motion.div
          className="absolute top-0 left-0"
          animate={{
            x: [0, 10, 0, -10, 0],
            y: [0, -10, 0, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <Cloud className="h-10 w-10 text-white" />
        </motion.div>
      </motion.div>
      <motion.p
        className="mt-6 text-xl font-medium"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
      >
        Loading weather data...
      </motion.p>
    </div>
  )
}

