import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth } from '../services/firebase';
import firebaseService from '../services/firebaseService';

// Session configuration
const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds
const ACTIVITY_CHECK_INTERVAL = 60 * 1000; // Check every minute

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
  ADVISOR: 'advisor',
  TEAM_MEMBER: 'team_member',
  COLLABORATOR: 'collaborator'
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
  SYSTEM_SETTINGS: 'system_settings',
  
  // Research Management
  MANAGE_PUBLICATIONS: 'manage_publications',
  MANAGE_PROJECTS: 'manage_projects',
  MANAGE_PEOPLE: 'manage_people',
  MANAGE_ACHIEVEMENTS: 'manage_achievements',
  MANAGE_NEWS_EVENTS: 'manage_news_events'
};

// Default role permissions
const DEFAULT_PERMISSIONS = {
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
  firstName: 'System',
  lastName: 'Administrator',
  profilePicture: '',
  position: 'System Admin',
  role: USER_ROLES.ADMIN,
  permissions: DEFAULT_PERMISSIONS[USER_ROLES.ADMIN],
  isActive: true,
  isSystemAdmin: true, // Protected system admin
  createdAt: new Date().toISOString(),
  lastLogin: null,
  lastActivity: new Date().toISOString()
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
      console.log('🔄 Initializing users in Firebase...');
      
      // Check if admin user exists in Firebase
      const existingAdmin = await firebaseService.getUserByUsername('admin');
      if (!existingAdmin) {
        console.log('🔄 Creating default admin user in Firebase...');
        const newAdminUser = {
          ...DEFAULT_ADMIN,
          createdAt: new Date().toISOString(),
          id: 'admin_' + Date.now() // Ensure unique ID
        };
        await firebaseService.addUser(newAdminUser);
        console.log('✅ Default admin user created in Firebase');
      } else {
        console.log('✅ Admin user already exists in Firebase:', existingAdmin.username);
      }
      
      // Load all users for admin panel
      const allUsers = await firebaseService.getUsers();
      console.log('📊 Loaded users from Firebase:', allUsers.length);
      console.log('📊 Users data:', allUsers);
      setUsers(allUsers);
    } catch (error) {
      console.error('❌ Error initializing users in Firebase:', error);
      // Initialize with default admin if Firebase fails
      console.log('🔄 Initializing with default admin user...');
      const defaultUsers = [{
        ...DEFAULT_ADMIN,
        id: 'admin_default',
        createdAt: new Date().toISOString()
      }];
      console.log('📊 Setting default users:', defaultUsers);
      setUsers(defaultUsers);
    }
  };

  // Login function with Firebase Authentication
  const login = async (username, password) => {
    try {
      console.log('🔄 Attempting login for:', username);
      
      // Check if credentials match default admin
      if (username === DEFAULT_ADMIN_CREDENTIALS.username && 
          password === DEFAULT_ADMIN_CREDENTIALS.password) {
        
        try {
          // Try to sign in with Firebase Authentication
          await signInWithEmailAndPassword(auth, DEFAULT_ADMIN_CREDENTIALS.email, password);
          console.log('✅ Successfully signed in with Firebase Auth');
          return { success: true };
        } catch (authError) {
          console.log('🔄 Firebase Auth user not found, creating new user...');
          
          // If user doesn't exist in Firebase Auth, create it
          if (authError.code === 'auth/user-not-found' || authError.code === 'auth/invalid-credential') {
            try {
              await createUserWithEmailAndPassword(auth, DEFAULT_ADMIN_CREDENTIALS.email, DEFAULT_ADMIN_CREDENTIALS.password);
              console.log('✅ Admin user created in Firebase Authentication');
              return { success: true };
            } catch (createError) {
              console.error('❌ Error creating admin user in Firebase Auth:', createError);
              return { success: false, error: 'Failed to create admin account: ' + createError.message };
            }
          } else {
            console.error('❌ Firebase Auth error:', authError);
            return { success: false, error: 'Authentication error: ' + authError.message };
          }
        }
      } else {
        return { success: false, error: 'Invalid username or password' };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: 'Login failed: ' + error.message };
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
      return { success: false, error: 'Only admins can create users' };
    }

    // Prevent creation of new system admins (only allow regular admins, advisors, team members, collaborators)
    if (userData.role === USER_ROLES.ADMIN && user?.isSystemAdmin !== true) {
      return { success: false, error: 'Only system admin can create admin users' };
    }

    try {
      console.log('🔄 Creating new user:', userData.username);
      
      // Create user in Firestore
      const newUser = {
        ...userData,
        id: userData.username + '_' + Date.now(), // Generate unique ID
        isActive: true,
        isSystemAdmin: false, // New users are never system admins
        createdAt: new Date().toISOString(),
        lastLogin: null,
        lastActivity: new Date().toISOString(),
        permissions: userData.permissions || DEFAULT_PERMISSIONS[userData.role] || []
      };

      const createdUser = await firebaseService.addUser(newUser);
      console.log('✅ User created in Firebase:', createdUser);

      // Update local users state
      const updatedUsers = [...users, createdUser];
      setUsers(updatedUsers);
      
      return { success: true, user: createdUser };
    } catch (error) {
      console.error('❌ Error creating user:', error);
      return { success: false, error: error.message || 'Failed to create user' };
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

    // Find the user to check if they're system admin or advisor
    const targetUser = users.find(u => u.id === userId);
    if (targetUser?.isSystemAdmin) {
      return { success: false, error: 'System admin account cannot be deleted' };
    }

    if (targetUser?.role === USER_ROLES.ADVISOR && user?.isSystemAdmin !== true) {
      return { success: false, error: 'Only system admin can delete advisor accounts' };
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