"use client";

import Image from "next/image";

interface EventContentCardProps {
  title: string;
  des: string;
  panel: string;
  img: string;
}
export function EventContentCard({
  title,
  des,
  panel,
  img,
}: EventContentCardProps) {
  return (
    <div className="lg:flex lg:items-end mb-10">
      <div className="h-[32rem] max-w-[28rem] shrink-0 relative">
        <Image
          width={768}
          height={768}
          src={img}
          alt="testimonial image"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="col-span-full lg:col-span-3 flex-1 p-8">
        <h6 className="mb-4 text-lg font-semibold text-blue-gray-900">{panel}</h6>
        <h2 className="mb-4 text-3xl font-medium text-blue-gray-900">{title}</h2>
        <p className="mb-12 md:w-8/12 font-medium text-gray-500">{des}</p>
      </div>
    </div>
  );
}

export default EventContentCard;
