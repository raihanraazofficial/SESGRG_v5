import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// User roles and permissions
export const USER_ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  VIEWER: 'viewer'
};

export const PERMISSIONS = {
  // Content Management
  CREATE_CONTENT: 'create_content',
  EDIT_CONTENT: 'edit_content', 
  DELETE_CONTENT: 'delete_content',
  PUBLISH_CONTENT: 'publish_content',
  
  // User Management
  CREATE_USERS: 'create_users',
  EDIT_USERS: 'edit_users',
  DELETE_USERS: 'delete_users',
  VIEW_USERS: 'view_users',
  
  // Page Management
  CREATE_PAGES: 'create_pages',
  EDIT_PAGES: 'edit_pages',
  DELETE_PAGES: 'delete_pages',
  
  // System Management
  VIEW_ANALYTICS: 'view_analytics',
  SYSTEM_SETTINGS: 'system_settings'
};

// Default role permissions
const DEFAULT_PERMISSIONS = {
  [USER_ROLES.ADMIN]: Object.values(PERMISSIONS),
  [USER_ROLES.MODERATOR]: [
    PERMISSIONS.CREATE_CONTENT,
    PERMISSIONS.EDIT_CONTENT,
    PERMISSIONS.PUBLISH_CONTENT,
    PERMISSIONS.VIEW_USERS
  ],
  [USER_ROLES.VIEWER]: []
};

// Default admin user
const DEFAULT_ADMIN = {
  id: 'admin-001',
  username: 'admin',
  password: '@dminsesg405',
  email: 'admin@sesg.bracu.ac.bd',
  role: USER_ROLES.ADMIN,
  permissions: DEFAULT_PERMISSIONS[USER_ROLES.ADMIN],
  isActive: true,
  createdAt: new Date().toISOString(),
  lastLogin: null
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);

  // Initialize authentication state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = () => {
    try {
      // Initialize users in localStorage if not exists
      const storedUsers = localStorage.getItem('sesg_users');
      if (!storedUsers) {
        const initialUsers = [DEFAULT_ADMIN];
        localStorage.setItem('sesg_users', JSON.stringify(initialUsers));
        setUsers(initialUsers);
      } else {
        setUsers(JSON.parse(storedUsers));
      }

      // Check for existing session
      const sessionUser = localStorage.getItem('sesg_auth_user'); 
      const sessionExpiry = localStorage.getItem('sesg_auth_expiry');
      
      if (sessionUser && sessionExpiry) {
        const expiryTime = new Date(sessionExpiry);
        const currentTime = new Date();
        
        if (currentTime < expiryTime) {
          const userData = JSON.parse(sessionUser);
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          clearSession();
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      clearSession();
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (username, password) => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem('sesg_users') || '[]');
      const foundUser = storedUsers.find(u => 
        u.username === username && u.password === password && u.isActive
      );

      if (foundUser) {
        // Update last login
        foundUser.lastLogin = new Date().toISOString();
        const updatedUsers = storedUsers.map(u => 
          u.id === foundUser.id ? foundUser : u
        );
        localStorage.setItem('sesg_users', JSON.stringify(updatedUsers));
        setUsers(updatedUsers);

        // Create session (expires in 24 hours)
        const expiryTime = new Date();
        expiryTime.setHours(expiryTime.getHours() + 24);
        
        const sessionData = {
          id: foundUser.id,
          username: foundUser.username,
          email: foundUser.email,
          role: foundUser.role,
          permissions: foundUser.permissions
        };

        localStorage.setItem('sesg_auth_user', JSON.stringify(sessionData));
        localStorage.setItem('sesg_auth_expiry', expiryTime.toISOString());
        
        setUser(sessionData);
        setIsAuthenticated(true);
        
        return { success: true };
      } else {
        return { success: false, error: 'Invalid username or password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  // Logout function
  const logout = () => {
    clearSession();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Clear session data
  const clearSession = () => {
    localStorage.removeItem('sesg_auth_user');
    localStorage.removeItem('sesg_auth_expiry');
  };

  // Check if user has specific permission
  const hasPermission = (permission) => {
    if (!user || !isAuthenticated) return false;
    return user.permissions && user.permissions.includes(permission);
  };

  // Check if user has role
  const hasRole = (role) => {
    if (!user || !isAuthenticated) return false;
    return user.role === role;
  };

  // Check if user is admin
  const isAdmin = () => hasRole(USER_ROLES.ADMIN);

  // Create new user (admin only)
  const createUser = (userData) => {
    if (!isAdmin()) {
      throw new Error('Only admins can create users');
    }

    try {
      const newUser = {
        id: `user-${Date.now()}`,
        ...userData,
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLogin: null
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem('sesg_users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error: 'Failed to create user' };
    }
  };

  // Update user (admin only)
  const updateUser = (userId, updateData) => {
    if (!isAdmin()) {
      throw new Error('Only admins can update users');
    }

    try {
      const updatedUsers = users.map(u => 
        u.id === userId ? { ...u, ...updateData } : u
      );
      
      localStorage.setItem('sesg_users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      
      return { success: true };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: 'Failed to update user' };
    }
  };

  // Delete user (admin only)  
  const deleteUser = (userId) => {
    if (!isAdmin()) {
      throw new Error('Only admins can delete users');
    }

    if (userId === user?.id) {
      return { success: false, error: 'Cannot delete your own account' };
    }

    try {
      const updatedUsers = users.filter(u => u.id !== userId);
      localStorage.setItem('sesg_users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, error: 'Failed to delete user' };
    }
  };

  // Get all users (admin only)
  const getAllUsers = () => {
    if (!isAdmin()) {
      throw new Error('Only admins can view all users');
    }
    return users;
  };

  // Context value
  const contextValue = {
    // Auth state
    user,
    isAuthenticated,
    isLoading,
    
    // Auth methods
    login,
    logout,
    
    // Permission methods
    hasPermission,
    hasRole,
    isAdmin,
    
    // User management (admin only)
    users,
    createUser,
    updateUser,
    deleteUser,
    getAllUsers,
    
    // Constants
    USER_ROLES,
    PERMISSIONS,
    DEFAULT_PERMISSIONS
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;