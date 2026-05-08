export interface DayForecast {
  date: string;
  label: string;
  icon: string;
  description: string;
  tempMax: number;
  tempMin: number;
  rainProbability: number;
}

interface ForecastItem {
  dt: number;
  main: { temp: number; temp_min: number; temp_max: number };
  weather: Array<{ description: string; icon: string }>;
  pop: number;
  dt_txt: string;
}

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export async function fetchForecast(city: string): Promise<DayForecast[]> {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) throw new Error("OPENWEATHER_API_KEY not configured");

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)},AR&appid=${apiKey}&units=metric&lang=es&cnt=40`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Forecast API error: ${res.status}`);

  const data: { list: ForecastItem[] } = await res.json();

  // Group items by UTC date (dt_txt prefix)
  const grouped = new Map<string, ForecastItem[]>();
  for (const item of data.list) {
    const date = item.dt_txt.slice(0, 10);
    if (!grouped.has(date)) grouped.set(date, []);
    grouped.get(date)!.push(item);
  }

  const days: DayForecast[] = [];

  for (const [date, items] of grouped) {
    if (days.length >= 6) break;

    // Prefer midday item for representative icon/description
    const representative =
      items.find((i) => i.dt_txt.includes("12:00:00")) ??
      items[Math.floor(items.length / 2)];

    const tempMax = Math.round(Math.max(...items.map((i) => i.main.temp_max)));
    const tempMin = Math.round(Math.min(...items.map((i) => i.main.temp_min)));
    const rainProbability = Math.round(Math.max(...items.map((i) => i.pop)) * 100);

    // Label: first date = Hoy, second = Mañana, rest = day abbreviation
    let label: string;
    if (days.length === 0) {
      label = "Hoy";
    } else if (days.length === 1) {
      label = "Mañana";
    } else {
      const d = new Date(date + "T12:00:00Z");
      label = DAY_NAMES[d.getUTCDay()];
    }

    days.push({
      date,
      label,
      icon: representative.weather[0].icon,
      description: representative.weather[0].description,
      tempMax,
      tempMin,
      rainProbability,
    });
  }

  return days;
}
