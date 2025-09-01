import React from "react";
import { Link } from "react-router-dom";
import { FileText, Users, AlertTriangle, Shield, BookOpen, Scale, Gavel, Mail, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

const TermsConditions = () => {
  const sections = [
    {
      title: "Website Usage",
      icon: <BookOpen className="h-6 w-6" />,
      content: [
        "This website is intended for academic, research, and educational purposes",
        "You must be at least 16 years old to use this website independently",
        "You agree to use the website in compliance with all applicable laws",
        "Commercial use of our content requires prior written permission"
      ]
    },
    {
      title: "Intellectual Property",
      icon: <Shield className="h-6 w-6" />,
      content: [
        "All research publications, data, and content are owned by BRAC University and the research team",
        "You may cite our research with proper academic attribution",
        "Reproduction of content for commercial purposes is strictly prohibited",
        "Our logo, trademarks, and branding materials are protected intellectual property"
      ]
    },
    {
      title: "Research Collaboration",
      icon: <Users className="h-6 w-6" />,
      content: [
        "Collaboration proposals must be submitted through official channels",
        "All research partnerships are subject to BRAC University policies",
        "Confidentiality agreements may be required for certain collaborations",
        "Intellectual property rights in joint research will be governed by separate agreements"
      ]
    },
    {
      title: "Prohibited Activities",
      icon: <AlertTriangle className="h-6 w-6" />,
      content: [
        "Attempting to gain unauthorized access to our systems or data",
        "Interfering with the proper functioning of the website",
        "Using our platform to distribute malicious software or content",
        "Misrepresenting your affiliation with our research lab or BRAC University"
      ]
    },
    {
      title: "Disclaimers",
      icon: <Scale className="h-6 w-6" />,
      content: [
        "Information on this website is provided 'as is' without warranties",
        "Research findings are subject to peer review and academic validation",
        "We are not liable for decisions made based on information from our website",
        "External links are provided for convenience but are not endorsed by us"
      ]
    },
    {
      title: "Limitation of Liability",
      icon: <Gavel className="h-6 w-6" />,
      content: [
        "Our liability is limited to the maximum extent permitted by law",
        "We are not responsible for any indirect, incidental, or consequential damages",
        "Total liability shall not exceed the amount paid by you (if any) for using our services",
        "Some jurisdictions may not allow limitation of liability, so these limits may not apply"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header - People Style */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-16 performance-optimized">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link to="/" className="flex items-center text-white hover:text-emerald-400 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Please read these terms and conditions carefully before using our research website and accessing our academic content.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Acceptance Notice */}
        <Card className="mb-8 border-0 shadow-lg border-l-4 border-l-blue-500">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service. These terms apply to all visitors, users, and others who access or use the Sustainable Energy and Smart Grid Research lab website.
            </p>
          </CardContent>
        </Card>

        {/* Terms Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-blue-100 rounded-full mr-4">
                    <div className="text-blue-600">{section.icon}</div>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Academic Use Notice */}
        <Card className="mt-8 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Academic Use Guidelines</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              As an academic research institution, we encourage the ethical use of our research and findings. When referencing our work:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Provide proper academic citation following standard formats (IEEE, APA, etc.)</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Acknowledge the Sustainable Energy and Smart Grid Research lab and BRAC University</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>Contact us for permission before using substantial portions of our work</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Modifications Notice */}
        <Card className="mt-8 border-0 shadow-lg border-l-4 border-l-amber-500">
          <CardContent className="p-8">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="h-6 w-6 text-amber-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Terms Modifications</h3>
                <p className="text-gray-700 leading-relaxed">
                  BRAC University and the Sustainable Energy and Smart Grid Research lab reserve the right to revise these terms at any time without notice. By using this website, you agree to be bound by the current version of these terms and conditions. Changes will be posted on this page with an updated revision date.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mt-8 border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Questions About These Terms</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-green-600">sesg@bracu.ac.bd</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Mailing Address</h3>
                <p className="text-gray-700">
                  Sustainable Energy and Smart Grid Research Lab<br />
                  BRAC University<br />
                  66 Mohakhali, Dhaka 1212<br />
                  Bangladesh
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card className="mt-8 border-0 shadow-lg bg-gray-100">
          <CardContent className="p-8">
            <div className="flex items-center mb-4">
              <Scale className="h-6 w-6 text-gray-600 mr-3" />
              <h3 className="font-semibold text-gray-900">Governing Law</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of Bangladesh. Any disputes relating to these terms will be subject to the exclusive jurisdiction of the courts of Bangladesh.
            </p>
          </CardContent>
        </Card>

        {/* Back to Top - Performance Optimized - Added more spacing */}
        <div className="text-center pt-8 pb-16">
          <Button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            size="lg" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 performance-optimized"
          >
            Back to Top
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;