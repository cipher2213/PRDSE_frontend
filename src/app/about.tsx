"use client";

import { Typography } from "@material-tailwind/react";
import { StatsCard } from "@/components";
import Image from "next/image";

const STATS = [
    { count: "500+", title: "Happy Customers Daily" },
    { count: "50+", title: "Coffee Varieties" },
    { count: "100+", title: "Fresh Menu Items" },
    { count: "5-Star", title: "Average Rating" },
];

export function About() {
  return (
    <section id="about" className="container mx-auto flex flex-col items-center px-4 py-20">
      <h6 className="text-center mb-2 text-orange-500">
        About Paradise Cafe
      </h6>
      <h2 className="text-center text-blue-gray-900 text-4xl font-bold">
        A Heaven for Coffee Lovers
      </h2>
      <p
        className="mt-4 lg:max-w-3xl mb-12 w-full text-center font-normal !text-gray-600 text-lg"
      >
        Welcome to Paradise Cafe, where every visit is a journey into culinary excellence! 
        Founded in 2023, our mission is to provide a cozy spot for our community to enjoy artisanal coffee, gourmet cuisine, and warm hospitality.
      </p>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-20 items-center">
        <div className="text-center md:text-left">
            <div className="relative w-full h-96 mb-8">
                <Image
                    src="/image/cafe1.jpg"
                    alt="Cafe Interior"
                    fill
                    className="rounded-lg shadow-lg object-cover"
                    priority
                />
            </div>
            
            <h4 className="mb-4 text-2xl font-semibold text-blue-gray-900">Our Story</h4>
            <p className="!text-gray-600">
                From a small dream to a beloved local hub, Paradise Cafe has grown with the love of our patrons. We believe in quality, community, and the simple joy of a perfect cup of coffee. Our beans are ethically sourced, and our food is made from fresh, local ingredients.
            </p>
        </div>
        <div>
            <h4 className="mb-8 text-center md:text-left text-2xl font-semibold text-blue-gray-900">Our Highlights</h4>
            <div className="grid grid-cols-2 gap-8">
              {STATS.map((props, key) => (
                <StatsCard key={key} {...props} />
              ))}
            </div>
        </div>
      </div>
    </section>
  );
}

export default About; 