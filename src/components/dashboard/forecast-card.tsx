"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DayForecast } from "@/lib/forecast-api";

interface ForecastCardProps {
  data: DayForecast[];
  loading?: boolean;
}

export function ForecastCard({ data, loading }: ForecastCardProps) {
  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base font-heading">Pronóstico</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 py-1">
                <Skeleton className="h-3 w-10 rounded" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-3 w-14 rounded" />
                <Skeleton className="h-4 w-12 rounded" />
                <Skeleton className="h-3 w-8 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-1 pb-1 -mx-1 px-1">
            {data.map((day, i) => (
              <div
                key={day.date}
                className="flex-1 min-w-[78px] flex flex-col items-center gap-0.5 rounded-xl px-1 py-2 hover:bg-muted/50 transition-colors"
              >
                {/* Day label */}
                <span className="text-xs font-bold font-heading text-muted-foreground uppercase tracking-wide">
                  {day.label}
                </span>

                {/* Weather icon */}
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.description}
                  width={52}
                  height={52}
                  className="-my-1"
                />

                {/* Description */}
                <span className="text-[10px] text-muted-foreground font-heading capitalize text-center leading-tight min-h-[28px] flex items-center">
                  {day.description}
                </span>

                {/* Max / Min */}
                <div className="flex items-baseline gap-1 font-heading tabular-nums mt-0.5">
                  <span className="text-sm font-bold text-orange-400">{day.tempMax}°</span>
                  <span className="text-xs text-blue-400 font-medium">{day.tempMin}°</span>
                </div>

                {/* Rain probability */}
                <div className="h-5 flex items-center">
                  {day.rainProbability > 0 ? (
                    <div className="flex items-center gap-0.5 text-[11px] font-heading font-semibold text-blue-400">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-3 h-3 fill-blue-400"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 2C12 2 4 10.5 4 15a8 8 0 0016 0C20 10.5 12 2 12 2z" />
                      </svg>
                      <span>{day.rainProbability}%</span>
                    </div>
                  ) : null}
                </div>

                {/* Separator between days (except last) */}
                {i < data.length - 1 && (
                  <div className="absolute right-0 top-4 bottom-4 w-px bg-border hidden" />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
