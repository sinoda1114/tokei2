import React from "react"

interface WeatherIconProps {
  telop: string
  temperature?: string
  maxTemp?: string
  minTemp?: string
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ telop, temperature, maxTemp, minTemp }) => {
  return (
    <div className="flex flex-col items-center bg-blue-50 dark:bg-blue-950 rounded-lg p-3 w-24">
      <div className="text-2xl mb-1">
        {telop.includes('晴') && telop.includes('曇') && '⛅'}
        {telop.includes('晴') && !telop.includes('曇') && '☀️'}
        {telop.includes('雨') && telop.includes('雪') && '🌨️'}
        {telop.includes('雨') && !telop.includes('雪') && '🌧️'}
        {telop.includes('雪') && !telop.includes('雨') && '❄️'}
        {telop.includes('曇') && !telop.includes('晴') && '☁️'}
        {telop.includes('雷') && '⚡'}
      </div>
      <div className="text-sm font-bold mb-1">{temperature || '--'}℃</div>
      <div className="flex gap-2 text-xs">
        <span className="text-red-500 text-[1.3em]">{maxTemp || '--'}</span>
        <span className="text-blue-500 text-[1.3em]">{minTemp || '--'}</span>
      </div>
    </div>
  )
}

export default WeatherIcon 