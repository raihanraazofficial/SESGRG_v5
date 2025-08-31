import React from "react";
import { Link } from "react-router-dom";
import { Shield, Eye, UserCheck, Database, Lock, AlertCircle, Mail, FileText, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "Information We Collect",
      icon: <Database className="h-6 w-6" />,
      content: [
        "Personal information you provide when contacting us (name, email, phone number)",
        "Academic and research information for collaboration purposes",
        "Website usage data through cookies and analytics",
        "Communication records when you interact with our research team"
      ]
    },
    {
      title: "How We Use Your Information",
      icon: <UserCheck className="h-6 w-6" />,
      content: [
        "To respond to your inquiries about our research and programs",
        "To facilitate academic collaborations and partnerships",
        "To improve our website and research services",
        "To send updates about our research activities (with your consent)"
      ]
    },
    {
      title: "Information Sharing",
      icon: <Shield className="h-6 w-6" />,
      content: [
        "We do not sell, trade, or rent your personal information to third parties",
        "Information may be shared with BRAC University administration when necessary",
        "We may share aggregated, non-personal data for research statistics",
        "Legal requirements may necessitate information disclosure in rare cases"
      ]
    },
    {
      title: "Data Security",
      icon: <Lock className="h-6 w-6" />,
      content: [
        "We implement appropriate security measures to protect your information",
        "Access to personal data is limited to authorized research team members",
        "We regularly review and update our security practices",
        "Data is stored securely in compliance with university policies"
      ]
    },
    {
      title: "Your Rights",
      icon: <Eye className="h-6 w-6" />,
      content: [
        "Access: You can request access to your personal information",
        "Correction: You can request correction of inaccurate information",
        "Deletion: You can request deletion of your personal information",
        "Withdrawal: You can withdraw consent for communications at any time"
      ]
    },
    {
      title: "Cookies and Tracking",
      icon: <AlertCircle className="h-6 w-6" />,
      content: [
        "Our website uses cookies to enhance user experience",
        "Analytics cookies help us understand website usage patterns",
        "You can disable cookies through your browser settings",
        "Some website functionality may be limited without cookies"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Publications Style */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-16 performance-optimized -mx-4 sm:-mx-6 lg:-mx-8 mb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-6">
              <Link to="/" className="flex items-center text-white hover:text-emerald-400 transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-300 max-w-3xl">
              We are committed to protecting your privacy and personal information. Learn how we collect, use, and safeguard your data.
            </p>
          </div>
        </div>

        {/* Introduction */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              The Sustainable Energy and Smart Grid Research lab at BRAC University is committed to protecting your privacy and handling your personal information responsibly. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or interact with our research programs.
            </p>
          </CardContent>
        </Card>

        {/* Privacy Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-emerald-100 rounded-full mr-4">
                    <div className="text-emerald-600">{section.icon}</div>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Information */}
        <Card className="mt-8 border-0 shadow-lg bg-gradient-to-r from-emerald-50 to-teal-50">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-emerald-100 rounded-full mr-4">
                <Mail className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Contact Us About Privacy</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you have any questions about this Privacy Policy, your personal information, or wish to exercise your rights, please contact us:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-emerald-600">sesg@bracu.ac.bd</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                <p className="text-gray-700">
                  BRAC University<br />
                  66 Mohakhali, Dhaka 1212<br />
                  Bangladesh
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Updates Notice */}
        <Card className="mt-8 border-0 shadow-lg border-l-4 border-l-amber-500">
          <CardContent className="p-8">
            <div className="flex items-start space-x-4">
              <FileText className="h-6 w-6 text-amber-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Policy Updates</h3>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to update this Privacy Policy at any time. We will notify you of any changes by posting the new Privacy Policy on this page with an updated "Last updated" date. Your continued use of our website after any modifications indicates your acceptance of the updated Privacy Policy.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Top - Performance Optimized */}
        <div className="text-center pb-16">
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

export default PrivacyPolicy;