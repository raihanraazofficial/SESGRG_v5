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

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator'
};

// Permissions system - 13 specific permissions as requested
export const PERMISSIONS = {
  CREATE_CONTENT: 'create_content',
  EDIT_CONTENT: 'edit_content',
  DELETE_CONTENT: 'delete_content',
  PUBLISH_CONTENT: 'publish_content',
  CREATE_USERS: 'create_users',
  EDIT_USERS: 'edit_users',
  DELETE_USERS: 'delete_users',
  VIEW_USERS: 'view_users',
  CREATE_PAGES: 'create_pages',
  EDIT_PAGES: 'edit_pages',
  DELETE_PAGES: 'delete_pages',
  VIEW_ANALYTICS: 'view_analytics',
  SYSTEM_SETTINGS: 'system_settings'
};

// Default role permissions
const DEFAULT_PERMISSIONS = {
  [USER_ROLES.ADMIN]: Object.values(PERMISSIONS), // Admin gets all permissions
  [USER_ROLES.MODERATOR]: [ // Moderator gets limited permissions
    PERMISSIONS.CREATE_CONTENT,
    PERMISSIONS.EDIT_CONTENT,
    PERMISSIONS.DELETE_CONTENT,
    PERMISSIONS.PUBLISH_CONTENT,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_PAGES,
    PERMISSIONS.EDIT_PAGES,
    PERMISSIONS.VIEW_ANALYTICS
  ]
};

// New admin credentials as requested
const DEFAULT_ADMIN_CREDENTIALS = {
  username: 'admin',
  password: '@dminsesg705',
  email: 'admin@sesg.bracu.ac.bd'
};

// Default admin user data
const DEFAULT_ADMIN = {
  username: 'admin',
  email: 'admin@sesg.bracu.ac.bd',
  firstName: 'System',
  lastName: 'Administrator',
  role: USER_ROLES.ADMIN,
  permissions: DEFAULT_PERMISSIONS[USER_ROLES.ADMIN],
  isActive: true,
  isSystemAdmin: true,
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
          // User is signed in, get user data from Firestore
          console.log('🔄 Firebase user authenticated:', firebaseUser.email);
          
          const allUsers = await firebaseService.getUsers();
          const userData = allUsers.find(user => user.email === firebaseUser.email);
          
          if (userData) {
            console.log('✅ User data found:', userData.username);
            setUser({
              id: userData.id,
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              username: userData.username,
              firstName: userData.firstName,
              lastName: userData.lastName,
              role: userData.role,
              permissions: userData.permissions,
              isSystemAdmin: userData.isSystemAdmin
            });
            setIsAuthenticated(true);
            
            // Update last login
            await firebaseService.updateUser(userData.id, {
              ...userData,
              lastLogin: new Date().toISOString()
            });
          } else {
            console.warn('No user data found for:', firebaseUser.email);
            await signOut(auth);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    });

    // Initialize users in Firebase
    initializeUsersInFirebase();

    return () => unsubscribe();
  }, []);

  const initializeUsersInFirebase = async () => {
    try {
      console.log('🔄 Initializing users in Firebase...');
      
      // Check if admin user exists
      const existingAdmin = await firebaseService.getUserByUsername('admin');
      if (!existingAdmin) {
        console.log('🔄 Creating default admin user...');
        const newAdminUser = {
          ...DEFAULT_ADMIN,
          id: 'admin_' + Date.now()
        };
        await firebaseService.addUser(newAdminUser);
        console.log('✅ Default admin user created');
      }
      
      // Load all users
      const allUsers = await firebaseService.getUsers();
      setUsers(allUsers);
      console.log('📊 Loaded users:', allUsers.length);
    } catch (error) {
      console.error('❌ Error initializing users:', error);
      // Initialize with default admin if Firebase fails
      const defaultUsers = [{
        ...DEFAULT_ADMIN,
        id: 'admin_default'
      }];
      setUsers(defaultUsers);
    }
  };

  // Login function
  const login = async (username, password) => {
    try {
      console.log('🔄 Attempting login for:', username);
      
      // Get user data from Firestore
      const userData = await firebaseService.getUserByUsername(username);
      if (!userData) {
        return { success: false, error: 'Invalid username or password' };
      }
      
      // Special handling for default admin credentials
      if (username === DEFAULT_ADMIN_CREDENTIALS.username && 
          password === DEFAULT_ADMIN_CREDENTIALS.password) {
        
        try {
          await signInWithEmailAndPassword(auth, userData.email, password);
          console.log('✅ Admin successfully signed in');
          return { success: true };
        } catch (authError) {
          console.log('🔄 Admin user not found in Firebase Auth, creating...');
          
          if (authError.code === 'auth/user-not-found' || authError.code === 'auth/invalid-credential') {
            try {
              await createUserWithEmailAndPassword(auth, userData.email, password);
              console.log('✅ Admin user created in Firebase Auth');
              return { success: true };
            } catch (createError) {
              console.error('❌ Error creating admin user:', createError);
              return { success: false, error: 'Failed to create admin account' };
            }
          } else {
            return { success: false, error: 'Authentication error' };
          }
        }
      } else {
        // For other users
        try {
          await signInWithEmailAndPassword(auth, userData.email, password);
          return { success: true };
        } catch (authError) {
          if (authError.code === 'auth/wrong-password') {
            return { success: false, error: 'Invalid username or password' };
          }
          return { success: false, error: 'Authentication failed' };
        }
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Permission checking functions
  const hasPermission = (permission) => {
    if (!user || !isAuthenticated) return false;
    return user.permissions && user.permissions.includes(permission);
  };

  const hasRole = (role) => {
    if (!user || !isAuthenticated) return false;
    return user.role === role;
  };

  const isAdmin = () => hasRole(USER_ROLES.ADMIN);
  const isModerator = () => hasRole(USER_ROLES.MODERATOR);

  // User management functions (admin only)
  const createUser = async (userData) => {
    if (!isAdmin()) {
      return { success: false, error: 'Only admins can create users' };
    }

    try {
      const newUser = {
        ...userData,
        id: userData.username + '_' + Date.now(),
        isActive: true,
        isSystemAdmin: false,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        permissions: userData.permissions || DEFAULT_PERMISSIONS[userData.role] || []
      };

      const createdUser = await firebaseService.addUser(newUser);
      const updatedUsers = [...users, createdUser];
      setUsers(updatedUsers);
      
      return { success: true, user: createdUser };
    } catch (error) {
      return { success: false, error: 'Failed to create user' };
    }
  };

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
      return { success: false, error: 'Failed to update user' };
    }
  };

  const deleteUser = async (userId) => {
    if (!isAdmin()) {
      throw new Error('Only admins can delete users');
    }

    if (userId === user?.id) {
      return { success: false, error: 'Cannot delete your own account' };
    }

    const targetUser = users.find(u => u.id === userId);
    if (targetUser?.isSystemAdmin) {
      return { success: false, error: 'System admin account cannot be deleted' };
    }

    try {
      await firebaseService.deleteUser(userId);
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete user' };
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
    isModerator,
    
    // User management
    users,
    createUser,
    updateUser,
    deleteUser,
    
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