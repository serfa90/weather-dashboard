import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchWeather } from "@/lib/weather-api";
import { insertMetric } from "@/lib/db/queries";
import { ARGENTINE_CITIES } from "@/types/weather";

const bodySchema = z.object({
  cities: z.array(z.string().min(1)).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const params = bodySchema.parse(body);

    const cities = params.cities ?? [...ARGENTINE_CITIES];
    const results = await Promise.allSettled(
      cities.map(async (city) => {
        const weather = await fetchWeather(city);
        return insertMetric({
          city: weather.city,
          country: weather.country,
          temperature: weather.temperature,
          feelsLike: weather.feelsLike,
          humidity: weather.humidity,
          pressure: weather.pressure,
          windSpeed: weather.windSpeed,
          description: weather.description,
          icon: weather.icon,
        });
      })
    );

    const saved = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return NextResponse.json({ success: true, data: { saved, failed } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid parameters", details: (error as z.ZodError).issues },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
