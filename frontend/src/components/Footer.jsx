import React from "react";
import { Link } from "react-router-dom";
import { Zap, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Lab Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/Logo.jpg" 
                alt="SESG Logo" 
                className="h-10 w-10 rounded-lg object-cover"
              />
              <div>
                <span className="font-bold text-lg text-white">SESG Research</span>
                <p className="text-xs text-gray-400 -mt-1">Sustainable Energy & Smart Grid</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Pioneering Research in Clean Energy, Renewable Integration, and Next-Generation Smart Grid Systems.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.bracu.ac.bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center"
                >
                  BRAC University <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
              <li>
                <a
                  href="https://soe.bracu.ac.bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center"
                >
                  BSRM School of Engineering <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
              <li>
                <Link
                  to="/research"
                  className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  Research Areas
                </Link>
              </li>
              <li>
                <Link
                  to="/publications"
                  className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  Publications
                </Link>
              </li>
            </ul>
          </div>

          {/* Find Us */}
          <div>
            <h3 className="font-semibold text-white mb-4">Find Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-emerald-400" />
                <a 
                  href="mailto:sesg@bracu.ac.bd"
                  className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  sesg@bracu.ac.bd
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-emerald-400" />
                <p className="text-sm text-gray-400">+880-2-9844051-4</p>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-emerald-400 mt-0.5" />
                <p className="text-sm text-gray-400">
                  BRAC University<br />
                  66 Mohakhali, Dhaka 1212<br />
                  Bangladesh
                </p>
              </div>
              <Link
                to="/contact"
                className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                View on Map →
              </Link>
            </div>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="font-semibold text-white mb-4">Follow Us</h3>
            <div className="space-y-3">
              <div className="flex space-x-4">
                {/* Social Media Links - Placeholders */}
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <div className="h-5 w-5 bg-gray-400 rounded"></div>
                </a>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <div className="h-5 w-5 bg-gray-400 rounded"></div>
                </a>
                <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <div className="h-5 w-5 bg-gray-400 rounded"></div>
                </a>
              </div>
              <p className="text-sm text-gray-400 mt-4">
                Stay connected with our latest research updates and announcements.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2024 Sustainable Energy and Smart Grid Research. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link to="/faq" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                FAQ
              </Link>
              <span className="text-gray-600">|</span>
              <Link to="/contact" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gray-600">|</span>
              <Link to="/contact" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;