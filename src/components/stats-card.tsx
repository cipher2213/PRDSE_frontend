"use client";

interface StatsCardProps {
  count: string;
  title: string;
}

export function StatsCard({ count, title }: StatsCardProps) {
  return (
    <div className="text-center bg-transparent">
      <h1 className="font-bold text-4xl text-blue-gray-900">{count}</h1>
      <h6 className="mt-1 font-medium text-lg text-blue-gray-900">{title}</h6>
    </div>
  );
}

export default StatsCard;
