import React, { useState } from 'react';
import { Database, Upload, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import firebaseService from '../services/firebaseService';

const DataMigration = () => {
  const [migrationStatus, setMigrationStatus] = useState('ready'); // ready, migrating, success, error
  const [migrationResults, setMigrationResults] = useState(null);
  const [error, setError] = useState(null);

  const handleStartMigration = async () => {
    try {
      setMigrationStatus('migrating');
      setError(null);
      setMigrationResults(null);

      console.log('🚀 Starting data migration from localStorage to Firebase...');
      
      const results = await firebaseService.migrateFromLocalStorage();
      
      setMigrationResults(results);
      setMigrationStatus('success');
      
      console.log('✅ Migration completed successfully:', results);
      
      // Optional: Clear localStorage after successful migration
      const shouldClearLocalStorage = window.confirm(
        'Migration completed successfully! Would you like to clear the old localStorage data?'
      );
      
      if (shouldClearLocalStorage) {
        firebaseService.clearLocalStorageData();
        alert('LocalStorage data cleared successfully!');
      }
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      setError(error.message);
      setMigrationStatus('error');
    }
  };

  const handleResetMigration = () => {
    setMigrationStatus('ready');
    setMigrationResults(null);
    setError(null);
  };

  const getMigrationIcon = () => {
    switch (migrationStatus) {
      case 'migrating':
        return <Loader className="w-6 h-6 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Database className="w-6 h-6 text-gray-500" />;
    }
  };

  const getMigrationTitle = () => {
    switch (migrationStatus) {
      case 'migrating':
        return 'Migrating Data...';
      case 'success':
        return 'Migration Completed Successfully!';
      case 'error':
        return 'Migration Failed';
      default:
        return 'Data Migration from localStorage to Firebase';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {getMigrationIcon()}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {getMigrationTitle()}
          </h2>
          
          {migrationStatus === 'ready' && (
            <p className="text-gray-600">
              This will migrate all your data from localStorage to Firebase Firestore.
              <br />
              <strong>Warning:</strong> Make sure you have a backup before proceeding.
            </p>
          )}
          
          {migrationStatus === 'migrating' && (
            <p className="text-blue-600">
              Please wait while we transfer your data to Firebase...
            </p>
          )}
        </div>

        {/* Migration Button */}
        {migrationStatus === 'ready' && (
          <div className="text-center mb-8">
            <button
              onClick={handleStartMigration}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Upload className="w-5 h-5 mr-2" />
              Start Migration
            </button>
          </div>
        )}

        {/* Migration Results */}
        {migrationStatus === 'success' && migrationResults && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4">
              Migration Results
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(migrationResults).map(([key, count]) => (
                <div key={key} className="text-center">
                  <div className="text-2xl font-bold text-green-600">{count}</div>
                  <div className="text-sm text-green-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Display */}
        {migrationStatus === 'error' && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Migration Error
            </h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Reset Button */}
        {(migrationStatus === 'success' || migrationStatus === 'error') && (
          <div className="text-center">
            <button
              onClick={handleResetMigration}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <Database className="w-4 h-4 mr-2" />
              New Migration
            </button>
          </div>
        )}

        {/* Data Structure Info */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            What will be migrated?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <strong>User Data:</strong>
              <ul className="list-disc list-inside ml-4">
                <li>Admin credentials</li>
                <li>User permissions</li>
                <li>Authentication data</li>
              </ul>
            </div>
            <div>
              <strong>Content Data:</strong>
              <ul className="list-disc list-inside ml-4">
                <li>People (Advisors, Team Members, Collaborators)</li>
                <li>Publications</li>
                <li>Projects</li>
                <li>Achievements</li>
              </ul>
            </div>
            <div>
              <strong>News & Events:</strong>
              <ul className="list-disc list-inside ml-4">
                <li>News articles</li>
                <li>Events</li>
                <li>Announcements</li>
              </ul>
            </div>
            <div>
              <strong>Site Configuration:</strong>
              <ul className="list-disc list-inside ml-4">
                <li>Research areas</li>
                <li>Gallery images</li>
                <li>Contact information</li>
                <li>Footer data</li>
                <li>Home page content</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataMigration;