"use client";

import { IconButton, Button } from "@material-tailwind/react";
import { PlayIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from "react";

interface HeroProps {
  tableId?: string;
  onViewMenu?: () => void;
}

function Hero({ tableId, onViewMenu }: HeroProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`)
      .then(res => res.json())
      .then(data => setVisitorCount(data.visitorCount))
      .catch(() => setVisitorCount(null));
  }, []);

  const handleMenuClick = () => {
    if (tableId && onViewMenu) {
      onViewMenu();
    } else {
      router.push('/menu-page');
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      <Toaster />
      {/* Video Background */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
      >
        {/* Make sure to add your video file in the /public/videos/ directory */}
        <source src="/image/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 h-full w-full bg-gray-900/50" />

      {/* Content */}
      <div className="grid min-h-screen px-8">
        <div className="container relative z-10 my-auto mx-auto grid place-items-center text-center">
          <h3 className="mb-2 text-white text-2xl md:text-3xl font-semibold leading-relaxed">
            Open Daily 10AM - 10PM @ Parbhani
          </h3>
          <h1 className="lg:max-w-3xl text-white text-4xl md:text-5xl font-bold leading-loose">
            Paradise Cafe: Where Every Sip Tells a Story
          </h1>
          <div className="mt-1 mb-12 w-full md:max-w-full lg:max-w-2xl">
            <p className="text-white text-lg md:text-xl font-normal leading-relaxed">
              Experience the perfect blend of artisanal coffee, gourmet cuisine, and warm hospitality in our cozy paradise .
            </p>
            {tableId && (
              <p className="mt-4 text-white text-lg font-semibold">
                <span className="font-bold">Table {tableId}</span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button 
              className="bg-gradient-to-r from-white to-gray-200 text-gray-900 font-semibold px-6 py-3 rounded-lg shadow-md hover:from-yellow-100 hover:to-white transition-colors duration-200"
              onClick={handleMenuClick}
            >
              View Menu
            </button>
          </div>
          {/* Visitor No. Card below contact/lead section */}
          {visitorCount !== null && (
            <div className="mt-8 flex justify-center">
              <div className="px-6 py-2 rounded-xl shadow-lg bg-white/10 border border-white/20 backdrop-blur-sm text-white text-base font-semibold animate-pulse" style={{boxShadow: '0 0 12px 2px #fff8, 0 0 4px 1px #facc15'}}>
                Visitor No. : <span className="font-bold text-yellow-300">{visitorCount}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Hero;
