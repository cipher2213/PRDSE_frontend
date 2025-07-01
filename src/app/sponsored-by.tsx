"use client";

import Image from "next/image";

const PARTNERS = [
  "starbucks",
  "nespresso",
  "illy",
  "lavazza",
  "peets",
  "blue-bottle",
];

export function SponsoredBy() {
  return (
    <section className="py-8 px-8 lg:py-20">
      <div className="container mx-auto text-center">
        <h6 className="mb-8 text-blue-gray-900 text-lg font-semibold tracking-widest">
          OUR PARTNERS
        </h6>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {PARTNERS.map((logo, key) => (
            <Image
              width={256}
              height={256}
              key={key}
              src={`/logos/logo-${logo}.svg`}
              alt={logo}
              className="w-40"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default SponsoredBy;
