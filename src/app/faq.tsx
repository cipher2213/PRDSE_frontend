"use client";

import React from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const FAQS = [
  {
    title: "1. What are your opening hours?",
    desc: "We are open daily from 10:00 AM to 10:00 PM. We also offer early bird specials from 7:00 AM to 9:00 AM for our morning customers.",
  },
  
 
  {
    title: "4. Do you have vegetarian and vegan options?",
    desc: "Yes, we have a wide variety of vegetarian and vegan options on our menu. Our kitchen team is happy to accommodate dietary restrictions and can modify many of our dishes to meet your needs.",
  },
  {
    title: "5. Do you host events or private parties?",
    desc: "We do! Paradise Cafe is perfect for intimate gatherings, business meetings, and special celebrations. We offer catering services and can accommodate groups of various sizes. Contact us for more details about our event packages.",
  },
];

export function Faq() {
  const [open, setOpen] = React.useState(-1);

  return (
    <section id="faq" className="py-8 px-8 lg:py-20">
      <div className="container mx-auto">
        <div className="text-center">
          <h1 className="mb-4 text-blue-gray-900 text-4xl font-bold">
            Frequently asked questions
          </h1>
          <p className="mx-auto mb-24 lg:w-3/5 !text-gray-500 text-lg">
            Welcome to Paradise Cafe FAQ section. We&apos;re here to
            address your questions and help you make the most of your cafe experience.
          </p>
        </div>

        <div className="mx-auto lg:max-w-screen-lg lg:px-20">
          {FAQS.map(({ title, desc }, key) => {
            const isOpen = open === key;
            return (
              <div
                key={key}
                className={`mb-4 border rounded-lg overflow-hidden bg-white shadow-sm transition-all duration-300 ${isOpen ? 'shadow-lg' : ''}`}
              >
                <button
                  className={`w-full flex items-center justify-between text-left text-gray-900 cursor-pointer py-4 px-6 font-semibold text-lg select-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${isOpen ? 'bg-blue-50' : 'bg-white'}`}
                  onClick={() => setOpen(isOpen ? -1 : key)}
                  aria-expanded={isOpen}
                  style={{ minHeight: '3.5rem' }}
                >
                  <span>{title}</span>
                  <ChevronDownIcon
                    className={`h-6 w-6 ml-2 transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : 'rotate-0 text-gray-400'}`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 py-2' : 'grid-rows-[0fr] opacity-0 py-0'} bg-blue-50`}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="px-6 pt-0 pb-2">
                    <p className="font-serif text-blue-900 text-base md:text-lg leading-relaxed tracking-wide italic drop-shadow-sm">
                      {desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Faq;
