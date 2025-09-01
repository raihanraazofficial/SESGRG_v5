import React, { useState } from 'react';
import {
  Settings,
  MapPin,
  Phone,
  Mail,
  Clock,
  Eye,
  Trash2,
  Edit3,
  Plus,
  MessageSquare,
  CheckCircle,
  Clock as ClockIcon,
  XCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useContact } from '../../contexts/ContactContext';

const ContactManagement = () => {
  const [activeSubTab, setActiveSubTab] = useState('info');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [inquiryFilter, setInquiryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditingContactInfo, setIsEditingContactInfo] = useState(false);
  const [isEditingInquiryTypes, setIsEditingInquiryTypes] = useState(false);
  const [isEditingMap, setIsEditingMap] = useState(false);
  const [isEditingEmailjs, setIsEditingEmailjs] = useState(false);
  const [isEditingCards, setIsEditingCards] = useState(false);
  const [isEditingDirections, setIsEditingDirections] = useState(false);
  const [editingContactData, setEditingContactData] = useState(null);
  const [editingInquiryTypes, setEditingInquiryTypes] = useState([]);
  const [editingMapConfig, setEditingMapConfig] = useState(null);
  const [editingEmailjsConfig, setEditingEmailjsConfig] = useState(null);
  const [editingCards, setEditingCards] = useState([]);
  const [editingDirections, setEditingDirections] = useState(null);

  const {
    contactInfo,
    inquiryTypes,
    mapConfig,
    emailjsConfig,
    cards,
    directions,
    inquiries,
    updateContactInfo,
    addInquiryType,
    updateInquiryType,
    deleteInquiryType,
    updateMapConfig,
    updateEmailjsConfig,
    addCard,
    updateCard,
    deleteCard,
    updateDirections,
    updateInquiryStatus,
    deleteInquiry,
    getPaginatedInquiries,
    getInquiryStats
  } = useContact();

  const subTabs = [
    { id: 'info', label: 'Contact Info', icon: Settings },
    { id: 'emailjs', label: 'EmailJS Settings', icon: Mail },
    { id: 'types', label: 'Inquiry Types', icon: Edit3 },
    { id: 'cards', label: 'Content Cards', icon: MessageSquare },
    { id: 'directions', label: 'Directions', icon: MapPin },
    { id: 'map', label: 'Map Settings', icon: MapPin }
  ];

  const inquiryStats = getInquiryStats();

  // Get paginated inquiries
  const paginatedData = getPaginatedInquiries(currentPage, 10, inquiryFilter);

  const handleSaveContactInfo = () => {
    if (editingContactData) {
      updateContactInfo(editingContactData);
      setIsEditingContactInfo(false);
      setEditingContactData(null);
    }
  };

  const handleEditContactInfo = () => {
    setEditingContactData(contactInfo);
    setIsEditingContactInfo(true);
  };

  const handleSaveInquiryTypes = () => {
    // Update existing types and add new ones
    editingInquiryTypes.forEach(type => {
      if (type.id && type.id > 0) {
        updateInquiryType(type.id, type);
      } else {
        addInquiryType(type);
      }
    });
    setIsEditingInquiryTypes(false);
    setEditingInquiryTypes([]);
  };

  const handleEditInquiryTypes = () => {
    setEditingInquiryTypes([...inquiryTypes]);
    setIsEditingInquiryTypes(true);
  };

  const handleAddInquiryType = () => {
    const newType = {
      id: Date.now() * -1, // Negative ID for new items
      label: '',
      value: ''
    };
    setEditingInquiryTypes([...editingInquiryTypes, newType]);
  };

  const handleRemoveInquiryType = (index) => {
    const type = editingInquiryTypes[index];
    if (type.id > 0) {
      deleteInquiryType(type.id);
    }
    const updated = editingInquiryTypes.filter((_, i) => i !== index);
    setEditingInquiryTypes(updated);
  };

  const handleSaveMapConfig = () => {
    if (editingMapConfig) {
      updateMapConfig(editingMapConfig);
      setIsEditingMap(false);
      setEditingMapConfig(null);
    }
  };

  const handleEditMap = () => {
    setEditingMapConfig(mapConfig);
    setIsEditingMap(true);
  };

  // EmailJS Config handlers
  const handleSaveEmailjsConfig = () => {
    if (editingEmailjsConfig) {
      updateEmailjsConfig(editingEmailjsConfig);
      setIsEditingEmailjs(false);
      setEditingEmailjsConfig(null);
    }
  };

  const handleEditEmailjs = () => {
    setEditingEmailjsConfig(emailjsConfig);
    setIsEditingEmailjs(true);
  };

  // Cards handlers
  const handleSaveCards = () => {
    editingCards.forEach(card => {
      if (card.id && card.id > 0) {
        updateCard(card.id, card);
      } else {
        addCard(card);
      }
    });
    setIsEditingCards(false);
    setEditingCards([]);
  };

  const handleEditCards = () => {
    setEditingCards([...cards]);
    setIsEditingCards(true);
  };

  const handleAddCard = () => {
    const newCard = {
      id: Date.now() * -1,
      title: '',
      content: '',
      icon: 'collaboration'
    };
    setEditingCards([...editingCards, newCard]);
  };

  const handleRemoveCard = (index) => {
    const card = editingCards[index];
    if (card.id > 0) {
      deleteCard(card.id);
    }
    const updated = editingCards.filter((_, i) => i !== index);
    setEditingCards(updated);
  };

  // Directions handlers
  const handleSaveDirections = () => {
    if (editingDirections) {
      updateDirections(editingDirections);
      setIsEditingDirections(false);
      setEditingDirections(null);
    }
  };

  const handleEditDirections = () => {
    setEditingDirections(directions);
    setIsEditingDirections(true);
  };

  const handleInquiryStatusChange = (inquiryId, newStatus) => {
    updateInquiryStatus(inquiryId, newStatus);
  };

  const handleDeleteInquiry = (inquiryId) => {
    if (window.confirm('Are you sure you want to delete this inquiry?')) {
      deleteInquiry(inquiryId);
    }
  };

  const renderContactInfoTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Contact Information
          </CardTitle>
          <Button
            onClick={isEditingContactInfo ? handleSaveContactInfo : handleEditContactInfo}
            size="sm"
            className={isEditingContactInfo ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {isEditingContactInfo ? 'Save Changes' : 'Edit Info'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isEditingContactInfo ? (
            <>
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-emerald-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">{contactInfo.address.title}</h4>
                  <p className="text-gray-600 whitespace-pre-line">{contactInfo.address.content}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">{contactInfo.phone.title}</h4>
                  {contactInfo.phone.numbers.map((number, idx) => (
                    <p key={idx} className="text-gray-600">{number}</p>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-purple-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">{contactInfo.email.title}</h4>
                  {contactInfo.email.addresses.map((email, idx) => (
                    <p key={idx} className="text-gray-600">{email}</p>
                  ))}
                </div>
              </div>

              {/* Office Hours */}
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-yellow-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">{contactInfo.officeHours.title}</h4>
                  <p className="text-gray-600 whitespace-pre-line">{contactInfo.officeHours.schedule}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              {/* Edit Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lab Address</label>
                <textarea
                  value={editingContactData?.address?.content || ''}
                  onChange={(e) => setEditingContactData({
                    ...editingContactData,
                    address: { ...editingContactData.address, content: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                  rows={4}
                />
              </div>

              {/* Edit Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Numbers</label>
                {editingContactData?.phone?.numbers?.map((number, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={number}
                    onChange={(e) => {
                      const updatedNumbers = [...editingContactData.phone.numbers];
                      updatedNumbers[idx] = e.target.value;
                      setEditingContactData({
                        ...editingContactData,
                        phone: { ...editingContactData.phone, numbers: updatedNumbers }
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 mb-2"
                    placeholder="Phone number"
                  />
                ))}
              </div>

              {/* Edit Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Addresses</label>
                {editingContactData?.email?.addresses?.map((email, idx) => (
                  <input
                    key={idx}
                    type="email"
                    value={email}
                    onChange={(e) => {
                      const updatedEmails = [...editingContactData.email.addresses];
                      updatedEmails[idx] = e.target.value;
                      setEditingContactData({
                        ...editingContactData,
                        email: { ...editingContactData.email, addresses: updatedEmails }
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 mb-2"
                    placeholder="Email address"
                  />
                ))}
              </div>

              {/* Edit Office Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Office Hours</label>
                <textarea
                  value={editingContactData?.officeHours?.schedule || ''}
                  onChange={(e) => setEditingContactData({
                    ...editingContactData,
                    officeHours: { ...editingContactData.officeHours, schedule: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderInquiriesTab = () => (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">{inquiryStats.total}</div>
            <div className="text-sm text-gray-600">Total Inquiries</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{inquiryStats.new}</div>
            <div className="text-sm text-gray-600">New</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{inquiryStats.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{inquiryStats.resolved}</div>
            <div className="text-sm text-gray-600">Resolved</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <select
          value={inquiryFilter}
          onChange={(e) => setInquiryFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">All Inquiries</option>
          <option value="new">New</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Inquiries List */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {paginatedData.inquiries.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No inquiries found.</p>
          ) : (
            <div className="space-y-4">
              {paginatedData.inquiries.map((inquiry) => (
                <div key={inquiry.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{inquiry.subject}</h4>
                      <p className="text-sm text-gray-600">
                        From: {inquiry.name} ({inquiry.email})
                      </p>
                      {inquiry.organization && (
                        <p className="text-sm text-gray-600">Organization: {inquiry.organization}</p>
                      )}
                      <p className="text-sm text-gray-500">
                        {new Date(inquiry.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={inquiry.status}
                        onChange={(e) => handleInquiryStatusChange(inquiry.id, e.target.value)}
                        className="text-xs px-2 py-1 border border-gray-300 rounded"
                      >
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                      <Button
                        onClick={() => setSelectedInquiry(inquiry)}
                        size="sm"
                        variant="outline"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteInquiry(inquiry.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                    {inquiry.message.length > 150 
                      ? inquiry.message.substring(0, 150) + '...'
                      : inquiry.message
                    }
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {inquiry.inquiryType}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      inquiry.status === 'new' ? 'bg-blue-100 text-blue-800' :
                      inquiry.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      inquiry.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {inquiry.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {paginatedData.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!paginatedData.hasPrevPage}
                size="sm"
                variant="outline"
              >
                Previous
              </Button>
              <span className="flex items-center px-3">
                {currentPage} of {paginatedData.totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!paginatedData.hasNextPage}
                size="sm"
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderInquiryTypesTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Inquiry Types Management</CardTitle>
          <div className="flex gap-2">
            {isEditingInquiryTypes && (
              <Button onClick={handleAddInquiryType} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Type
              </Button>
            )}
            <Button
              onClick={isEditingInquiryTypes ? handleSaveInquiryTypes : handleEditInquiryTypes}
              size="sm"
              className={isEditingInquiryTypes ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {isEditingInquiryTypes ? 'Save Changes' : 'Edit Types'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!isEditingInquiryTypes ? (
            <div className="space-y-2">
              {inquiryTypes.map((type) => (
                <div key={type.id} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                  <div>
                    <span className="font-medium">{type.label}</span>
                    <span className="text-gray-500 ml-2">({type.value})</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {editingInquiryTypes.map((type, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded">
                  <input
                    type="text"
                    value={type.label}
                    onChange={(e) => {
                      const updated = [...editingInquiryTypes];
                      updated[index] = { ...updated[index], label: e.target.value };
                      setEditingInquiryTypes(updated);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                    placeholder="Display Label"
                  />
                  <input
                    type="text"
                    value={type.value}
                    onChange={(e) => {
                      const updated = [...editingInquiryTypes];
                      updated[index] = { ...updated[index], value: e.target.value.toLowerCase().replace(/\s+/g, '_') };
                      setEditingInquiryTypes(updated);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                    placeholder="Value (auto-generated)"
                  />
                  <Button
                    onClick={() => handleRemoveInquiryType(index)}
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderMapTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Map Configuration
          </CardTitle>
          <Button
            onClick={isEditingMap ? handleSaveMapConfig : handleEditMap}
            size="sm"
            className={isEditingMap ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {isEditingMap ? 'Save Changes' : 'Edit Map'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isEditingMap ? (
            <>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Current Map Configuration</h4>
                <p className="text-sm text-gray-600">Title: {mapConfig.title}</p>
                <p className="text-sm text-gray-600 break-all">Embed URL: {mapConfig.embedUrl}</p>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <iframe
                  src={mapConfig.embedUrl}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={mapConfig.title}
                />
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Map Title</label>
                <input
                  type="text"
                  value={editingMapConfig?.title || ''}
                  onChange={(e) => setEditingMapConfig({
                    ...editingMapConfig,
                    title: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps Embed URL</label>
                <textarea
                  value={editingMapConfig?.embedUrl || ''}
                  onChange={(e) => setEditingMapConfig({
                    ...editingMapConfig,
                    embedUrl: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                  rows={4}
                  placeholder="Paste the Google Maps embed URL here..."
                />
              </div>
              {editingMapConfig?.embedUrl && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    src={editingMapConfig.embedUrl}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={editingMapConfig.title}
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderEmailjsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            EmailJS Configuration
          </CardTitle>
          <Button
            onClick={isEditingEmailjs ? handleSaveEmailjsConfig : handleEditEmailjs}
            size="sm"
            className={isEditingEmailjs ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {isEditingEmailjs ? 'Save Changes' : 'Edit Settings'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isEditingEmailjs ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Service ID</h4>
                  <p className="text-gray-600 font-mono text-sm bg-gray-50 p-2 rounded">
                    {emailjsConfig.serviceId}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Template ID</h4>
                  <p className="text-gray-600 font-mono text-sm bg-gray-50 p-2 rounded">
                    {emailjsConfig.templateId}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Public Key</h4>
                  <p className="text-gray-600 font-mono text-sm bg-gray-50 p-2 rounded">
                    {emailjsConfig.publicKey}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Recipient Email</h4>
                  <p className="text-gray-600 font-mono text-sm bg-gray-50 p-2 rounded">
                    {emailjsConfig.toEmail}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-900">Status:</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  emailjsConfig.enabled 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {emailjsConfig.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service ID</label>
                  <input
                    type="text"
                    value={editingEmailjsConfig?.serviceId || ''}
                    onChange={(e) => setEditingEmailjsConfig({
                      ...editingEmailjsConfig,
                      serviceId: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template ID</label>
                  <input
                    type="text"
                    value={editingEmailjsConfig?.templateId || ''}
                    onChange={(e) => setEditingEmailjsConfig({
                      ...editingEmailjsConfig,
                      templateId: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Public Key</label>
                  <input
                    type="text"
                    value={editingEmailjsConfig?.publicKey || ''}
                    onChange={(e) => setEditingEmailjsConfig({
                      ...editingEmailjsConfig,
                      publicKey: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Email</label>
                  <input
                    type="email"
                    value={editingEmailjsConfig?.toEmail || ''}
                    onChange={(e) => setEditingEmailjsConfig({
                      ...editingEmailjsConfig,
                      toEmail: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="emailjs-enabled"
                  checked={editingEmailjsConfig?.enabled || false}
                  onChange={(e) => setEditingEmailjsConfig({
                    ...editingEmailjsConfig,
                    enabled: e.target.checked
                  })}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="emailjs-enabled" className="text-sm font-medium text-gray-700">
                  Enable EmailJS Integration
                </label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Sub Navigation */}
      <div className="flex flex-wrap gap-2">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              variant={activeSubTab === tab.id ? 'default' : 'outline'}
              size="sm"
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Content */}
      {activeSubTab === 'info' && renderContactInfoTab()}
      {activeSubTab === 'emailjs' && renderEmailjsTab()}
      {activeSubTab === 'inquiries' && renderInquiriesTab()}
      {activeSubTab === 'types' && renderInquiryTypesTab()}
      {activeSubTab === 'map' && renderMapTab()}

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">Inquiry Details</h3>
                <Button
                  onClick={() => setSelectedInquiry(null)}
                  variant="outline"
                  size="sm"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Subject:</label>
                  <p className="text-gray-900">{selectedInquiry.subject}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name:</label>
                    <p className="text-gray-900">{selectedInquiry.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email:</label>
                    <p className="text-gray-900">{selectedInquiry.email}</p>
                  </div>
                </div>

                {(selectedInquiry.phone || selectedInquiry.organization) && (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedInquiry.phone && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Phone:</label>
                        <p className="text-gray-900">{selectedInquiry.phone}</p>
                      </div>
                    )}
                    {selectedInquiry.organization && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Organization:</label>
                        <p className="text-gray-900">{selectedInquiry.organization}</p>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-700">Inquiry Type:</label>
                  <p className="text-gray-900">{selectedInquiry.inquiryType}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Message:</label>
                  <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                    {selectedInquiry.message}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Submitted:</label>
                    <p className="text-gray-900">
                      {new Date(selectedInquiry.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status:</label>
                    <select
                      value={selectedInquiry.status}
                      onChange={(e) => handleInquiryStatusChange(selectedInquiry.id, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactManagement;