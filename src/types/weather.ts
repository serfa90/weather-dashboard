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

export const CITY_COORDS: Record<string, [number, number]> = {
  "Buenos Aires":  [-34.6037, -58.3816],
  "Córdoba":       [-31.4201, -64.1888],
  "Rosario":       [-32.9468, -60.6393],
  "Mendoza":       [-32.8908, -68.8272],
  "La Plata":      [-34.9205, -57.9536],
  "Mar del Plata": [-38.0023, -57.5575],
  "Tucumán":       [-26.8241, -65.2226],
  "Salta":         [-24.7821, -65.4232],
  "Santa Fe":      [-31.6333, -60.7000],
  "Neuquén":       [-38.9516, -68.0591],
};

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
