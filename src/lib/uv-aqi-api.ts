export interface UvAqiData {
  uvIndex: number;
  uvLabel: string;
  uvColor: string;
  aqi: number;
  aqiLabel: string;
  aqiColor: string;
  pm25: number;
  pm10: number;
}

const UV_LEVELS = [
  { max: 2,        label: "Bajo",      color: "#22c55e" },
  { max: 5,        label: "Moderado",  color: "#eab308" },
  { max: 7,        label: "Alto",      color: "#f97316" },
  { max: 10,       label: "Muy alto",  color: "#ef4444" },
  { max: Infinity, label: "Extremo",   color: "#a855f7" },
];

const AQI_LEVELS = [
  { label: "Bueno",      color: "#22c55e" },
  { label: "Aceptable",  color: "#a3e635" },
  { label: "Moderado",   color: "#eab308" },
  { label: "Dañino",     color: "#ef4444" },
  { label: "Muy dañino", color: "#a855f7" },
];

function getUvLevel(uv: number) {
  return UV_LEVELS.find((l) => uv <= l.max) ?? UV_LEVELS[UV_LEVELS.length - 1];
}

export async function fetchUvAqi(lat: number, lon: number): Promise<UvAqiData> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) throw new Error("OPENWEATHER_API_KEY not configured");

  const [uvRes, aqiRes] = await Promise.all([
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=uv_index`,
      { next: { revalidate: 1800 } }
    ),
    fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`,
      { next: { revalidate: 1800 } }
    ),
  ]);

  if (!uvRes.ok || !aqiRes.ok) throw new Error("Failed to fetch UV/AQI data");

  const uvData = await uvRes.json();
  const aqiData = await aqiRes.json();

  const uvIndex = Math.round((uvData.current?.uv_index ?? 0) * 10) / 10;
  const aqi: number = aqiData.list?.[0]?.main?.aqi ?? 1;
  const components = aqiData.list?.[0]?.components ?? {};

  const uvLevel = getUvLevel(uvIndex);
  const aqiLevel = AQI_LEVELS[aqi - 1] ?? AQI_LEVELS[0];

  return {
    uvIndex,
    uvLabel: uvLevel.label,
    uvColor: uvLevel.color,
    aqi,
    aqiLabel: aqiLevel.label,
    aqiColor: aqiLevel.color,
    pm25: Math.round((components.pm2_5 ?? 0) * 10) / 10,
    pm10: Math.round((components.pm10 ?? 0) * 10) / 10,
  };
}
