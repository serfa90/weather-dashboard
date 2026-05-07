import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { weatherMetrics } from "@/lib/db/schema";

const bodySchema = z.object({
  city: z.string().min(1),
});

type CityConfig = {
  baseTemp: number;
  baseHumidity: number;
  pressure: number;
  windSpeed: number;
  description: string;
  icon: string;
};

const CITY_CONFIGS: Record<string, CityConfig> = {
  "Buenos Aires":  { baseTemp: 16, baseHumidity: 75, pressure: 1015, windSpeed: 3.5, description: "nublado",      icon: "04d" },
  "Córdoba":       { baseTemp: 14, baseHumidity: 55, pressure: 1012, windSpeed: 4.0, description: "cielo claro",  icon: "01d" },
  "Rosario":       { baseTemp: 15, baseHumidity: 65, pressure: 1013, windSpeed: 3.8, description: "pocas nubes",  icon: "02d" },
  "Mendoza":       { baseTemp: 12, baseHumidity: 40, pressure: 1010, windSpeed: 3.0, description: "cielo claro",  icon: "01d" },
  "La Plata":      { baseTemp: 15, baseHumidity: 78, pressure: 1015, windSpeed: 3.2, description: "nublado",      icon: "04d" },
  "Mar del Plata": { baseTemp: 13, baseHumidity: 80, pressure: 1016, windSpeed: 5.0, description: "lluvia ligera", icon: "10d" },
  "Tucumán":       { baseTemp: 20, baseHumidity: 65, pressure: 1008, windSpeed: 2.5, description: "pocas nubes",  icon: "02d" },
  "Salta":         { baseTemp: 18, baseHumidity: 50, pressure: 1005, windSpeed: 2.0, description: "cielo claro",  icon: "01d" },
  "Santa Fe":      { baseTemp: 16, baseHumidity: 68, pressure: 1013, windSpeed: 3.5, description: "pocas nubes",  icon: "02d" },
  "Neuquén":       { baseTemp: 10, baseHumidity: 45, pressure: 1008, windSpeed: 4.5, description: "bruma",        icon: "50d" },
};

const DEFAULT_CONFIG: CityConfig = {
  baseTemp: 15, baseHumidity: 65, pressure: 1013, windSpeed: 3.5, description: "pocas nubes", icon: "02d",
};

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { city } = bodySchema.parse(body);

    const config = CITY_CONFIGS[city] ?? DEFAULT_CONFIG;
    const now = Date.now();

    const records = Array.from({ length: 24 }, (_, i) => {
      const recordedAt = new Date(now - (23 - i) * 60 * 60 * 1000);
      const hour = recordedAt.getHours();

      // Variación diurna: mínimo ~6am, máximo ~14hs
      const diurnal = 4 * Math.sin((Math.PI * (hour - 6)) / 12);
      const noise = () => (Math.random() - 0.5) * 1.5;

      const temperature = round1(config.baseTemp + diurnal + noise());
      const feelsLike   = round1(temperature - 1.5 + noise() * 0.5);
      const humidity    = Math.min(100, Math.max(10, Math.round(config.baseHumidity - diurnal * 2 + noise() * 3)));
      const windSpeed   = Math.max(0, round1(config.windSpeed + noise()));
      const pressure    = config.pressure + Math.round((Math.random() - 0.5) * 4);

      return { city, country: "AR", temperature, feelsLike, humidity, pressure, windSpeed, description: config.description, icon: config.icon, recordedAt };
    });

    await db.insert(weatherMetrics).values(records);

    return NextResponse.json({ success: true, data: { inserted: records.length } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid parameters", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
