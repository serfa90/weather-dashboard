import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchWeather } from "@/lib/weather-api";

const querySchema = z.object({
  city: z.string().min(1),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = querySchema.parse({ city: searchParams.get("city") });

    const data = await fetchWeather(params.city);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid parameters", details: (error as z.ZodError).issues },
        { status: 400 }
      );
    }
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
