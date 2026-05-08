import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchUvAqi } from "@/lib/uv-aqi-api";
import { CITY_COORDS } from "@/types/weather";

const querySchema = z.object({
  city: z.string().min(1),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { city } = querySchema.parse({ city: searchParams.get("city") });

    const coords = CITY_COORDS[city];
    if (!coords) {
      return NextResponse.json({ success: false, error: "City not found" }, { status: 404 });
    }

    const data = await fetchUvAqi(coords[0], coords[1]);
    return NextResponse.json({ success: true, data });
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
