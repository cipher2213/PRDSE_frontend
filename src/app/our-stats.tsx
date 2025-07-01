"use client";


import StatsCard from "@/components/stats-card";

const STATS = [
  {
    count: "500+",
    title: "Happy Customers",
  },
  {
    count: "50+",
    title: "Coffee Varieties",
  },
  {
    count: "100+",
    title: "Menu Items",
  },
  {
    count: "5",
    title: "Star Rating",
  },
];

export function OurStats() {
  return (
    <section className="container mx-auto grid gap-10 px-8 py-44 lg:grid-cols-1 lg:gap-20 xl:grid-cols-2 xl:place-items-center">
      <div>
        <h6 className="mb-6 font-medium text-orange-500 text-lg">
          Our Numbers
        </h6>
        <h2 className="text-5xl font-bold leading-tight lg:w-3/4 text-blue-gray-900">
          Cafe Highlights
        </h2>
        <p className="mt-3 w-full !text-gray-500 lg:w-9/12 text-lg">
          Join thousands of satisfied customers who have made Paradise Cafe their 
          favorite destination for quality coffee, delicious food, and memorable moments.
        </p>
      </div>
      <div>
        <div className="grid grid-cols-2 gap-8 gap-x-28">
          {STATS.map((props, key) => (
            <StatsCard key={key} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default OurStats;
