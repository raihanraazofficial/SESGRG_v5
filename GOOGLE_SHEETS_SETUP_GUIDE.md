# Google Sheets Setup Guide for News & Events

This guide explains how to set up Google Sheets integration for News & Events data with LaTeX support.

## Current Status
✅ Backend API updated with new Google Sheets URL  
✅ LaTeX/MathJax support added to both News & Events and Achievements pages  
✅ Data conversion working with user's script format  

## 1. Google Apps Script Setup

### Current Working Script
Your Google Apps Script should return data in this format:

```javascript
function doGet(e) {
  const sheetName = e.parameter.sheet || 'sheet9';
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: 'Sheet not found' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  
  const achievements = data.map(row => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });
  
  // IMPORTANT: Use "news_events" key instead of "achievements"
  return ContentService
    .createTextOutput(JSON.stringify({ news_events: achievements }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### Key Change Required
**Change this line:**
```javascript
.createTextOutput(JSON.stringify({ achievements }))
```

**To this:**
```javascript
.createTextOutput(JSON.stringify({ news_events: achievements }))
```

## 2. Google Sheets Data Structure

Your Google Sheets should have these columns in sheet9:

| Column | Header | Data Type | Example |
|--------|--------|-----------|---------|
| A | id | String | "news_001" |
| B | title | String | "Breakthrough in Wind Energy" |
| C | short_description | String | "New turbine design increases efficiency" |
| D | full_content | Text (Long) | "# Breakthrough in Wind Energy\n## New Turbine Design..." |
| E | category | String | "News", "Events", or "Upcoming Events" |
| F | date | Date/String | "2025-07-14T18:00:00.000Z" |
| G | image | URL | "https://images.unsplash.com/photo-1509395176047-4a66953fd231" |

### Sample Data Format:
```
id          | title                    | short_description        | full_content           | category | date                    | image
news_001    | Breakthrough in Wind     | New turbine design       | # Breakthrough in...   | News     | 2025-07-14T18:00:00.000Z| https://images.unsplash.com/...
event_001   | Global Climate Summit    | Annual UN summit         | # Global Climate...    | Events   | 2025-09-21T18:00:00.000Z| https://images.unsplash.com/...
event_002   | Renewable Energy Expo    | World's largest expo     | # Renewable Energy...  | Upcoming Events | 2025-06-09T18:00:00.000Z| https://images.unsplash.com/...
```

## 3. LaTeX/Math Support in Content

You can now use LaTeX and mathematical expressions in your `full_content` field:

### Inline Math
Use single dollar signs: `$E = mc^2$`

### Display Math Blocks
Use double dollar signs:
```
$$
P = \frac{1}{2} \rho A v^3 C_p(\lambda, \beta)
$$
```

### Mathematical Features Supported:

1. **Greek Letters**: α, β, γ, δ, ε, θ, λ, μ, π, σ, τ, ω
2. **Subscripts**: `x_1`, `H_{2}O`
3. **Superscripts**: `x^2`, `10^{-3}`
4. **Mathematical Operators**: ≤, ≥, ∑, ∫, √, ∞
5. **Fractions**: `\frac{numerator}{denominator}`
6. **Complex Expressions**: `\int_0^T E(t) \, dt`

### Example LaTeX Content:
```markdown
# Mathematical Modeling

The power output equation is:

$$
P = \frac{1}{2} \rho A v^3 C_p(\lambda, \beta)
$$

Where:
- ρ = air density
- A = swept area  
- v = wind speed
- C_p = performance coefficient

The efficiency improvement is calculated as:
$\eta = \frac{P_{new} - P_{old}}{P_{old}} \times 100\%$
```

## 4. Advanced Content Features

Your `full_content` can include:

### Headers
```markdown
# Main Header
## Sub Header  
### Sub Sub Header
```

### Lists
```markdown
- Bullet point 1
- Bullet point 2

1. Numbered item 1
2. Numbered item 2
```

### Code Blocks
```markdown
```javascript
const power = 0.5 * density * area * Math.pow(velocity, 3);
```
```

### Tables
```markdown
| Parameter | Value | Unit |
|-----------|-------|------|
| Density   | 1.225 | kg/m³|
| Velocity  | 12    | m/s  |
```

### Images
```markdown
[IMG:https://example.com/image.jpg:Caption text]
```

### YouTube Videos
```markdown
https://www.youtube.com/watch?v=VIDEO_ID
```

### Info Boxes
```markdown
[INFO] This is an information box.
[WARNING] This is a warning box.
```

### Quotes
```markdown
> "Nature inspires the most efficient engineering."
```

## 5. API Endpoints

### News & Events List
```
GET /api/news-events
```

Parameters:
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 15)
- `category_filter`: Filter by category ("News", "Events", "Upcoming Events")
- `title_filter`: Search in titles
- `sort_by`: Sort field ("date", "title")
- `sort_order`: Sort direction ("asc", "desc")

### News & Events Detail
```
GET /api/news-events/{id}
```

Returns detailed content for blog-style pages with LaTeX rendering.

## 6. Testing Your Setup

1. **Update your Google Apps Script** with the correct return format
2. **Deploy the script** and get the new URL
3. **Test the API** at: `/api/news-events`
4. **Verify LaTeX rendering** by adding mathematical content
5. **Test categories** by filtering: `/api/news-events?category_filter=News`

## 7. Current Configuration

- **Google Sheets URL**: `https://script.google.com/macros/s/AKfycbykWJ0VZWqL22CmmhG7qeSrkLxczJB2gid4HiH6ixZZJrvM7Ha-ZuDS8ygbHz205aN7/exec?sheet=sheet9`
- **Sheet Name**: sheet9
- **Data Format**: Object format with required fields
- **LaTeX Support**: Full MathJax integration
- **Categories**: News, Events, Upcoming Events

## 8. Troubleshooting

### Common Issues:

1. **No data showing**: Check if Google Apps Script returns `news_events` key
2. **LaTeX not rendering**: Ensure MathJax scripts are loaded  
3. **Images not loading**: Verify image URLs are accessible
4. **Category filter not working**: Check category values match exactly

### Debug Steps:

1. Test Google Apps Script URL directly in browser
2. Check browser console for errors
3. Verify API response format
4. Clear cache using `/api/clear-cache`

## 9. Next Steps

After updating your Google Apps Script:

1. Test the News & Events page
2. Add mathematical content to test LaTeX
3. Verify category filtering works
4. Test the "Read More" functionality
5. Check both mobile and desktop views

---

**Status**: ✅ Ready for production use with LaTeX support
**Last Updated**: Current session
**Contact**: Technical support available for implementation help