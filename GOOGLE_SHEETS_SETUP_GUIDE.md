# Google Sheets Setup Guide for Publications Page

## সমস্যা সমাধান সফল! ✅
আপনার Publications page এখন আপনার Google Sheets থেকে data সফলভাবে fetch করছে।

## Google Sheets Column Structure

আপনার Google Sheets এ নিম্নলিখিত columns ব্যবহার করুন:

### Required Columns (এই columns গুলো অবশ্যই থাকতে হবে):

1. **id** - Unique identifier (1, 2, 3...)
2. **title** - Publication title 
3. **authors** - Authors list (as array: ["John Doe", "Jane Smith"])
4. **year** - Publication year (2023)
5. **category** - Publication type ("Journal Articles", "Conference Proceedings", "Book Chapters")
6. **citations** - Citation count (number)
7. **research_areas** - Research areas (as array: ["Smart Grid Technologies", "Renewable Energy Integration"])
8. **open_access** - Boolean (true/false)
9. **full_paper_link** - Paper URL (if available)

### Optional Columns (IEEE Format Support):

10. **journal_name** - For journal articles
11. **volume** - Journal volume
12. **issue** - Journal issue
13. **pages** - Page numbers (e.g., "123-135")
14. **conference_name** - For conference papers
15. **city** - Conference/publication city
16. **country** - Conference/publication country
17. **book_title** - For book chapters
18. **edition** - Book edition
19. **editor** - Book editor
20. **publisher** - Publisher name

## Complete Sample Data Structure

```json
{
  "id": 1,
  "title": "Renewable Energy Forecasting using AI",
  "authors": ["John Doe", "Jane Smith"],
  "year": 2023,
  "category": "Journal Articles",
  "citations": 12,
  "research_areas": ["Smart Grid Technologies", "Renewable Energy Integration"],
  "open_access": true,
  "full_paper_link": "https://example.com/paper1.pdf",
  "journal_name": "IEEE Transactions on Smart Grid",
  "volume": "14",
  "issue": "3",
  "pages": "123-135",
  "conference_name": "",
  "city": "",
  "country": "",
  "book_title": "",
  "edition": "",
  "editor": "",
  "publisher": ""
}
```

## Google Apps Script Code

আপনার Google Apps Script এ এই code ব্যবহার করুন:

```javascript
function doGet(e) {
  try {
    // Get the sheet parameter from URL
    const sheetName = e.parameter.sheet || 'Sheet1';
    
    // Get the active spreadsheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({
          error: 'Sheet not found',
          available_sheets: spreadsheet.getSheets().map(s => s.getName())
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get all data from the sheet
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    if (values.length === 0) {
      return ContentService
        .createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // First row contains headers
    const headers = values[0];
    const dataRows = values.slice(1);
    
    // Convert to JSON format
    const jsonData = dataRows.map((row, index) => {
      const obj = {};
      headers.forEach((header, colIndex) => {
        const key = header.toString().toLowerCase().replace(/\s+/g, '_');
        let value = row[colIndex];
        
        // Handle special cases
        if (key === 'authors' || key === 'research_areas') {
          // Convert comma-separated string to array
          if (typeof value === 'string' && value.trim()) {
            value = value.split(',').map(item => item.trim()).filter(item => item);
          } else if (!Array.isArray(value)) {
            value = [];
          }
        } else if (key === 'open_access') {
          // Convert to boolean
          value = Boolean(value);
        } else if (key === 'citations' || key === 'year' || key === 'id') {
          // Convert to number
          value = Number(value) || 0;
        } else if (key === 'full_paper_link' || key === 'doi_link') {
          // Handle links
          value = value && value.toString().startsWith('http') ? value.toString() : '';
        } else {
          // Convert to string
          value = value ? value.toString() : '';
        }
        
        obj[key] = value;
      });
      
      // Ensure required fields exist
      if (!obj.id) obj.id = index + 1;
      if (!obj.category) obj.category = 'Journal Articles';
      if (!obj.authors) obj.authors = [];
      if (!obj.research_areas) obj.research_areas = [];
      
      return obj;
    });
    
    // Filter out empty rows (rows without title)
    const filteredData = jsonData.filter(item => item.title && item.title.trim());
    
    return ContentService
      .createTextOutput(JSON.stringify(filteredData))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        error: error.toString(),
        message: 'Error processing Google Sheets data'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Function to test the script
function testScript() {
  const result = doGet({parameter: {sheet: 'sheet6'}});
  console.log(result.getContent());
}
```

## Setup Steps

### 1. Google Sheets Setup
1. আপনার Google Sheets খুলুন
2. Sheet name কে 'sheet6' করুন (অথবা আপনার পছন্দমতো)
3. প্রথম row এ column headers রাখুন:
   ```
   id | title | authors | year | category | citations | research_areas | open_access | full_paper_link | journal_name | volume | issue | pages | conference_name | city | country | book_title | edition | editor | publisher
   ```

### 2. Apps Script Setup
1. Google Sheets থেকে **Extensions > Apps Script** যান
2. উপরের code copy করে paste করুন
3. **Deploy > New Deployment** করুন
4. Type হিসেবে **Web app** select করুন
5. Execute as: **Me**
6. Who has access: **Anyone** (অথবা **Anyone with Google account**)
7. Deploy করুন এবং URL copy করুন

### 3. Test Your Setup
1. Browser এ আপনার Apps Script URL এ যান: `YOUR_URL?sheet=sheet6`
2. JSON data দেখতে পাবেন
3. আপনার Publications page এ data দেখতে পাবেন

## Sample Data Template

আপনার Google Sheets এ এই format এ data রাখুন:

| id | title | authors | year | category | citations | research_areas | open_access | full_paper_link | journal_name | volume | issue | pages |
|----|--------|---------|------|----------|-----------|----------------|-------------|-----------------|--------------|--------|-------|-------|
| 1 | Renewable Energy Forecasting using AI | John Doe,Jane Smith | 2023 | Journal Articles | 12 | Smart Grid Technologies,Renewable Energy Integration | TRUE | https://example.com/paper1.pdf | IEEE Transactions on Smart Grid | 14 | 3 | 123-135 |
| 2 | Microgrid Control Optimization | Alice Brown,Bob White | 2022 | Journal Articles | 8 | Microgrids & Distributed Energy Systems | FALSE |  | IEEE Transactions on Smart Grid | 13 | 2 | 56-67 |

## Troubleshooting

### যদি data দেখা না যায়:
1. Apps Script URL টি correct কিনা check করুন
2. Sheet name সঠিক কিনা দেখুন
3. Google Sheets public access আছে কিনা check করুন
4. Browser console এ error আছে কিনা দেখুন

### Performance Tips:
- 100+ publications এর জন্য caching enable আছে
- Data automatically refresh হয় 5 minutes এ
- Large datasets এর জন্য pagination কাজ করে

## Current Status ✅
- ✅ Google Sheets integration working
- ✅ Data fetching successfully  
- ✅ IEEE format citations generating
- ✅ All filtering and search working
- ✅ Publications page fully functional

Your Publications page is now live and working with your Google Sheets data!