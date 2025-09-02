import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { BarChart3, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/leaderboard", label: "Global Talent Index" },
    { path: "/recruiter", label: "Recruiter Hub" },
    { path: "/upload", label: "Rate Resume" },
    { path: "/dashboard", label: "My Dashboard" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <motion.div 
              className="flex items-center space-x-3 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="text-white" size={20} />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                Re<span className="gradient-text">Rank</span>
              </span>
            </motion.div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <motion.button
                  className={`relative px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    location === item.path || (location === "/" && item.path === "/leaderboard")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.label}
                </motion.button>
              </Link>
            ))}
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <button className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              Sign In
            </button>
            <motion.button
              className="btn-primary px-4 py-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
            </motion.button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-3 space-y-2 border-t border-gray-200"
          >
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <button
                  className={`block w-full text-left px-3 py-2 text-base font-medium rounded-md ${
                    location === item.path || (location === "/" && item.path === "/leaderboard")
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </button>
              </Link>
            ))}
            <div className="pt-3 space-y-2">
              <button className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900">
                Sign In
              </button>
              <button className="w-full btn-primary px-3 py-2 text-base">
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
