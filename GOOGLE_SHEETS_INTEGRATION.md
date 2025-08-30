# Google Sheets Integration Guide

## Overview
This guide explains how to integrate Google Sheets with your Lab Research website to dynamically manage Publications, Projects, News & Events, and Achievements data.

## 1. Google Sheets Setup

### Create Sheets for Each Data Type:

#### Sheet 1: Publications
**Columns (A-L):**
- A: ID (1, 2, 3...)
- B: Title
- C: Authors (comma separated: "Chen, S., Thompson, A.")
- D: Journal
- E: Year (2024)
- F: Volume
- G: Issue
- H: Pages
- I: DOI
- J: Category (Machine Learning, Renewable Energy, etc.)
- K: Citation Count (number)

**Example Row:**
```
1 | Advanced ML for Smart Grids | Chen, S., Thompson, A. | IEEE Trans Smart Grid | 2024 | 15 | 3 | 1234-1247 | 10.1109/TSG.2024.123 | Machine Learning | 15
```

#### Sheet 2: Projects
**Columns (A-I):**
- A: ID
- B: Title
- C: Description
- D: Status (Active, Completed, Planning)
- E: Start Date (YYYY-MM-DD)
- F: End Date (YYYY-MM-DD)
- G: Funding ($2.5M)
- H: Sponsor
- I: Team Members (comma separated)
- J: Category

#### Sheet 3: News & Events
**Columns (A-F):**
- A: ID
- B: Title
- C: Description
- D: Date (YYYY-MM-DD)
- E: Type (News, Event, Achievement)
- F: Image URL (optional)

#### Sheet 4: Achievements
**Columns (A-F):**
- A: ID
- B: Title
- C: Description
- D: Date (YYYY-MM-DD)
- E: Category (Award, Funding, Patent)
- F: Recipients (comma separated)

## 2. Google Apps Script Setup

### Create Apps Script:
1. Go to script.google.com
2. Create new project
3. Replace code with the provided script
4. Deploy as web app
5. Copy the web app URL

### Apps Script Code:
```javascript
function doGet(e) {
  const sheetName = e.parameter.sheet;
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);
  
  if (!sheet) {
    return ContentService
      .createTextOutput(JSON.stringify({error: 'Sheet not found'}))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  
  const result = rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header.toLowerCase().replace(/ /g, '_')] = row[index];
    });
    return obj;
  });
  
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. Integration in Your Application

### Where to Place Google Sheets API Links:

#### Option A: Environment Variables (Recommended)
Add to `/app/frontend/.env`:
```
REACT_APP_PUBLICATIONS_API=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?sheet=Publications
REACT_APP_PROJECTS_API=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?sheet=Projects
REACT_APP_NEWS_API=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?sheet=NewsEvents
REACT_APP_ACHIEVEMENTS_API=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?sheet=Achievements
```

#### Option B: Configuration File
Create `/app/frontend/src/config/apis.js`:
```javascript
export const API_ENDPOINTS = {
  publications: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?sheet=Publications',
  projects: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?sheet=Projects',
  news: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?sheet=NewsEvents',
  achievements: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?sheet=Achievements'
};
```

## 4. Frontend Integration

### Update Data Fetching:
Replace mock data imports in components with API calls:

```javascript
// Instead of: import { publications } from '../mock/data';
// Use:
import { useState, useEffect } from 'react';

const [publications, setPublications] = useState([]);

useEffect(() => {
  fetch(process.env.REACT_APP_PUBLICATIONS_API)
    .then(response => response.json())
    .then(data => setPublications(data))
    .catch(error => console.error('Error:', error));
}, []);
```

## 5. Sample Data Templates

### Publications Sample:
```
ID | Title | Authors | Journal | Year | Volume | Issue | Pages | DOI | Category | Citations
1 | Advanced ML for Smart Grid Forecasting | Chen, S., Rodriguez, M. | IEEE Trans Smart Grid | 2024 | 15 | 3 | 1234-1247 | 10.1109/TSG.2024.123 | Machine Learning | 25
```

### Projects Sample:
```
ID | Title | Description | Status | Start Date | End Date | Funding | Sponsor | Team Members | Category
1 | AI Grid Optimization | ML-based grid optimization | Active | 2023-09-01 | 2025-08-31 | $2.5M | DOE | Dr. Chen, Alex Thompson | Machine Learning
```

### News Sample:
```
ID | Title | Description | Date | Type | Image URL
1 | Conference Success | Presented at IEEE Conference | 2024-11-15 | Event | https://example.com/image.jpg
```

### Achievements Sample:
```
ID | Title | Description | Date | Category | Recipients
1 | Best Paper Award | IEEE Smart Grid Conference | 2024-10-15 | Award | Dr. Chen, Alex Thompson
```

## 6. Testing Your Integration

1. **Create Google Sheets** with sample data
2. **Deploy Apps Script** and get web app URL
3. **Test API endpoint** in browser
4. **Update frontend** to use real API
5. **Verify data display** on website

## 7. Security Considerations

- **Public Access**: Apps Script APIs are publicly accessible
- **Rate Limiting**: Google has quotas for script executions
- **Data Validation**: Always validate data from external sources
- **Backup**: Keep local backup of important data

## 8. Maintenance

- **Regular Updates**: Update Google Sheets as needed
- **Version Control**: Track changes in spreadsheet
- **Error Handling**: Implement fallback to mock data if API fails
- **Performance**: Consider caching for better performance