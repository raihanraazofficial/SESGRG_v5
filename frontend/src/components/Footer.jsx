import React from "react";
import { Link } from "react-router-dom";
import { Zap, Mail, Phone, MapPin, ExternalLink, Facebook, Linkedin, Twitter, Instagram, Youtube } from "lucide-react";
import { useFooter } from "../contexts/FooterContext";

const Footer = () => {
  const { footerData, isLoading } = useFooter();

  if (isLoading) {
    return (
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-800 rounded mb-8"></div>
            <div className="h-16 bg-gray-800 rounded"></div>
          </div>
        </div>
      </footer>
    );
  }

  // Icon component mapping
  const IconComponents = {
    Facebook,
    Linkedin,
    Twitter,
    Instagram,
    Youtube
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Lab Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src={footerData.labInfo.logo} 
                alt="SESG Logo" 
                className="h-10 w-10 rounded-lg object-cover"
              />
              <div>
                <span className="font-bold text-lg text-white">{footerData.labInfo.name}</span>
                <p className="text-xs text-gray-400 -mt-1">{footerData.labInfo.subtitle}</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {footerData.labInfo.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerData.quickLinks.map((link) => (
                <li key={link.id}>
                  {link.isExternal ? (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center"
                    >
                      {link.title} <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  ) : (
                    <Link
                      to={link.url}
                      className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                    >
                      {link.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Find Us */}
          <div>
            <h3 className="font-semibold text-white mb-4">Find Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-emerald-400" />
                <a 
                  href={`mailto:${footerData.contactInfo.email}`}
                  className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  {footerData.contactInfo.email}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-emerald-400" />
                <p className="text-sm text-gray-400">{footerData.contactInfo.phone}</p>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-emerald-400 mt-0.5" />
                <div className="text-sm text-gray-400">
                  <p>{footerData.contactInfo.address.line1}<br />
                  {footerData.contactInfo.address.line2}<br />
                  {footerData.contactInfo.address.line3}</p>
                  <Link
                    to={footerData.contactInfo.mapLink}
                    className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors inline-block mt-2"
                  >
                    {footerData.contactInfo.mapText}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="font-semibold text-white mb-4">Follow Us</h3>
            <div className="space-y-3">
              <div className="flex space-x-4">
                {/* Social Media Links */}
                {footerData.socialMedia.map((social) => {
                  const IconComponent = IconComponents[social.icon];
                  return (
                    <a 
                      key={social.id}
                      href={social.url} 
                      className={`w-10 h-10 ${social.bgColor} ${social.hoverColor} rounded-full flex items-center justify-center transition-colors`}
                      title={social.name}
                    >
                      {IconComponent && <IconComponent className="h-5 w-5 text-white" />}
                    </a>
                  );
                })}
              </div>
              <p className="text-sm text-gray-400 mt-4">
                {footerData.socialDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} {footerData.bottomBar.copyright}
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              {footerData.bottomBar.links.map((link, index) => (
                <React.Fragment key={link.id}>
                  <Link to={link.url} className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                    {link.title}
                  </Link>
                  {index < footerData.bottomBar.links.length - 1 && (
                    <span className="text-gray-600">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;