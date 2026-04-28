"use client";

import { ARGENTINE_CITIES, ArgenteCity } from "@/types/weather";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CitySelectorProps {
  selected: string;
  onChange: (city: ArgenteCity) => void;
}

export function CitySelector({ selected, onChange }: CitySelectorProps) {
  return (
    <Tabs value={selected} onValueChange={(v) => onChange(v as ArgenteCity)}>
      <TabsList className="flex flex-wrap h-auto gap-1 bg-card/80 backdrop-blur-sm p-1">
        {ARGENTINE_CITIES.map((city) => (
          <TabsTrigger key={city} value={city} className="text-xs sm:text-sm">
            {city}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
