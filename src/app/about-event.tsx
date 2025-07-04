"use client";


import AboutCard from "@/components/about-card";

const CAFE_INFO = [
  {
    title: "Artisanal Coffee!",
    description:
      "Experience handcrafted coffee made from the finest beans, roasted to perfection and brewed with passion by our expert baristas.",
    subTitle: "Coffee",
    image: "/image/coffee/coffee-art.jpg"
  },
  {
    title: "Gourmet Cuisine!",
    description:
      "Savor our carefully curated menu featuring fresh, locally-sourced ingredients prepared with love and creativity.",
    subTitle: "Food",
    image: "/image/food/gourmet.jpg"
  },
];

export function AboutEvent() {
  return (
    <section className="container mx-auto flex flex-col items-center px-4 py-10">
      <h6 className="text-center mb-2 text-orange-500">
        About Paradise Cafe
      </h6>
      <h2 className="text-center text-blue-gray-900 text-4xl font-bold">
        Why Choose Us?
      </h2>
      <p
        className="mt-2 lg:max-w-4xl mb-8 w-full text-center font-normal !text-gray-500 text-lg"
      >
        Welcome to Paradise Cafe, where every visit is a journey into culinary excellence! 
        Whether you're a coffee connoisseur, a food enthusiast, or simply looking for a 
        cozy spot to unwind, our cafe offers the perfect blend of comfort, quality, and community.
      </p>
      <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {CAFE_INFO.map((props, idx) => (
          <AboutCard key={idx} {...props} />
        ))}
        <div className="md:col-span-2">
          <AboutCard
            title="Cozy Atmosphere!"
            subTitle="Ambiance"
            description="Relax in our thoughtfully designed space with warm lighting, comfortable seating, and a welcoming atmosphere perfect for work, meetings, or quiet moments."
            image="/image/ambiance/cozy.jpg"
          />
        </div>
      </div>
    </section>
  );
}

export default AboutEvent;
