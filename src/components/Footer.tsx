"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail, Globe, Instagram } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-gray-900 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl sm:text-3xl font-gilroy-extrabold text-gray-900 hover:text-[#7bc74d] transition">
              PointNow.
            </Link>
            <p className="mt-4 text-gray-600 text-sm leading-relaxed">
              Transforming customers into brand ambassadors through gamified loyalty programs.
            </p>
            <div className="flex gap-4 mt-6">
              <a 
                href="https://www.instagram.com/pointnow.my" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#7bc74d] flex items-center justify-center transition-colors text-gray-700 hover:text-white"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-gilroy-extrabold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/home" className="text-gray-600 hover:text-[#7bc74d] transition text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/businesses" className="text-gray-600 hover:text-[#7bc74d] transition text-sm">
                  Businesses
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-600 hover:text-[#7bc74d] transition text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-[#7bc74d] transition text-sm">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* For Businesses */}
          <div>
            <h3 className="font-gilroy-extrabold text-gray-900 mb-4">For Businesses</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/auth?mode=business" className="text-gray-600 hover:text-[#7bc74d] transition text-sm">
                  Register Business
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-[#7bc74d] transition text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-600 hover:text-[#7bc74d] transition text-sm">
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-gilroy-extrabold text-gray-900 mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="tel:+601162464247" 
                  className="flex items-center gap-3 text-gray-600 hover:text-[#7bc74d] transition text-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>+60 11-6246 4247</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:hello@pointnow.io" 
                  className="flex items-center gap-3 text-gray-600 hover:text-[#7bc74d] transition text-sm"
                >
                  <Mail className="w-4 h-4" />
                  <span>hello@pointnow.io</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://pointnow.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-600 hover:text-[#7bc74d] transition text-sm"
                >
                  <Globe className="w-4 h-4" />
                  <span>pointnow.io</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            © {currentYear} PointNow. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-gray-600 hover:text-[#7bc74d] text-sm transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-[#7bc74d] text-sm transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

