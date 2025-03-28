"use client"

import { motion } from "framer-motion"
import { Cloud, CloudRain, CloudSnow, CloudFog, Sun, CloudLightning, CloudDrizzle } from "lucide-react"

export default function DailyForecast({ data }) {
  if (!data || !data.list) return null

  const getWeatherIcon = (weatherId) => {
    if (weatherId >= 200 && weatherId < 300) return <CloudLightning className="h-6 w-6" />
    if (weatherId >= 300 && weatherId < 400) return <CloudDrizzle className="h-6 w-6" />
    if (weatherId >= 500 && weatherId < 600) return <CloudRain className="h-6 w-6" />
    if (weatherId >= 600 && weatherId < 700) return <CloudSnow className="h-6 w-6" />
    if (weatherId >= 700 && weatherId < 800) return <CloudFog className="h-6 w-6" />
    if (weatherId === 800) return <Sun className="h-6 w-6" />
    return <Cloud className="h-6 w-6" />
  }

  const formatDay = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString(undefined, { weekday: "short" })
  }

  // Group forecast by day
  const dailyData = []
  const days = {}

  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000)
    const day = date.toDateString()

    if (!days[day]) {
      days[day] = true
      dailyData.push(item)
    }
  })

  // Limit to 5 days
  const fiveDayForecast = dailyData.slice(0, 5)

  return (
    <motion.div
      className="p-6 rounded-xl bg-white/20 backdrop-blur-md text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold mb-4">5-Day Forecast</h2>
      <div className="space-y-3">
        {fiveDayForecast.map((day, index) => (
          <motion.div
            key={day.dt}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <span className="font-medium w-20">{formatDay(day.dt)}</span>
            <motion.div
              animate={{
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                delay: index * 0.2,
              }}
            >
              {getWeatherIcon(day.weather[0].id)}
            </motion.div>
            <div className="flex space-x-4">
              <span>{Math.round(day.main.temp_max)}°</span>
              <span className="text-white/70">{Math.round(day.main.temp_min)}°</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

