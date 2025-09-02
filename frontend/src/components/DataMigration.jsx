import React, { useState } from 'react';
import { firebaseService } from '../services/firebaseService';
import { firebaseSetup } from '../services/firebaseSetup';

/**
 * DataMigration Component
 * Provides UI for migrating data from localStorage to Firebase
 */
const DataMigration = () => {
  const [migrationStatus, setMigrationStatus] = useState('idle'); // idle, running, completed, error
  const [migrationResults, setMigrationResults] = useState(null);
  const [error, setError] = useState(null);
  const [firebaseStatus, setFirebaseStatus] = useState('unknown'); // unknown, connected, error
  const [existingData, setExistingData] = useState(null);

  const testFirebaseConnection = async () => {
    try {
      setFirebaseStatus('testing');
      console.log('🔄 Testing Firebase connection...');
      
      await firebaseSetup.testConnection();
      const data = await firebaseSetup.checkExistingData();
      
      setExistingData(data);
      setFirebaseStatus('connected');
      console.log('✅ Firebase connection successful');
      
    } catch (err) {
      console.error('❌ Firebase connection failed:', err);
      setFirebaseStatus('error');
      setError(`Firebase connection failed: ${err.message}`);
    }
  };

  const setupFirebaseWithSampleData = async () => {
    try {
      setMigrationStatus('running');
      setError(null);
      console.log('🚀 Setting up Firebase with sample data...');

      const results = await firebaseSetup.setupFirebase(false);
      const data = await firebaseSetup.checkExistingData();
      
      setExistingData(data);
      setMigrationResults(data);
      setMigrationStatus('completed');
      console.log('✅ Firebase setup completed successfully');
      
    } catch (err) {
      console.error('❌ Firebase setup failed:', err);
      setError(err.message);
      setMigrationStatus('error');
    }
  };

  const startMigration = async () => {
    try {
      setMigrationStatus('running');
      setError(null);
      console.log('🚀 Starting data migration from localStorage to Firebase...');

      const results = await firebaseService.migrateFromLocalStorage();
      
      setMigrationResults(results);
      setMigrationStatus('completed');
      console.log('✅ Migration completed successfully:', results);
      
    } catch (err) {
      console.error('❌ Migration failed:', err);
      setError(err.message);
      setMigrationStatus('error');
    }
  };

  const clearLocalStorage = () => {
    if (window.confirm('আপনি কি নিশ্চিত যে localStorage থেকে সমস্ত data clear করতে চান? এই action undo করা যাবে না।')) {
      const success = firebaseService.clearLocalStorageData();
      if (success) {
        alert('✅ localStorage data successfully cleared!');
        window.location.reload(); // Reload to reflect changes
      } else {
        alert('❌ Error clearing localStorage data');
      }
    }
  };

  const checkLocalStorageData = () => {
    try {
      console.log('🔍 checkLocalStorageData function called');
      alert('🔍 Checking localStorage data... Check browser console for details.');
      
      const keys = [
        'sesg_users',
        'sesgrg_people_data',
        'sesg_publications_data',
        'sesg_projects_data',
        'sesg_achievements_data',
        'sesg_newsevents_data',
        'sesg_research_areas',
        'sesg_gallery_data',
        'sesg_contact_data',
        'sesg_footer_data',
        'sesg_home_data'
      ];

      console.log('📊 Checking localStorage data:');
      let dataFound = false;
      let dataReport = [];
      
      keys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data && data !== 'null' && data !== '[]' && data !== '{}') {
          dataFound = true;
          try {
            const parsed = JSON.parse(data);
            let info = 'Unknown data';
            if (Array.isArray(parsed)) {
              info = `${parsed.length} items`;
            } else if (typeof parsed === 'object' && parsed !== null) {
              const itemCount = Object.keys(parsed).length;
              info = `Object with ${itemCount} properties`;
            } else {
              info = 'Scalar data';
            }
            console.log(`✅ ${key}:`, info, parsed);
            dataReport.push(`✅ ${key}: ${info}`);
          } catch (e) {
            console.log(`✅ ${key}:`, 'String data:', data);
            dataReport.push(`✅ ${key}: String data`);
            dataFound = true;
          }
        } else {
          console.log(`❌ ${key}:`, 'No data');
          dataReport.push(`❌ ${key}: No data`);
        }
      });
      
      // Show summary alert
      if (dataFound) {
        alert(`✅ LocalStorage data found!\n\n${dataReport.join('\n')}\n\nCheck browser console for detailed data.`);
      } else {
        alert('❌ No localStorage data found. All keys are empty.\n\nThis might mean:\n1. Data has already been migrated\n2. Website is using Firebase directly\n3. No data has been created yet\n\nTry "Test Firebase Connection" to check current data status.');
      }
      
    } catch (error) {
      console.error('❌ Error checking localStorage:', error);
      alert(`❌ Error checking localStorage: ${error.message}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          🔄 Firebase Migration & Setup Tool
        </h2>
        <p className="text-gray-600">
          Firebase connection testing, data migration, এবং fresh setup
        </p>
      </div>

      {/* Firebase Connection Status */}
      <div className="mb-8 p-4 rounded-lg border-2 border-dashed border-gray-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">🔥 Firebase Connection Status</h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            firebaseStatus === 'connected' ? 'bg-green-100 text-green-700' :
            firebaseStatus === 'error' ? 'bg-red-100 text-red-700' :
            firebaseStatus === 'testing' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {firebaseStatus === 'connected' && '✅ Connected'}
            {firebaseStatus === 'error' && '❌ Error'}
            {firebaseStatus === 'testing' && '⏳ Testing...'}
            {firebaseStatus === 'unknown' && '❓ Unknown'}
          </div>
        </div>
        
        <button
          onClick={testFirebaseConnection}
          disabled={firebaseStatus === 'testing'}
          className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
            firebaseStatus === 'testing'
              ? 'bg-gray-400 cursor-not-allowed text-gray-200'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {firebaseStatus === 'testing' ? '⏳ Testing Connection...' : '🔍 Test Firebase Connection'}
        </button>
      </div>

      {/* Existing Firebase Data Display */}
      {existingData && (
        <div className="mb-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-xl font-semibold mb-4 text-blue-800">
            📊 Current Firebase Data
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(existingData).map(([collection, count]) => (
              <div key={collection} className="bg-white p-3 rounded-lg shadow-sm border">
                <div className="text-sm text-gray-600 capitalize">
                  {collection.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </div>
                <div className={`text-2xl font-bold ${count > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                  {count}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Total Items in Firebase:</strong> {' '}
              {Object.values(existingData).reduce((sum, count) => sum + count, 0)} items
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <button
          onClick={checkLocalStorageData}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          📊 Check LocalStorage Data
        </button>

        <button
          onClick={setupFirebaseWithSampleData}
          disabled={migrationStatus === 'running'}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            migrationStatus === 'running'
              ? 'bg-gray-400 cursor-not-allowed text-gray-200'
              : 'bg-purple-500 hover:bg-purple-600 text-white'
          }`}
        >
          {migrationStatus === 'running' ? '⏳ Setting up...' : '🚀 Fresh Firebase Setup'}
        </button>

        <button
          onClick={startMigration}
          disabled={migrationStatus === 'running'}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            migrationStatus === 'running'
              ? 'bg-gray-400 cursor-not-allowed text-gray-200'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {migrationStatus === 'running' ? '⏳ Migrating...' : '🔄 Migrate LocalStorage'}
        </button>

        <button
          onClick={clearLocalStorage}
          disabled={migrationStatus === 'running'}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          🗑️ Clear LocalStorage
        </button>
      </div>

      {/* Migration Status */}
      {migrationStatus !== 'idle' && (
        <div className="mb-6">
          <div className={`p-4 rounded-lg ${
            migrationStatus === 'running' ? 'bg-blue-50 border border-blue-200' :
            migrationStatus === 'completed' ? 'bg-green-50 border border-green-200' :
            'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-3 ${
                migrationStatus === 'running' ? 'bg-blue-500 animate-pulse' :
                migrationStatus === 'completed' ? 'bg-green-500' :
                'bg-red-500'
              }`}></div>
              <span className="font-medium">
                {migrationStatus === 'running' && '⏳ Migration in progress...'}
                {migrationStatus === 'completed' && '✅ Migration completed successfully!'}
                {migrationStatus === 'error' && '❌ Migration failed'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Migration Results */}
      {migrationResults && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            📊 Migration Results
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(migrationResults).map(([key, count]) => (
              <div key={key} className="bg-white p-3 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {count}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-green-100 rounded-lg">
            <p className="text-green-800 text-sm">
              <strong>Total Items Migrated:</strong> {' '}
              {Object.values(migrationResults).reduce((sum, count) => sum + count, 0)} items
            </p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            ❌ Migration Error
          </h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          📝 Instructions
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">🔄 Migration Process:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>First, test Firebase connection</li>
              <li>Check if localStorage has any data</li>
              <li>Use "Migrate LocalStorage" if data exists</li>
              <li>Clear localStorage after successful migration</li>
            </ol>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">🚀 Fresh Setup:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>Use "Fresh Firebase Setup" for new installation</li>
              <li>This will populate Firebase with sample data</li>
              <li>All contexts will connect to Firebase automatically</li>
              <li>Admin panel will work with Firebase data</li>
            </ol>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>⚠️ Note:</strong> "Fresh Firebase Setup" will create sample data if Firebase is empty. 
            "Clear LocalStorage" action cannot be undone. Make sure Firebase connection is working before migration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataMigration;