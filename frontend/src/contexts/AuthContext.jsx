import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth } from '../services/firebase';
import firebaseService from '../services/firebaseService';

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

// Default admin user credentials
const DEFAULT_ADMIN_CREDENTIALS = {
  username: 'admin',
  password: '@dminsesg405',
  email: 'admin@sesg.bracu.ac.bd'
};

// Default admin user data for Firebase
const DEFAULT_ADMIN = {
  username: 'admin',
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

  // Initialize authentication state with Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User is signed in, get additional user data from Firestore
          const userData = await firebaseService.getUserByUsername('admin');
          if (userData) {
            setUser({
              id: userData.id, // Use Firestore document ID instead of Firebase Auth UID
              uid: firebaseUser.uid, // Keep auth UID for reference
              email: firebaseUser.email,
              username: userData.username,
              role: userData.role,
              permissions: userData.permissions
            });
            setIsAuthenticated(true);
            
            // Update last login
            await firebaseService.updateUser(userData.id, {
              ...userData,
              lastLogin: new Date().toISOString()
            });
          } else {
            // If no user data in Firestore, sign out
            console.warn('No user data found in Firestore for authenticated user');
            await signOut(auth);
          }
        } else {
          // User is signed out
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        // Don't immediately sign out on error, just set user to null
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    });

    // Initialize users in Firebase if not exists
    initializeUsersInFirebase();

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const initializeUsersInFirebase = async () => {
    try {
      // Check if admin user exists in Firebase
      const existingAdmin = await firebaseService.getUserByUsername('admin');
      if (!existingAdmin) {
        console.log('🔄 Creating default admin user in Firebase...');
        await firebaseService.addUser(DEFAULT_ADMIN);
        console.log('✅ Default admin user created in Firebase');
      }
      
      // Load all users for admin panel
      const allUsers = await firebaseService.getUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error initializing users in Firebase:', error);
    }
  };

  // Login function with Firebase Authentication
  const login = async (username, password) => {
    try {
      // Check if credentials match default admin
      if (username === DEFAULT_ADMIN_CREDENTIALS.username && 
          password === DEFAULT_ADMIN_CREDENTIALS.password) {
        
        // Sign in with Firebase Authentication
        await signInWithEmailAndPassword(auth, DEFAULT_ADMIN_CREDENTIALS.email, password);
        
        return { success: true };
      } else {
        return { success: false, error: 'Invalid username or password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // If user doesn't exist in Firebase Auth, create it
      if (error.code === 'auth/user-not-found') {
        try {
          console.log('🔄 Creating admin user in Firebase Authentication...');
          await createUserWithEmailAndPassword(auth, DEFAULT_ADMIN_CREDENTIALS.email, DEFAULT_ADMIN_CREDENTIALS.password);
          console.log('✅ Admin user created in Firebase Authentication');
          return { success: true };
        } catch (createError) {
          console.error('Error creating admin user:', createError);
          return { success: false, error: 'Failed to create admin user' };
        }
      }
      
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  // Logout function with Firebase
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
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

  // Create new user (admin only) with Firebase
  const createUser = async (userData) => {
    if (!isAdmin()) {
      throw new Error('Only admins can create users');
    }

    try {
      const newUser = await firebaseService.addUser({
        ...userData,
        isActive: true,
        lastLogin: null
      });

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error: 'Failed to create user' };
    }
  };

  // Update user (admin only) with Firebase
  const updateUser = async (userId, updateData) => {
    if (!isAdmin()) {
      throw new Error('Only admins can update users');
    }

    try {
      await firebaseService.updateUser(userId, updateData);
      
      const updatedUsers = users.map(u => 
        u.id === userId ? { ...u, ...updateData } : u
      );
      setUsers(updatedUsers);
      
      return { success: true };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: 'Failed to update user' };
    }
  };

  // Delete user (admin only) with Firebase
  const deleteUser = async (userId) => {
    if (!isAdmin()) {
      throw new Error('Only admins can delete users');
    }

    if (userId === user?.id) {
      return { success: false, error: 'Cannot delete your own account' };
    }

    try {
      await firebaseService.deleteUser(userId);
      
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, error: 'Failed to delete user' };
    }
  };

  // Get all users (admin only) with Firebase
  const getAllUsers = async () => {
    if (!isAdmin()) {
      throw new Error('Only admins can view all users');
    }
    
    try {
      const allUsers = await firebaseService.getUsers();
      setUsers(allUsers);
      return allUsers;
    } catch (error) {
      console.error('Error getting all users:', error);
      return users; // Return cached users if Firebase call fails
    }
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