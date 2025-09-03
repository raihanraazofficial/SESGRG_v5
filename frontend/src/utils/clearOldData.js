/**
 * Utility to clear old localStorage data that might cause loading issues
 * This prevents old cached data from showing before Firebase data loads
 */

export const clearOldLocalStorageData = () => {
  console.log('🧹 Starting localStorage cleanup...');
  
  const keysToRemove = [
    'sesg_home_data',
    'sesg_users',
    'sesg_auth_user', 
    'sesg_auth_expiry',
    'sesgrg_people_data',
    'sesg_publications_data',
    'sesg_projects_data',
    'sesg_achievements_data',
    'sesg_newsevents_data',
    'sesg_research_areas',
    'sesg_gallery_data',
    'sesg_contact_data',
    'sesg_footer_data'
  ];
  
  let removedCount = 0;
  keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      removedCount++;
      console.log(`✅ Removed localStorage key: ${key}`);
    }
  });
  
  console.log(`🧹 localStorage cleanup completed. Removed ${removedCount} keys.`);
  return removedCount;
};

export const clearSpecificHomeData = () => {
  console.log('🏠 Clearing home-specific localStorage data...');
  localStorage.removeItem('sesg_home_data');
  console.log('✅ Home data localStorage cleared');
};

export default {
  clearOldLocalStorageData,
  clearSpecificHomeData
};