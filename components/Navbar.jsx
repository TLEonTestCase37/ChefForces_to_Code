"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", path: "/dashboard" },
    { label: "Problems", path: "/problems" },
    { label: "Profile", path: "/profile" },
  ];

  return (
    <div className="bg-gradient-to-r from-[#1f1f1f] to-[#2c2c2c] shadow-lg text-white">
      {/* Desktop Navbar */}
      <div className="h-16 flex items-center justify-between px-6 sm:px-12">
        <div
          className="text-2xl font-extrabold tracking-wide text-amber-400 cursor-pointer hover:text-amber-300 transition duration-200"
          onClick={() => router.push("/dashboard")}
        >
          Chef<span className="text-white">Forces</span>
        </div>

        {/* Desktop links */}
        <div className="hidden sm:flex gap-10 text-lg font-medium">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="relative group cursor-pointer transition duration-200"
              onClick={() => router.push(link.path)}
            >
              {link.label}
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full" />
            </div>
          ))}
        </div>

        {/* Hamburger icon for mobile */}
        <button
          className="sm:hidden text-3xl focus:outline-none hover:text-amber-400 transition"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="sm:hidden bg-[#1a1a1a] flex flex-col gap-3 px-6 pb-4"
          >
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="text-white text-base font-medium py-1 px-2 rounded hover:bg-[#2a2a2a] hover:text-amber-400 transition cursor-pointer"
                onClick={() => {
                  setMenuOpen(false);
                  router.push(link.path);
                }}
              >
                {link.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
