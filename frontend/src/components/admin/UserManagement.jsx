import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Search, 
  Filter,
  Shield,
  Mail,
  Calendar,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { useAuth } from '../../contexts/AuthContext';
import { usePeople } from '../../contexts/PeopleContext';

const UserManagement = () => {
  const { users, createUser, updateUser, deleteUser, USER_ROLES, PERMISSIONS, isLoading: authLoading } = useAuth();
  const { addPerson, deletePerson } = usePeople();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [componentLoading, setComponentLoading] = useState(true);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    profilePicture: '',
    position: 'Team Member',
    role: USER_ROLES.COLLABORATOR,
    permissions: []
  });
  const [showPassword, setShowPassword] = useState(false);

  // Use effect to handle loading state
  React.useEffect(() => {
    console.log('👥 UserManagement useEffect - authLoading:', authLoading, 'users:', users);
    if (!authLoading && users !== undefined) {
      console.log('👥 UserManagement - Setting component loading to false');
      setComponentLoading(false);
    }
  }, [authLoading, users]);

  // Filter users
  const filteredUsers = (users || []).filter(user => {
    const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });
  
  // Debug logging
  React.useEffect(() => {
    console.log('👥 UserManagement - users:', users);
    console.log('👥 UserManagement - filteredUsers:', filteredUsers);
    console.log('👥 UserManagement - authLoading:', authLoading);
    console.log('👥 UserManagement - componentLoading:', componentLoading);
  }, [users, filteredUsers, authLoading, componentLoading]);

  // Map SESGRG position to People context category
  const mapPositionToCategory = (position) => {
    const mapping = {
      'Advisor': 'advisors',
      'Team Member': 'teamMembers', 
      'Collaborator': 'collaborators'
    };
    return mapping[position] || 'collaborators';
  };

  // Create People page entry from user data
  const createPeopleEntry = (userData) => {
    return {
      name: `${userData.firstName} ${userData.lastName}`,
      designation: userData.position || 'Team Member',
      affiliation: 'BRAC University',
      description: `${userData.position} at Sustainable Energy and Smart Grid Research Lab. Contact: ${userData.email}`,
      expertise: [], // Can be updated later via People management
      photo: userData.profilePicture || 'https://via.placeholder.com/300x400?text=Profile+Photo',
      email: userData.email,
      phone: '+880-000-000-0000', // Default phone
      // Research profile links - defaults
      website: '#',
      googleScholar: '#',
      researchGate: '#',
      orcid: '#',
      linkedin: '#',
      github: '#',
      ieee: '#'
    };
  };

  // Get default permissions for role
  const getDefaultPermissionsForRole = (role) => {
    const rolePermissions = {
      [USER_ROLES.ADMIN]: Object.values(PERMISSIONS),
      [USER_ROLES.ADVISOR]: [
        PERMISSIONS.CREATE_CONTENT,
        PERMISSIONS.EDIT_CONTENT,
        PERMISSIONS.DELETE_CONTENT,
        PERMISSIONS.PUBLISH_CONTENT,
        PERMISSIONS.VIEW_USERS,
        PERMISSIONS.CREATE_PAGES,
        PERMISSIONS.EDIT_PAGES,
        PERMISSIONS.VIEW_ANALYTICS,
        PERMISSIONS.MANAGE_PUBLICATIONS,
        PERMISSIONS.MANAGE_PROJECTS,
        PERMISSIONS.MANAGE_PEOPLE,
        PERMISSIONS.MANAGE_ACHIEVEMENTS,
        PERMISSIONS.MANAGE_NEWS_EVENTS
      ],
      [USER_ROLES.TEAM_MEMBER]: [
        PERMISSIONS.CREATE_CONTENT,
        PERMISSIONS.EDIT_CONTENT,
        PERMISSIONS.PUBLISH_CONTENT,
        PERMISSIONS.VIEW_USERS,
        PERMISSIONS.MANAGE_PUBLICATIONS,
        PERMISSIONS.MANAGE_PROJECTS,
        PERMISSIONS.MANAGE_ACHIEVEMENTS,
        PERMISSIONS.MANAGE_NEWS_EVENTS
      ],
      [USER_ROLES.COLLABORATOR]: [
        PERMISSIONS.CREATE_CONTENT,
        PERMISSIONS.EDIT_CONTENT,
        PERMISSIONS.VIEW_USERS,
        PERMISSIONS.MANAGE_PUBLICATIONS,
        PERMISSIONS.MANAGE_PROJECTS
      ]
    };
    return rolePermissions[role] || [];
  };

  // Handle form changes
  const handleFormChange = (field, value) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      // Auto-set permissions when role changes
      if (field === 'role') {
        newData.permissions = getDefaultPermissionsForRole(value);
      }
      
      return newData;
    });
  };

  // Handle permission changes
  const handlePermissionChange = (permission, checked) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev.permissions, permission]
        : prev.permissions.filter(p => p !== permission)
    }));
  };

  // Handle add user
  const handleAddUser = async () => {
    if (!formData.username || !formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      alert('Please fill in all required fields (Username, Email, Password, First Name, Last Name)');
      return;
    }

    setIsLoading(true);
    try {
      // Create user first
      const result = await createUser(formData);
      if (result.success) {
        // Create corresponding People page entry
        try {
          const peopleCategory = mapPositionToCategory(formData.position);
          const peopleData = createPeopleEntry(formData);
          await addPerson(peopleCategory, peopleData);
          console.log(`✅ Created People page entry for user: ${formData.username}`);
        } catch (peopleError) {
          console.error('⚠️ Failed to create People page entry:', peopleError);
          // Don't fail the whole operation, just log the error
        }
        
        alert('User created successfully! A profile card has been added to the People page.');
        setIsAddModalOpen(false);
        resetForm();
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Error creating user: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit user
  const handleEditUser = async () => {
    if (!editingUser) return;

    setIsLoading(true);
    try {
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password; // Don't update password if empty
      }
      
      const result = await updateUser(editingUser.id, updateData);
      if (result.success) {
        alert('User updated successfully!');
        setIsEditModalOpen(false);
        setEditingUser(null);
        resetForm();
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Error updating user: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!editingUser) return;

    setIsLoading(true);
    try {
      // Delete user first
      const result = await deleteUser(editingUser.id);
      if (result.success) {
        // Remove corresponding People page entry
        try {
          const peopleCategory = mapPositionToCategory(editingUser.position);
          // Find the person by name in PeopleContext and delete
          // Note: This is a simplified approach - in production you might want to store the People ID in user data
          // For now, we'll log this action
          console.log(`🗑️ Should remove People page entry for user: ${editingUser.username} from category: ${peopleCategory}`);
          // await deletePerson(peopleCategory, personId); // Would need the People page ID
        } catch (peopleError) {
          console.error('⚠️ Failed to remove People page entry:', peopleError);
          // Don't fail the whole operation, just log the error
        }
        
        alert('User deleted successfully! The profile card has been removed from the People page.');
        setIsDeleteModalOpen(false);
        setEditingUser(null);
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Error deleting user: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    const defaultRole = USER_ROLES.COLLABORATOR;
    setFormData({
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      profilePicture: '',
      position: 'Team Member',
      role: defaultRole,
      permissions: getDefaultPermissionsForRole(defaultRole)
    });
    setShowPassword(false);
  };

  // Open modals
  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      profilePicture: user.profilePicture || '',
      position: user.position || 'Team Member',
      role: user.role,
      permissions: user.permissions || []
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setEditingUser(user);
    setIsDeleteModalOpen(true);
  };

  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return 'bg-red-100 text-red-700';
      case USER_ROLES.ADVISOR:
        return 'bg-purple-100 text-purple-700';
      case USER_ROLES.TEAM_MEMBER:
        return 'bg-blue-100 text-blue-700';
      case USER_ROLES.COLLABORATOR:
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Show loading state
  if (authLoading || componentLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-2">Loading users...</p>
          </div>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage admin and moderator accounts ({filteredUsers.length} users)</p>
        </div>
        <Button 
          onClick={openAddModal}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">All Roles</option>
            <option value={USER_ROLES.ADMIN}>Admins</option>
            <option value={USER_ROLES.ADVISOR}>Advisors</option>
            <option value={USER_ROLES.TEAM_MEMBER}>Team Members</option>
            <option value={USER_ROLES.COLLABORATOR}>Collaborators</option>
          </select>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.length === 0 ? (
          <div className="col-span-full">
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || selectedRole !== 'all' 
                    ? 'No users match your current filters' 
                    : 'Get started by creating your first user'
                  }
                </p>
                <Button onClick={openAddModal} className="bg-emerald-600 hover:bg-emerald-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New User
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {user.profilePicture ? (
                        <img 
                          src={user.profilePicture} 
                          alt={`${user.firstName || user.username}'s profile`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <Users className={`h-5 w-5 text-gray-600 ${user.profilePicture ? 'hidden' : ''}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {user.firstName && user.lastName 
                          ? `${user.firstName} ${user.lastName}` 
                          : user.username}
                        {user.isSystemAdmin && (
                          <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                            System Admin
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      {user.position && (
                        <p className="text-xs text-gray-500">{user.position}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditModal(user)}
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    {!user.isSystemAdmin && user.role !== USER_ROLES.ADVISOR && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDeleteModal(user)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Role:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Created:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {user.lastLogin ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Login:</span>
                      <span className="text-sm text-gray-900">
                        {new Date(user.lastLogin).toLocaleString('en-GB', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Login:</span>
                      <span className="text-sm text-gray-500">Never logged in</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-sm text-gray-600">Permissions: {user.permissions?.length || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add User Modal - Full Screen Responsive */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4">
            <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-4 sm:p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Add New User</h2>
              
              <div className="space-y-4">
                {/* Username and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username *
                    </label>
                    <Input
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleFormChange('username', e.target.value)}
                      placeholder="Enter username"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      placeholder="Enter email address"
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleFormChange('password', e.target.value)}
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <Input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleFormChange('firstName', e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <Input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleFormChange('lastName', e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                {/* Profile Picture URL - Full Width */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Picture URL
                  </label>
                  <Input
                    type="url"
                    value={formData.profilePicture}
                    onChange={(e) => handleFormChange('profilePicture', e.target.value)}
                    placeholder="https://example.com/profile-picture.jpg"
                    className="w-full"
                  />
                </div>

                {/* Position and Role Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position in SESGRG
                    </label>
                    <select
                      value={formData.position}
                      onChange={(e) => handleFormChange('position', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="Advisor">Advisor</option>
                      <option value="Team Member">Team Member</option>
                      <option value="Collaborator">Collaborator</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => handleFormChange('role', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value={USER_ROLES.ADVISOR}>Advisor</option>
                      <option value={USER_ROLES.TEAM_MEMBER}>Team Member</option>
                      <option value={USER_ROLES.COLLABORATOR}>Collaborator</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">System admin accounts cannot be created through this interface</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permissions
                    <span className="text-xs text-gray-500 ml-2">(Auto-selected based on role)</span>
                  </label>
                  <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Object.values(PERMISSIONS).map((permission) => (
                        <label key={permission} className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={formData.permissions.includes(permission)}
                            onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 mr-2"
                          />
                          <span className="text-gray-700 capitalize">
                            {permission.replace(/_/g, ' ').toLowerCase()}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Permissions are automatically set based on the selected role. You can customize them as needed.
                  </p>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  onClick={handleAddUser}
                  disabled={isLoading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  {isLoading ? 'Creating...' : 'Create User'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal - Full Screen Responsive */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4">
            <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-4 sm:p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Edit User</h2>
              
              <div className="space-y-4">
                {/* Username and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username *
                    </label>
                    <Input
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleFormChange('username', e.target.value)}
                      placeholder="Enter username"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      placeholder="Enter email address"
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password (leave empty to keep current)
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleFormChange('password', e.target.value)}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <Input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleFormChange('firstName', e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <Input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleFormChange('lastName', e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                {/* Profile Picture URL - Full Width */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Picture URL
                  </label>
                  <Input
                    type="url"
                    value={formData.profilePicture}
                    onChange={(e) => handleFormChange('profilePicture', e.target.value)}
                    placeholder="https://example.com/profile-picture.jpg"
                    className="w-full"
                  />
                </div>

                {/* Position and Role Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position in SESGRG
                    </label>
                    <select
                      value={formData.position}
                      onChange={(e) => handleFormChange('position', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="Advisor">Advisor</option>
                      <option value="Team Member">Team Member</option>
                      <option value="Collaborator">Collaborator</option>
                    </select>
                  </div>

                  {!editingUser.isSystemAdmin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => handleFormChange('role', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value={USER_ROLES.ADVISOR}>Advisor</option>
                        <option value={USER_ROLES.TEAM_MEMBER}>Team Member</option>
                        <option value={USER_ROLES.COLLABORATOR}>Collaborator</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">System admin accounts cannot be created through this interface</p>
                    </div>
                  )}

                  {editingUser.isSystemAdmin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <input
                        type="text"
                        value="System Admin"
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600"
                      />
                      <p className="text-xs text-gray-500 mt-1">System admin role cannot be changed</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permissions
                    <span className="text-xs text-gray-500 ml-2">(Auto-selected based on role)</span>
                  </label>
                  <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Object.values(PERMISSIONS).map((permission) => (
                        <label key={permission} className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={formData.permissions.includes(permission)}
                            onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 mr-2"
                          />
                          <span className="text-gray-700 capitalize">
                            {permission.replace(/_/g, ' ').toLowerCase()}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Permissions are automatically set based on the selected role. You can customize them as needed.
                  </p>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  onClick={handleEditUser}
                  disabled={isLoading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  {isLoading ? 'Updating...' : 'Update User'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h2>
              
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete the user "{editingUser.username}"? This action cannot be undone.
              </p>

              <div className="flex space-x-3">
                <Button
                  onClick={handleDeleteUser}
                  disabled={isLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {isLoading ? 'Deleting...' : 'Delete User'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;