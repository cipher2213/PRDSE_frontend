"use client";

import Link from "next/link";

const LINKS = [
  {
    title: "Menu",
    href: "/menu-page"
  },
  {
    title: "About Us",
    href: "/#about"
  },
  {
    title: "Contact",
    href: "/#contact"
  },
];

const SOCIAL_LINKS = [
  {
    title: "Facebook",
    icon: "fab fa-facebook",
    href: "https://facebook.com/paradisecafe"
  },
  {
    title: "Instagram",
    icon: "fab fa-instagram",
    href: "https://www.instagram.com/paradise_cafe_mh22?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
  }
];

export function Footer() {
  return (
    <footer className="relative w-full bg-white px-8 pt-8">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-between items-center">
          <h5 className="mb-6 text-2xl font-semibold">Paradise Cafe</h5>
          
          <div className="flex gap-8">
            {LINKS.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="py-1 font-normal text-gray-700 transition-colors hover:text-gray-900"
              >
                {link.title}
              </Link>
            ))}
          </div>

          <div className="flex gap-4">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1 font-normal text-gray-700 transition-colors hover:text-gray-900"
              >
                <i className={`${link.icon} text-lg`}></i>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 py-4 border-t border-gray-200">
          <small className="block text-center font-normal text-gray-600">
            © 2025 Paradise Cafe. All rights reserved.
          </small>
          <small className="block text-center font-normal text-gray-600">
            Developed by Tastoria
          </small>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
