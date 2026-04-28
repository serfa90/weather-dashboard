import { WeatherApiResponse, WeatherData } from "@/types/weather";

const BASE_URL = "https://api.openweathermap.org/data/2.5";

export async function fetchWeather(city: string): Promise<WeatherData> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) throw new Error("OPENWEATHER_API_KEY not configured");

  const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)},AR&appid=${apiKey}&units=metric&lang=es`;
  const res = await fetch(url, { next: { revalidate: 600 } });

  if (!res.ok) {
    throw new Error(`OpenWeatherMap error: ${res.status} ${res.statusText}`);
  }

  const data: WeatherApiResponse = await res.json();

  return {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp * 10) / 10,
    feelsLike: Math.round(data.main.feels_like * 10) / 10,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    windSpeed: Math.round(data.wind.speed * 10) / 10,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    timestamp: data.dt,
  };
}
