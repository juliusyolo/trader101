"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TVNoise from "@/components/ui/tv-noise";
import type { WidgetData } from "@/types/dashboard";
import Image from "next/image";

interface WidgetProps {
  widgetData?: WidgetData; // Make optional as we might fetch it
}

export default function Widget({ widgetData }: WidgetProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  const [locationData, setLocationData] = useState({
    location: "Loading...",
    timezone: "UTC",
    temperature: "--°C",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Fetch location and weather
    async function fetchData() {
      try {
        // 1. Get location from IP
        const ipRes = await fetch('https://ipapi.co/json/');
        const ipData = await ipRes.json();

        const city = ipData.city || "Unknown";
        const country = ipData.country_name || "";
        const timezone = ipData.timezone || "UTC";
        const lat = ipData.latitude;
        const lon = ipData.longitude;

        // 2. Get weather using Open-Meteo (free, no key required)
        let temp = "--°C";
        if (lat && lon) {
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`
          );
          const weatherData = await weatherRes.json();
          if (weatherData.current && weatherData.current.temperature_2m) {
            temp = `${weatherData.current.temperature_2m}°C`;
          }
        }

        setLocationData({
          location: `${city}, ${country}`,
          timezone: timezone,
          temperature: temp
        });

      } catch (error) {
        console.error("Error fetching widget data:", error);
        setLocationData({
          location: "Unavailable",
          timezone: "UTC",
          temperature: "--°C"
        });
      }
    }

    fetchData();

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    const dayOfWeek = date.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const restOfDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return { dayOfWeek, restOfDate };
  };

  const dateInfo = formatDate(currentTime);

  return (
    <Card className="w-full aspect-[2] relative overflow-hidden">
      <TVNoise opacity={0.3} intensity={0.2} speed={40} />
      <CardContent className="bg-accent/30 flex-1 flex flex-col justify-between text-sm font-medium uppercase relative z-20">
        <div className="flex justify-between items-center">
          <span className="opacity-50">{dateInfo.dayOfWeek}</span>
          <span>{dateInfo.restOfDate}</span>
        </div>
        <div className="text-center">
          <div className="text-5xl font-display" suppressHydrationWarning>
            {formatTime(currentTime)}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="opacity-50">{locationData.temperature}</span>
          <span>{locationData.location}</span>

          <Badge variant="secondary" className="bg-accent">
            {locationData.timezone}
          </Badge>
        </div>

        <div className="absolute inset-0 -z-[1]">
          <Image
            src="/assets/pc_blueprint.gif"
            alt="logo"
            width={250}
            height={250}
            className="size-full object-contain"
          />
        </div>
      </CardContent>
    </Card>
  );
}
