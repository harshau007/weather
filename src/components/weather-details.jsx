"use client"

import { motion } from "framer-motion"
import { Droplets, Wind, Sunrise, Sunset, Thermometer } from "lucide-react"

export default function WeatherDetails({ data }) {
  if (!data) return null

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const detailItems = [
    {
      icon: <Droplets className="h-5 w-5" />,
      label: "Humidity",
      value: `${data.main.humidity}%`,
    },
    {
      icon: <Wind className="h-5 w-5" />,
      label: "Wind",
      value: `${Math.round(data.wind.speed * 3.6)} km/h`,
    },
    {
      icon: <Thermometer className="h-5 w-5" />,
      label: "Pressure",
      value: `${data.main.pressure} hPa`,
    },
    {
      icon: <Sunrise className="h-5 w-5" />,
      label: "Sunrise",
      value: formatTime(data.sys.sunrise),
    },
    {
      icon: <Sunset className="h-5 w-5" />,
      label: "Sunset",
      value: formatTime(data.sys.sunset),
    },
  ]

  return (
    <motion.div
      className="p-6 rounded-xl bg-white/20 backdrop-blur-md text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-xl font-semibold mb-4">Weather Details</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {detailItems.map((item, index) => (
          <motion.div
            key={item.label}
            className="flex items-center p-3 rounded-lg bg-white/10"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 * index }}
          >
            <motion.div
              animate={{
                rotate: item.label === "Wind" ? [0, 360] : [0, 0],
                scale: item.label === "Humidity" ? [1, 1.1, 1] : [1, 1],
              }}
              transition={{
                duration: item.label === "Wind" ? 8 : 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
              className="mr-3 text-blue-200"
            >
              {item.icon}
            </motion.div>
            <div>
              <p className="text-xs text-white/70">{item.label}</p>
              <p className="font-semibold">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

