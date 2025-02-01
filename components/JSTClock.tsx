"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Moon, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Sun as SunnyIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import WeatherIcon from "./WeatherIcon"

// 天気情報の型定義
interface WeatherData {
  location?: {
    prefecture: string
    city: string
  }
  forecasts?: Array<{
    telop: string
    temperature: {
      max?: {
        celsius?: string
      }
      min?: {
        celsius?: string
      }
    }
  }>
}

const JSTClock: React.FC = () => {
  const [date, setDate] = useState(new Date())
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [zipCode, setZipCode] = useState('')
  const [weather, setWeather] = useState<WeatherData | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    return `${hours}:${minutes}`
  }

  const formatDate = (date: Date): string => {
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"]
    const weekday = weekdays[date.getDay()]
    return `${month}/${day}（${weekday}）`
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const getPrefCode = (prefName: string): string => {
    const prefCodes: { [key: string]: string } = {
      '神奈川県': '140010',  // 横浜地点のコードに変更
      '東京都': '130010',    // 東京地点
      '埼玉県': '110010',    // さいたま地点
      '千葉県': '120010',    // 千葉地点
      '愛知県': '230010',    // 名古屋地点
      '大阪府': '270000',    // 大阪地点
      '京都府': '260010',    // 京都地点
      '兵庫県': '280010',    // 神戸地点
      '福岡県': '400010',    // 福岡地点
      '北海道': '016010',    // 札幌地点
    }
    return prefCodes[prefName] || ''
  }

  const handleZipCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setZipCode(value)

    if (value.length === 7) {
      try {
        const zipResponse = await fetch(
          `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${value}`
        )
        const zipData = await zipResponse.json()
        console.log('Zip data details:', JSON.stringify(zipData, null, 2))

        if (zipData.results && zipData.results[0]) {
          const prefecture = zipData.results[0].address1
          const prefCode = getPrefCode(prefecture)
          console.log('Prefecture:', prefecture, 'PrefCode:', prefCode)
          
          if (prefCode) {
            try {
              const weatherResponse = await fetch(
                `https://weather.tsukumijima.net/api/forecast/city/${prefCode}`
              )
              const weatherData = await weatherResponse.json()
              console.log('Weather data details:', JSON.stringify(weatherData, null, 2))
              setWeather(weatherData)
            } catch (weatherError) {
              console.error('天気情報の取得に失敗しました:', weatherError)
              setWeather(null)
            }
          } else {
            console.error('対応する地域コードが見つかりません:', prefecture)
            setWeather(null)
          }
        }
      } catch (error) {
        console.error('郵便番号の検索に失敗しました:', error)
        setWeather(null)
      }
    }
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${isDarkMode ? "dark bg-dark" : "bg-white"}`}>
      <div className="bg-background text-foreground p-8 rounded-lg shadow-lg">
        <div className="flex items-start gap-8">
          <div>
            <div className="text-6xl font-bold mb-4">{formatTime(date)}</div>
            <div className="text-3xl">{formatDate(date)}</div>
          </div>

          <div className="border-l pl-8">
            <input
              type="text"
              value={zipCode}
              onChange={handleZipCodeChange}
              placeholder="郵便番号（7桁）"
              maxLength={7}
              className="w-32 text-center rounded-md border border-input bg-background px-3 py-2 text-sm mb-2 mx-auto block"
            />
            {weather && (
              <div className="text-sm text-center">
                <p className="mb-2">{weather.location?.prefecture} {weather.location?.city || ''}</p>
                <div className="flex justify-center">
                  <WeatherIcon 
                    telop={weather.forecasts?.[0]?.telop || ''}
                    temperature={weather.forecasts?.[0]?.temperature?.max?.celsius}
                    maxTemp={weather.forecasts?.[0]?.temperature?.max?.celsius}
                    minTemp={weather.forecasts?.[0]?.temperature?.min?.celsius}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <Button className="mt-4" variant="outline" size="icon" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default JSTClock