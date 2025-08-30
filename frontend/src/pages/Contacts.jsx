import React from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

const Contacts = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Get in touch with our research team. We welcome collaboration opportunities, 
            research inquiries, and partnership proposals in sustainable energy and smart grid technologies.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
                
                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-emerald-100 rounded-full">
                      <MapPin className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                      <p className="text-gray-600">
                        Sustainable Energy and Smart Grid Research Lab<br />
                        Department of Electrical and Electronic Engineering<br />
                        BRAC University<br />
                        66 Mohakhali, Dhaka 1212, Bangladesh
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <p className="text-gray-600">
                        <a href="mailto:sesg@bracu.ac.bd" className="hover:text-blue-600 transition-colors">
                          sesg@bracu.ac.bd
                        </a>
                      </p>
                      <p className="text-gray-600">
                        <a href="mailto:info@bracu.ac.bd" className="hover:text-blue-600 transition-colors">
                          info@bracu.ac.bd
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                      <p className="text-gray-600">
                        <a href="tel:+8802-9844051" className="hover:text-green-600 transition-colors">
                          +880-2-9844051
                        </a>
                      </p>
                      <p className="text-gray-600">
                        <a href="tel:+8802-9844051-54" className="hover:text-green-600 transition-colors">
                          +880-2-9844051-54
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Office Hours */}
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Office Hours</h3>
                      <p className="text-gray-600">
                        Sunday - Thursday: 9:00 AM - 5:00 PM<br />
                        Friday: 9:00 AM - 12:00 PM<br />
                        Saturday: Closed
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Contact Button */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg">
                    <a href="mailto:sesg@bracu.ac.bd" className="flex items-center w-full justify-center">
                      <Send className="h-5 w-5 mr-2" />
                      Send Us an Email
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Google Map */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <div className="relative h-full min-h-[500px] rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.923235053417!2d90.42224541501535!3d23.77321088458117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7715a40c603%3A0xec01cd75f33139f5!2sBRAC%20University!5e0!3m2!1sen!2sbd!4v1693140400000"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="BRAC University Location"
                    className="rounded-lg"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Research Collaboration */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-emerald-100 rounded-full w-fit mx-auto mb-4">
                <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Research Collaboration</h3>
              <p className="text-gray-600 text-sm">
                Interested in collaborative research? We welcome partnerships with academic institutions and industry leaders.
              </p>
            </CardContent>
          </Card>

          {/* Student Opportunities */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Student Opportunities</h3>
              <p className="text-gray-600 text-sm">
                Looking for research opportunities? We offer positions for undergraduate and graduate students.
              </p>
            </CardContent>
          </Card>

          {/* Industry Partnerships */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-4">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Industry Partnerships</h3>
              <p className="text-gray-600 text-sm">
                Connect with our lab for technology transfer, consultancy, and industrial research projects.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Directions */}
        <div className="mt-12">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Getting to BRAC University</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Public Transportation</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3"></span>
                      Take bus from Gulshan, Banani, or Mohakhali areas
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3"></span>
                      CNG auto-rickshaw available from nearby locations
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3"></span>
                      Uber and Pathao ride-sharing services available
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">By Car</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3"></span>
                      Located on Mohakhali Road, easily accessible
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3"></span>
                      Parking facilities available on campus
                    </li>
                    <li className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3"></span>
                      Approximately 15 minutes from Gulshan Circle
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contacts;