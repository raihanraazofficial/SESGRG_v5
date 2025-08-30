import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, Building } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Label } from "../components/ui/label";
import { contactInfo } from "../mock/data";

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    inquiryType: ""
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the form data to your backend
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
      inquiryType: ""
    });
  };

  const inquiryTypes = [
    "Research Collaboration",
    "Graduate Admissions",
    "Industry Partnership",
    "Media Inquiry",
    "General Information"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with our research team for collaborations, inquiries, or more information about our work.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Lab Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-emerald-100 rounded-lg">
                      <Building className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Lab Address</h3>
                      <p className="text-gray-600 leading-relaxed">{contactInfo.lab.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                      <p className="text-gray-600">{contactInfo.lab.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Mail className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                      <p className="text-gray-600">{contactInfo.lab.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-amber-100 rounded-lg">
                      <Clock className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Office Hours</h3>
                      <p className="text-gray-600">{contactInfo.office.hours}</p>
                      <p className="text-sm text-gray-500 mt-1">{contactInfo.office.location}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="h-64 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
                    <p className="text-gray-700 font-medium">Campus Location</p>
                    <p className="text-sm text-gray-500">Interactive map coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="mt-1"
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="mt-1"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="inquiryType" className="text-sm font-medium text-gray-700">
                      Inquiry Type *
                    </Label>
                    <Select value={formData.inquiryType} onValueChange={(value) => handleInputChange("inquiryType", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        {inquiryTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      className="mt-1"
                      placeholder="Brief subject of your inquiry"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      className="mt-1"
                      placeholder="Please provide details about your inquiry..."
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
                
                <div className="mt-6 text-center text-sm text-gray-500">
                  <p>
                    For urgent matters, please call us directly at{" "}
                    <a href={`tel:${contactInfo.lab.phone}`} className="text-emerald-600 hover:text-emerald-700">
                      {contactInfo.lab.phone}
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Contact Cards */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Quick Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Research Collaboration",
                description: "Interested in collaborating on research projects?",
                contact: "research@smartgridlab.edu",
                icon: Building
              },
              {
                title: "Student Inquiries",
                description: "Questions about graduate programs and positions?",
                contact: "admissions@smartgridlab.edu",
                icon: Mail
              },
              {
                title: "Industry Partnerships",
                description: "Explore partnership opportunities with industry?",
                contact: "partnerships@smartgridlab.edu",
                icon: Phone
              }
            ].map((contact, index) => {
              const IconComponent = contact.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-sm">
                  <CardContent className="p-6 text-center">
                    <div className="p-3 bg-emerald-100 rounded-full w-fit mx-auto mb-4">
                      <IconComponent className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{contact.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{contact.description}</p>
                    <a
                      href={`mailto:${contact.contact}`}
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                    >
                      {contact.contact}
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;