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
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-white">SESGL</span>
                <p className="text-xs text-gray-400 -mt-1">Smart Energy Research</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Advancing sustainable energy solutions through cutting-edge research in smart grids, renewable integration, and AI-powered energy systems.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: "Research Areas", path: "/research" },
                { name: "Publications", path: "/publications" },
                { name: "Projects", path: "/projects" },
                { name: "People", path: "/people" }
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Research Focus */}
          <div>
            <h3 className="font-semibold text-white mb-4">Research Focus</h3>
            <ul className="space-y-2">
              {[
                "Smart Grid Technologies",
                "Renewable Energy Integration", 
                "Machine Learning for Energy",
                "Grid Cybersecurity"
              ].map((area) => (
                <li key={area} className="text-sm text-gray-400">
                  {area}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-emerald-400 mt-0.5" />
                <p className="text-sm text-gray-400">
                  123 Engineering Building<br />
                  University Drive<br />
                  City, State 12345
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-emerald-400" />
                <p className="text-sm text-gray-400">+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-emerald-400" />
                <p className="text-sm text-gray-400">info@smartgridlab.edu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2024 Lab Sustainable Energy and Smart Grid Research. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link to="/faq" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                FAQ
              </Link>
              <Link to="/contact" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;