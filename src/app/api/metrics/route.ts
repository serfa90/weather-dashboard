import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getMetricsSince } from "@/lib/db/queries";

const querySchema = z.object({
  city: z.string().min(1),
  hours: z.coerce.number().int().min(1).max(168).default(24),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = querySchema.parse({
      city: searchParams.get("city"),
      hours: searchParams.get("hours") ?? 24,
    });

    const data = await getMetricsSince(params.city, params.hours);
    return NextResponse.json({ success: true, data });
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
