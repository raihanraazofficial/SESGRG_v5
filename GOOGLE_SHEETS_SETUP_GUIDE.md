# Google Sheets Setup Guide for SESG Research Website

এই গাইড আপনাকে দেখাবে কিভাবে Google Sheets ব্যবহার করে আপনার ওয়েবসাইটের ডেটা manage করবেন।

## 📋 Table of Contents
1. [Google Sheets Structure](#google-sheets-structure)
2. [Publications Setup](#publications-setup)
3. [Projects Setup](#projects-setup)
4. [Achievements Setup](#achievements-setup)
5. [News & Events Setup](#news-events-setup)
6. [App Script Configuration](#app-script-configuration)
7. [API URL Management](#api-url-management)
8. [Real-time Updates](#real-time-updates)
9. [Troubleshooting](#troubleshooting)

---

## 📊 Google Sheets Structure

আপনার ওয়েবসাইট **৪টি আলাদা Google Sheets** ব্যবহার করে:

### Current API URLs:
- **Publications:** `https://script.google.com/macros/s/AKfycbzQ6XwRBYMc5PaDDns3XlgpRGYQFZtC45RtVRUhyvVlt869zH9mL0IlGlnvBV2-e_s/exec?sheet=sheet6`
- **Projects:** `https://script.google.com/macros/s/AKfycbz5-vZBCz8DZQhLDmLjJNA70HQ3OazQ2uTAUuK7UQaTVip7pG8ulVPLuzA8VN8rqTGH/exec?sheet=sheet7`
- **Achievements:** `https://script.google.com/macros/s/AKfycbxScZMmNtYyVJ5Je8iRpAFTGVpCCuA-5tnS3jGVGk6aYbRjbiL7NAAquXsxcQU2T_I/exec?sheet=sheet8`
- **News & Events:** `https://script.google.com/macros/s/AKfycbykWJ0VZWqL22CmmhG7qeSrkLxczJB2gid4HiH6ixZZJrvM7Ha-ZuDS8ygbHz205aN7/exec?sheet=sheet9`

---

## 📚 Publications Setup

### Google Sheets Columns (IEEE Format):
প্রথম row এ এই headers রাখুন:

| Column | Header | Description | Example |
|--------|--------|-------------|---------|
| A | `category` | Publication type | Journal Articles, Conference Proceedings, Book Chapters, Books |
| B | `authors` | Author names (comma separated) | John Doe, Jane Smith, Ahmed Rahman |
| C | `title` | Paper title | Smart Grid Optimization using AI |
| D | `journal_book_conference_name` | Publication venue | IEEE Transactions on Smart Grid |
| E | `volume` | Volume number | 15 |
| F | `issue` | Issue/Number | 3 |
| G | `editors` | Editors (for books) | Dr. Smith, Prof. Johnson |
| H | `publisher` | Publisher name | IEEE Press |
| I | `location` | Conference location | New York, USA |
| J | `pages` | Page numbers | 123-135 |
| K | `year` | Publication year | 2024 |
| L | `citations` | Citation count | 45 |
| M | `doi_link` | DOI or paper link | https://doi.org/10.1109/example |
| N | `research_areas` | Research areas (comma separated) | Smart Grid, AI, Machine Learning |

### Sample Data:
```
Row 1: category | authors | title | journal_book_conference_name | volume | issue | editors | publisher | location | pages | year | citations | doi_link | research_areas

Row 2: Journal Articles | John Doe, Jane Smith | Smart Grid Optimization using AI | IEEE Transactions on Smart Grid | 15 | 3 | | | | 123-135 | 2024 | 45 | https://doi.org/10.1109/example | Smart Grid, Artificial Intelligence

Row 3: Conference Proceedings | Ahmed Rahman, Sarah Ahmed | Renewable Energy Integration | IEEE Power & Energy Conference | | | | | Bangkok, Thailand | 78-85 | 2024 | 12 | https://example.com/paper2 | Renewable Energy, Smart Grid
```

---

## 🚀 Projects Setup

### Google Sheets Columns:
| Column | Header | Description | Example |
|--------|--------|-------------|---------|
| A | `id` | Unique project ID | proj_001 |
| B | `title` | Project title | Solar Integration Planning |
| C | `description` | Project description | A comprehensive study on solar... |
| D | `status` | Project status | Active, Completed, Planning |
| E | `start_date` | Start date (YYYY-MM-DD) | 2024-01-15 |
| F | `end_date` | End date (YYYY-MM-DD) | 2025-01-15 |
| G | `research_areas` | Research areas (comma separated) | Smart Grid, Solar Energy |
| H | `principal_investigator` | PI name | Dr. Ahmed Rahman |
| I | `team_members` | Team members (comma separated) | John Doe, Jane Smith |
| J | `funding_agency` | Funding source | National Science Foundation |
| K | `budget` | Project budget | $500,000 |
| L | `image` | Project image URL | https://images.unsplash.com/... |

### Sample Data:
```
Row 1: id | title | description | status | start_date | end_date | research_areas | principal_investigator | team_members | funding_agency | budget | image

Row 2: proj_001 | Solar Integration Planning | A comprehensive study on integrating solar panels with smart grid infrastructure | Active | 2024-01-15 | 2025-01-15 | Smart Grid, Solar Energy | Dr. Ahmed Rahman | John Doe, Jane Smith | NSF | $500,000 | https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800
```

---

## 🏆 Achievements Setup

### Google Sheets Columns:
| Column | Header | Description | Example |
|--------|--------|-------------|---------|
| A | `id` | Unique achievement ID | ach_001 |
| B | `title` | Achievement title | Solar Innovation Award 2024 |
| C | `short_description` | Brief description | Awarded for groundbreaking research... |
| D | `full_content` | Full blog content (Markdown supported) | # Achievement Details... |
| E | `category` | Achievement category | Award, Partnership, Publication, Grant |
| F | `date` | Achievement date (YYYY-MM-DD) | 2024-11-15 |
| G | `image` | Achievement image URL | https://images.unsplash.com/... |

### Sample Data:
```
Row 1: id | title | short_description | full_content | category | date | image

Row 2: ach_001 | Solar Innovation Award 2024 | Awarded for groundbreaking research in solar grid integration | # Solar Innovation Award 2024\n\nWe are proud to announce that our research team has received the prestigious Solar Innovation Award...\n\n## Research Impact\n- Improved efficiency by 25%\n- Reduced costs by 30% | Award | 2024-11-15 | https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800
```

### Markdown Support in full_content:
আপনি `full_content` কলামে Markdown ব্যবহার করতে পারেন:

```markdown
# Main Title
## Subtitle
### Sub-subtitle

**Bold text**
*Italic text*

- Bullet point 1
- Bullet point 2

1. Numbered list 1
2. Numbered list 2

> Quote text

`Code text`

```code
Code block
```

[Link text](https://example.com)

[INFO] This is an info box
[WARNING] This is a warning box

| Table | Header |
|-------|--------|
| Cell 1| Cell 2 |

$$
Mathematical formulas with Greek letters: α, β, γ
$$
```

---

## 📰 News & Events Setup

### Google Sheets Columns:
| Column | Header | Description | Example |
|--------|--------|-------------|---------|
| A | `id` | Unique news/event ID | news_001 |
| B | `title` | News/Event title | Smart Grid Symposium 2024 |
| C | `short_description` | Brief description | Join us for two days of cutting-edge research... |
| D | `full_content` | Full blog content (Markdown supported) | # Smart Grid Symposium 2024... |
| E | `category` | News/Event category | News, Event, Upcoming Event, Achievement |
| F | `date` | News/Event date (YYYY-MM-DD) | 2024-12-15 |
| G | `image` | News/Event image URL | https://images.unsplash.com/... |

### Sample Data:
```
Row 1: id | title | short_description | full_content | category | date | image

Row 2: news_001 | Smart Grid Symposium 2024 | Join us for two days of cutting-edge research presentations | # Smart Grid Symposium 2024\n\nWe are excited to announce our annual symposium...\n\n## Event Details\n- **Date:** December 15-16, 2024\n- **Location:** BRAC University | Event | 2024-12-15 | https://images.unsplash.com/photo-1511578314322-379afb476865?w=800
```

---

## 🔧 App Script Configuration

### Step 1: Create Google Apps Script

1. আপনার Google Sheet এ যান
2. **Extensions** > **Apps Script** ক্লিক করুন
3. নিচের কোড copy করে paste করুন:

```javascript
/**
 * SESG Research Website - Google Sheets API
 * এই script আপনার Google Sheets ডেতা web API হিসেবে serve করে
 */

function doGet(e) {
  try {
    // Get sheet parameter from URL (e.g., ?sheet=sheet6)
    const sheetName = e.parameter.sheet || 'Sheet1';
    
    // Open the spreadsheet and get the specified sheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({
          error: `Sheet '${sheetName}' not found`
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get all data from the sheet
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    if (values.length === 0) {
      return ContentService
        .createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // First row contains headers
    const headers = values[0];
    const data = [];
    
    // Convert each row to an object
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const rowData = {};
      
      for (let j = 0; j < headers.length; j++) {
        const header = headers[j];
        let value = row[j];
        
        // Handle different data types
        if (header === 'authors' || header === 'team_members' || header === 'research_areas') {
          // Convert comma-separated strings to arrays
          value = value ? value.toString().split(',').map(item => item.trim()) : [];
        } else if (header === 'citations' || header === 'budget') {
          // Convert to numbers
          value = value ? Number(value) : 0;
        } else if (header === 'date' || header === 'start_date' || header === 'end_date') {
          // Convert dates to YYYY-MM-DD format
          if (value instanceof Date) {
            value = Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
          } else if (value) {
            value = value.toString();
          }
        } else {
          // Convert everything else to string
          value = value ? value.toString() : '';
        }
        
        rowData[header] = value;
      }
      
      // Add auto-generated ID if not present
      if (!rowData.id) {
        rowData.id = `${sheetName}_${i.toString().padStart(3, '0')}`;
      }
      
      data.push(rowData);
    }
    
    // Add timestamp for caching
    const response = {
      data: data,
      timestamp: new Date().toISOString(),
      sheet: sheetName,
      total_records: data.length
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        error: error.toString(),
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Test function - আপনি এটা run করে test করতে পারেন
 */
function testScript() {
  const mockEvent = {
    parameter: {
      sheet: 'Sheet1'
    }
  };
  
  const result = doGet(mockEvent);
  console.log(result.getContent());
}
```

### Step 2: Deploy as Web App

1. **Deploy** > **New deployment** ক্লিক করুন
2. **Type:** Web app select করুন
3. **Description:** "SESG Research API" লিখুন
4. **Execute as:** Me (your email) select করুন
5. **Who has access:** Anyone select করুন
6. **Deploy** ক্লিক করুন
7. **Copy the Web app URL** - এটা আপনার API URL

### Sample Deployed URL:
```
https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?sheet=sheet6
```

---

## 🔗 API URL Management

### Backend Configuration File Location:
```
/app/backend/sheets_service.py
```

### Current API URLs in Code:
```python
# Line numbers approximately 15-20
self.publications_api_url = "https://script.google.com/macros/s/AKfycbzQ6XwRBYMc5PaDDns3XlgpRGYQFZtC45RtVRUhyvVlt869zH9mL0IlGlnvBV2-e_s/exec?sheet=sheet6"
self.projects_api_url = "https://script.google.com/macros/s/AKfycbz5-vZBCz8DZQhLDmLjJNA70HQ3OazQ2uTAUuK7UQaTVip7pG8ulVPLuzA8VN8rqTGH/exec?sheet=sheet7"  
self.achievements_api_url = "https://script.google.com/macros/s/AKfycbxScZMmNtYyVJ5Je8iRpAFTGVpCCuA-5tnS3jGVGk6aYbRjbiL7NAAquXsxcQU2T_I/exec?sheet=sheet8"
self.news_events_api_url = "https://script.google.com/macros/s/AKfycbykWJ0VZWqL22CmmhG7qeSrkLxczJB2gid4HiH6ixZZJrvM7Ha-ZuDS8ygbHz205aN7/exec?sheet=sheet9"
```

### How to Change API URLs:

#### Method 1: Edit the Code Directly
1. `/app/backend/sheets_service.py` ফাইল open করুন
2. Line 15-20 এর কাছে API URLs খুঁজুন
3. নতুন URLs দিয়ে replace করুন
4. Backend restart করুন: `sudo supervisorctl restart backend`

#### Method 2: Environment Variables (Recommended)
আমি একটা environment variable system তৈরি করেছি:

1. Backend `.env` ফাইলে API URLs add করুন:
```env
PUBLICATIONS_API_URL=https://your-new-publications-url
PROJECTS_API_URL=https://your-new-projects-url
ACHIEVEMENTS_API_URL=https://your-new-achievements-url
NEWS_EVENTS_API_URL=https://your-new-news-events-url
```

2. Backend automatically environment variables use করবে

---

## 🔄 Real-time Updates

### Current Cache Duration: 30 seconds
- আপনার Google Sheets এ কোন পরিবর্তন করার পর **30 সেকেন্ড** পর website এ দেখা যাবে
- **Force Refresh** button দিয়ে তাৎক্ষণিক update পেতে পারেন

### Force Refresh করার উপায়:
1. Website এর Achievements বা News & Events পেজে যান
2. **Refresh** button (🔄 icon) ক্লিক করুন
3. Data immediately update হবে

### Manual Cache Clear:
Backend API এ cache clear endpoint আছে:
```
POST /api/clear-cache
```

---

## 🧪 Testing Your Setup

### Step 1: Test Your API URL
আপনার browser এ API URL paste করুন:
```
https://your-script-url/exec?sheet=your-sheet-name
```

Expected Response:
```json
{
  "data": [
    {
      "id": "ach_001",
      "title": "Your Achievement Title",
      ...
    }
  ],
  "timestamp": "2024-11-25T10:30:00.000Z",
  "sheet": "your-sheet-name",
  "total_records": 1
}
```

### Step 2: Test on Website
1. Website এর সংশ্লিষ্ট পেজে যান
2. Force Refresh button ক্লিক করুন
3. নতুন data দেখা যাচ্ছে কিনা check করুন

---

## 🐛 Troubleshooting

### Common Issues:

#### 1. "No data found" বা Empty Page
**সমাধান:**
- Google Sheets এর first row এ proper headers আছে কিনা check করুন
- Apps Script properly deployed হয়েছে কিনা check করুন
- API URL সঠিক কিনা verify করুন
- Sheet name parameter সঠিক কিনা check করুন (?sheet=sheet6)

#### 2. Data Format Issues
**সমাধান:**
- Date format: YYYY-MM-DD ব্যবহার করুন
- Numbers: শুধু সংখ্যা লিখুন ($ বা comma ছাড়া)
- Lists: Comma দিয়ে separate করুন (spaces এর সাথে)

#### 3. Images Not Showing
**সমাধান:**
- Image URLs publicly accessible হতে হবে
- Unsplash URLs recommended: `https://images.unsplash.com/photo-id?w=800`
- Google Drive links work না, public URLs ব্যবহার করুন

#### 4. API Permission Errors
**সমাধান:**
- Apps Script deployment এ "Anyone" access দিন
- Script authorization properly complete করুন

#### 5. Cache Not Updating
**সমাধান:**
- Force Refresh button ব্যবহার করুন
- 30 সেকেন্ড wait করুন automatic update এর জন্য
- Backend restart করুন: `sudo supervisorctl restart backend`

### Debug Steps:
1. Browser এ API URL directly test করুন
2. Console logs check করুন (F12 > Console)
3. Backend logs check করুন: `tail -f /var/log/supervisor/backend.*.log`
4. Cache status check করুন: `GET /api/cache-status`

### API Response Format Check:
আপনার API response এই format এ আছে কিনা check করুন:
```json
{
  "data": [
    {
      "id": "unique_id",
      "title": "Title here",
      "category": "Category here",
      "date": "2024-11-25",
      // ... other fields
    }
  ],
  "timestamp": "2024-11-25T10:30:00.000Z",
  "sheet": "sheet_name",
  "total_records": 1
}
```

---

## 📞 Support

যদি কোন সমস্যা হয়:
1. এই guide অনুসরণ করেছেন কিনা double-check করুন
2. API URL browser এ test করুন
3. Google Sheets data format check করুন
4. Website এর Force Refresh button ব্যবহার করুন
5. Backend logs check করুন

---

## 🚀 Quick Start Checklist

- [ ] Google Sheets তৈরি করেছেন proper headers সহ
- [ ] Sample data add করেছেন correct format এ
- [ ] Apps Script code deploy করেছেন
- [ ] API URL copy করেছেন এবং browser এ test করেছেন
- [ ] Backend এ API URL update করেছেনি (যদি প্রয়োজন হয়)
- [ ] Website এ Force Refresh করে test করেছেন
- [ ] Cache duration 30 seconds confirm করেছেন

এই guide অনুসরণ করলে আপনার Google Sheets এর data real-time (30 seconds cache) আপনার website এ দেখাবে! 🎉

---

## 💡 Pro Tips

1. **Regular Backups:** Google Sheets automatically saves, কিন্তু important data এর backup রাখুন
2. **Image Optimization:** Unsplash images `?w=800` parameter দিয়ে optimize করুন
3. **Date Consistency:** সব dates YYYY-MM-DD format এ রাখুন
4. **Testing:** নতুন data add করার পর Force Refresh করে test করুন
5. **Performance:** বড় datasets এর জন্য pagination ব্যবহার করুন