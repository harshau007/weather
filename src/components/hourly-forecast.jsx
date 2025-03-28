"use client"

import { motion } from "framer-motion"
import { Cloud, CloudRain, CloudSnow, CloudFog, Sun, CloudLightning, CloudDrizzle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function HourlyForecast({ data }) {
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

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Get next 24 hours (8 items, as each is 3 hours apart)
  const hourlyData = data.list.slice(0, 8)

  return (
    <motion.div
      className="p-6 rounded-xl bg-white/20 backdrop-blur-md text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold mb-4">Hourly Forecast</h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 pb-2">
          {hourlyData.map((hour, index) => (
            <motion.div
              key={hour.dt}
              className="flex flex-col items-center p-3 rounded-lg bg-white/10 min-w-[80px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <span className="text-sm">{formatTime(hour.dt)}</span>
              <motion.div
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  delay: index * 0.2,
                }}
                className="my-2"
              >
                {getWeatherIcon(hour.weather[0].id)}
              </motion.div>
              <span className="font-bold">{Math.round(hour.main.temp)}°C</span>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </motion.div>
  )
}

