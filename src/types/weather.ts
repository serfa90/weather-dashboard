export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  description: string;
  icon: string;
  timestamp: number;
}

export interface WeatherApiResponse {
  name: string;
  sys: { country: string };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: { speed: number };
  weather: Array<{ description: string; icon: string }>;
  dt: number;
}

export const ARGENTINE_CITIES = [
  "Buenos Aires",
  "Córdoba",
  "Rosario",
  "Mendoza",
  "La Plata",
  "Mar del Plata",
  "Tucumán",
  "Salta",
  "Santa Fe",
  "Neuquén",
] as const;

export type ArgenteCity = (typeof ARGENTINE_CITIES)[number];
