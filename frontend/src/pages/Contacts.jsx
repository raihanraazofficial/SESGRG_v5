import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, ArrowLeft, User, Building, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useContact } from "../contexts/ContactContext";
import emailjs from '@emailjs/browser';

const Contacts = () => {
  const { contactInfo, inquiryTypes, submitInquiry, mapConfig, emailjsConfig, cards, directions, isLoading } = useContact();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    subject: '',
    inquiryType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Submit to localStorage first
      const result = submitInquiry(formData);
      
      if (result.success) {
        let emailSent = false;
        
        // Try to send email via EmailJS if enabled and configured
        if (emailjsConfig.enabled && emailjsConfig.serviceId && emailjsConfig.templateId && emailjsConfig.publicKey) {
          try {
            const templateParams = {
              from_name: formData.name,
              from_email: formData.email,
              phone: formData.phone || 'Not provided',
              organization: formData.organization || 'Not provided',
              subject: formData.subject,
              inquiry_type: formData.inquiryType,
              message: formData.message,
              to_email: emailjsConfig.toEmail || 'raihanraaz.official@gmail.com'
            };

            await emailjs.send(
              emailjsConfig.serviceId,
              emailjsConfig.templateId,
              templateParams,
              emailjsConfig.publicKey
            );
            
            emailSent = true;
          } catch (emailError) {
            console.error('EmailJS error:', emailError);
            // Continue with success message even if email fails
          }
        }
        
        setSubmitStatus({ 
          type: 'success', 
          message: emailSent 
            ? 'Message sent successfully! We will get back to you soon.' 
            : 'Message received successfully! We will get back to you soon.'
        });
        
        setFormData({
          name: '',
          email: '',
          phone: '',
          organization: '',
          subject: '',
          inquiryType: '',
          message: ''
        });
      } else {
        setSubmitStatus({ type: 'error', message: result.error || 'Failed to send message. Please try again.' });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus({ type: 'error', message: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading spinner only for the first few seconds while contact data is being loaded
  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contact information...</p>
        </div>
      </div>
    );
  }

  // Ensure contact data is available before rendering
  if (!contactInfo || !contactInfo.address || !inquiryTypes || inquiryTypes.length === 0) {
    const [showError, setShowError] = React.useState(false);
    
    // Show error message after 5 seconds
    React.useEffect(() => {
      const errorTimeout = setTimeout(() => {
        setShowError(true);
      }, 5000);
      
      return () => clearTimeout(errorTimeout);
    }, []);

    if (showError) {
      return (
        <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md">
            <p className="text-gray-600 mb-4">Unable to load contact information. Please try refreshing the page.</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contact information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50 performance-optimized">
      {/* Header - Gallery Style */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-16 performance-optimized">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link to="/" className="flex items-center text-white hover:text-emerald-400 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Get in touch with our research team. We welcome collaboration opportunities, 
            research inquiries, and partnership proposals in sustainable energy and smart grid technologies.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Layout - Get in Touch Card and Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Get In Touch Card */}
          <div className="lg:col-span-1">
            <Card className="h-full performance-optimized">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
                
                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-emerald-100 rounded-full">
                      <MapPin className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Lab Address</h3>
                      <p className="text-gray-600 whitespace-pre-line">
                        {contactInfo.address.content}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                      {contactInfo.phone.numbers.map((number, index) => (
                        <p key={index} className="text-gray-600">
                          <a href={`tel:${number}`} className="hover:text-blue-600 transition-colors">
                            {number}
                          </a>
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Mail className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      {contactInfo.email.addresses.map((email, index) => (
                        <p key={index} className="text-gray-600">
                          <a href={`mailto:${email}`} className="hover:text-purple-600 transition-colors">
                            {email}
                          </a>
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Office Hours */}
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Office Hours</h3>
                      <p className="text-gray-600 whitespace-pre-line">
                        {contactInfo.officeHours.schedule}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-1">
            <Card className="h-full performance-optimized">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  {/* Phone and Organization Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        placeholder="+880 XXX-XXXXXXX"
                      />
                    </div>
                    <div>
                      <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                        Organization
                      </label>
                      <input
                        type="text"
                        id="organization"
                        name="organization"
                        value={formData.organization}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                        placeholder="Your organization"
                      />
                    </div>
                  </div>

                  {/* Inquiry Type */}
                  <div>
                    <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-2">
                      Inquiry Type *
                    </label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    >
                      <option value="">Select inquiry type</option>
                      {inquiryTypes.map((type) => (
                        <option key={type.id} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="Brief subject of your inquiry"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                      placeholder="Please provide details about your inquiry..."
                    />
                  </div>

                  {/* Submit Status */}
                  {submitStatus && (
                    <div className={`p-4 rounded-lg ${
                      submitStatus.type === 'success' 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      {submitStatus.message}
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 py-3 text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>

                  <p className="text-sm text-gray-500 text-center">
                    For urgent matters, please call us directly at {contactInfo.phone.numbers[0]}
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mb-12">
          <Card className="performance-optimized">
            <CardContent className="p-0">
              <div className="relative h-96 rounded-lg overflow-hidden">
                <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-3">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Campus Location</h3>
  
                </div>
                <iframe
                  src={mapConfig.embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={mapConfig.title}
                  className="rounded-lg"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {cards.map((card) => (
            <Card key={card.id} className="hover:shadow-lg transition-shadow performance-optimized">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-emerald-100 rounded-full w-fit mx-auto mb-4">
                  {card.icon === 'collaboration' && (
                    <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  )}
                  {card.icon === 'education' && (
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                  )}
                  {card.icon === 'industry' && (
                    <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-600 text-sm">
                  {card.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Directions */}
        <div className="mb-12">
          <Card className="performance-optimized">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Getting to BRAC University</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{directions.publicTransportation.title}</h3>
                  <ul className="space-y-2 text-gray-600">
                    {directions.publicTransportation.items.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{directions.byCar.title}</h3>
                  <ul className="space-y-2 text-gray-600">
                    {directions.byCar.items.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
  );
};

export default Contacts;