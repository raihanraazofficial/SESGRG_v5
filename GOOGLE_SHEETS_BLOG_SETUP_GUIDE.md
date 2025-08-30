# Google Sheets Setup Guide for SESG Website
## News & Events এবং Blog Content Management

এই guide আপনাকে দেখাবে কিভাবে Google Sheets থেকে আপনার SESG website এ News & Events এবং blog content manage করবেন।

## 📋 Table of Contents
1. [Google Apps Script Setup](#google-apps-script-setup)
2. [News & Events Data Structure](#news--events-data-structure)
3. [Achievements Data Structure](#achievements-data-structure)
4. [Blog Content with LaTeX এবং Markdown](#blog-content-with-latex-এবং-markdown)
5. [Sample Data Examples](#sample-data-examples)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Google Apps Script Setup

### Step 1: Create Google Sheets
1. নতুন Google Sheets তৈরি করুন
2. Sheet এর নাম দিন `sheet9` (News & Events এর জন্য)
3. প্রয়োজনে আরো sheets যোগ করুন (`sheet8` for Achievements)

### Step 2: Apps Script তৈরি করুন
1. আপনার Google Sheets এ যান
2. **Extensions** > **Apps Script** এ ক্লিক করুন
3. নিচের কোডটি paste করুন:

```javascript
function doGet(e) {
  const sheetName = e.parameter.sheet || 'sheet9';
  
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({error: `Sheet '${sheetName}' not found`}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    if (values.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({news_events: []}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const headers = values[0];
    const rows = values.slice(1);
    
    const data = rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header.toLowerCase().trim()] = row[index] || '';
      });
      return obj;
    });
    
    // News & Events এর জন্য
    if (sheetName === 'sheet9') {
      return ContentService
        .createTextOutput(JSON.stringify({news_events: data}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Achievements এর জন্য
    if (sheetName === 'sheet8') {
      return ContentService
        .createTextOutput(JSON.stringify({achievements: data}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Default response
    return ContentService
      .createTextOutput(JSON.stringify({data: data}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Step 3: Deploy করুন
1. **Deploy** > **New deployment** ক্লিক করুন
2. **Type** হিসেবে **Web app** সিলেক্ট করুন
3. **Execute as**: Me (your email)
4. **Who has access**: Anyone
5. **Deploy** করুন
6. URL copy করুন (এটি আপনার API endpoint হবে)

---

## 📊 News & Events Data Structure

### Required Columns (sheet9 এ):
```
| id | title | short_description | category | date | image | featured | full_content |
```

### Column Details:
- **id**: Unique identifier (e.g., news_001, event_001)
- **title**: News/Event title
- **short_description**: Brief description (1-2 sentences)
- **category**: News, Events, বা Upcoming Events
- **date**: YYYY-MM-DD format (e.g., 2025-01-15)
- **image**: Image URL (Unsplash links work well)
- **featured**: TRUE/FALSE - Featured content সবার উপরে বড় card হিসেবে দেখাবে
- **full_content**: Full blog content with markdown/LaTeX support

### ⭐ Featured Story তৈরি করার নিয়ম:
1. **featured** column এ **TRUE** লিখুন
2. সবার আগে featured content রাখুন (প্রথম row এ)
3. একসাথে সর্বোচ্চ 1-2টি featured item রাখুন
4. Featured content এর জন্য high-quality image ব্যবহার করুন

---

## 🏆 Achievements Data Structure

### Required Columns (sheet8 এ):
```
| id | title | short_description | category | date | image | featured | full_content |
```

### Column Details:
- **id**: Unique identifier (e.g., ach_001, award_001)
- **title**: Achievement title
- **short_description**: Brief description (1-2 sentences)
- **category**: Award, Partnership, Publication, Grant
- **date**: YYYY-MM-DD format (e.g., 2025-01-15)
- **image**: Image URL (Unsplash links work well)
- **featured**: TRUE/FALSE - Featured achievement সবার উপরে বড় card হিসেবে দেখাবে
- **full_content**: Full blog content with markdown/LaTeX support

### Category Options:
- Award
- Partnership  
- Publication
- Grant

### ⭐ Featured Achievement তৈরি করার নিয়ম:
1. **featured** column এ **TRUE** লিখুন
2. সবার আগে featured content রাখুন (প্রথম row এ)
3. একসাথে সর্বোচ্চ 1-2টি featured item রাখুন
4. Featured content এর জন্য high-quality image ব্যবহার করুন

---

## 📝 Blog Content with LaTeX এবং Markdown

আপনার `full_content` column এ এই features ব্যবহার করতে পারেন:

### ✅ Supported Markdown Features:
```markdown
# Headers (H1)
## Sub Headers (H2)
### Sub Sub Headers (H3)

**Bold text**
*Italic text*

- Bullet points
- Lists

1. Numbered lists
2. Sequential items

> Quotes and blockquotes

`Inline code`

```code
Code blocks
```

[Links](https://example.com)

![Images](https://example.com/image.jpg)
```

### ✅ Supported LaTeX Math:
```latex
Inline math: $E = mc^2$

Display math:
$$\sum_{i=1}^{n} x_i = \bar{x} \cdot n$$

Greek letters: α, β, γ, Σ, Δ, θ, λ

Equations:
$$P = \frac{1}{2} \rho A v^3 C_p(\lambda, \beta)$$

Fractions: $\frac{a}{b}$

Powers: $x^2$, $e^{-x}$

Subscripts: $H_2O$, $x_i$
```

### ✅ Advanced Formatting:
```markdown
### Tables:
| Parameter | Value | Unit |
|-----------|-------|------|
| Power     | 500   | kW   |
| Voltage   | 230   | V    |

### Info Boxes:
[INFO] This is an information box.
[WARNING] This is a warning box.
[SUCCESS] This is a success message.

### YouTube Videos:
<iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID" 
        title="Video Title" frameborder="0" allowfullscreen></iframe>
```

---

## 📋 Sample Data Examples

### 🌟 Featured News & Events Example (sheet9):

#### Row 1 - Featured Story:
```
id: news_001
title: SESG Lab Wins $2M International Smart Grid Award
short_description: Our breakthrough AI-powered grid optimization research has been recognized globally
category: News
date: 2025-01-20
image: https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200
featured: TRUE
full_content: # International Recognition for SESG Research

## $2 Million Smart Grid Innovation Award

The **Sustainable Energy and Smart Grid Research Lab** at BRAC University has been awarded the prestigious **International Smart Grid Innovation Award 2025**, along with $2 million in research funding.

### Mathematical Model Behind Our Success:
Our award-winning optimization algorithm uses:

$$\min_{x} f(x) = \sum_{i=1}^{n} c_i x_i + \alpha \sum_{j=1}^{m} P_{loss,j}$$

Subject to:
- Power balance: $\sum P_{gen} = \sum P_{load} + P_{losses}$
- Voltage limits: $V_{min} \leq V_i \leq V_{max}$
- Line capacity: $|S_{ij}| \leq S_{ij}^{max}$

### Key Features:
- **Real-time optimization** with 99.7% efficiency
- **AI-powered forecasting** using LSTM networks
- **Renewable integration** supporting 85% clean energy

### Impact:
This research will revolutionize smart grid operations globally, potentially saving **$500 billion** annually in energy costs.

[INFO] The award ceremony will be held in Geneva, Switzerland on March 15, 2025.

**Team:** Dr. Ahmed Rahman (Lead), Prof. Sarah Mitchell, Dr. James Chen, Ms. Fatima Al-Zahra
```

#### Row 2 - Regular News:
```
id: news_002
title: New Solar Panel Installation Completed
short_description: 500kW rooftop solar system now operational on BRAC University campus
category: News
date: 2025-01-18
image: https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800
featured: FALSE
full_content: # Campus Solar Installation Success

## 500kW Solar System Now Live

Our campus microgrid expansion is complete with the installation of a new **500kW rooftop solar array**.

### Technical Specifications:
- **Power Output:** 500kW peak capacity
- **Annual Generation:** ~750 MWh
- **CO₂ Reduction:** 380 tons/year
- **ROI Period:** 7.2 years

The system includes smart inverters and battery storage for optimal performance.
```

### 🏆 Featured Achievement Example (sheet8):

#### Row 1 - Featured Achievement:
```
id: ach_001
title: Tesla Partnership Breakthrough: $5M Joint Research Initiative
short_description: Revolutionary battery management system development with Tesla Energy division
category: Partnership
date: 2025-01-15
image: https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=1200
featured: TRUE
full_content: # Historic Partnership with Tesla Energy

## $5 Million Joint Research Initiative Launched

The **SESG Research Lab** proudly announces a groundbreaking **$5 million partnership** with Tesla Energy to develop next-generation battery management systems.

### Research Objectives:
1. **Advanced BMS Development**
   - AI-powered state estimation
   - Predictive maintenance algorithms
   - Enhanced safety protocols

2. **Mathematical Modeling**
   Battery state of charge estimation:
   $$SOC(t) = SOC_0 - \frac{1}{Q_{nom}} \int_0^t I(\tau) d\tau$$
   
   Kalman filter implementation:
   $$\hat{x}_{k|k} = \hat{x}_{k|k-1} + K_k(z_k - H\hat{x}_{k|k-1})$$

3. **Grid Integration**
   - Vehicle-to-Grid (V2G) protocols  
   - Smart charging algorithms
   - Peak shaving optimization

### Expected Outcomes:
| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| Battery Life | 8 years | 12 years | +50% |
| Efficiency | 92% | 96% | +4% |
| Cost | $150/kWh | $100/kWh | -33% |

### Timeline:
- **Phase 1 (6 months):** Algorithm development
- **Phase 2 (12 months):** Prototype testing  
- **Phase 3 (18 months):** Commercial deployment

[SUCCESS] This partnership positions SESG as a leader in energy storage research.

**Project Lead:** Dr. Lisa Chang
**Tesla Collaborators:** Dr. Michael Rodriguez, Eng. Sarah Kim
```

#### Row 2 - Regular Achievement:
```
id: ach_002
title: Best Paper Award at IEEE Conference 2024
short_description: Our machine learning research wins prestigious recognition
category: Award
date: 2025-01-10
image: https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800
featured: FALSE
full_content: # IEEE Conference Success

## Best Paper Award Recognition

Our research paper on **"Machine Learning for Smart Grid Optimization"** received the Best Paper Award at IEEE SmartGridComm 2024.

### Key Contributions:
- Novel deep learning architecture
- 15% efficiency improvement
- Real-world validation

The paper presents innovative algorithms for grid optimization using reinforcement learning.
```

### 📊 Google Sheets Layout Examples:

#### News & Events Sheet (sheet9):
```
| A      | B                              | C                           | D              | E          | F                                    | G        | H              |
|--------|--------------------------------|-----------------------------|----------------|------------|--------------------------------------|----------|----------------|
| id     | title                          | short_description           | category       | date       | image                                | featured | full_content   |
| news_001| SESG Lab Wins $2M Award       | Global recognition for AI   | News           | 2025-01-20 | https://images.unsplash.com/...      | TRUE     | # Award Win... |
| news_002| Solar Installation Complete   | 500kW system operational    | News           | 2025-01-18 | https://images.unsplash.com/...      | FALSE    | # Solar...     |
| event_001| Smart Grid Conference 2025   | Annual international event  | Upcoming Events| 2025-03-15 | https://images.unsplash.com/...      | FALSE    | # Conference.. |
```

#### Achievements Sheet (sheet8):
```
| A      | B                              | C                           | D            | E          | F                                    | G        | H              |
|--------|--------------------------------|-----------------------------|--------------|------------|--------------------------------------|----------|----------------|
| id     | title                          | short_description           | category     | date       | image                                | featured | full_content   |
| ach_001| Tesla Partnership $5M         | Battery research initiative | Partnership  | 2025-01-15 | https://images.unsplash.com/...      | TRUE     | # Partnership..|
| ach_002| IEEE Best Paper Award         | ML research recognition     | Award        | 2025-01-10 | https://images.unsplash.com/...      | FALSE    | # Award...     |
| ach_003| NSF Grant $800K              | Funding for grid research   | Grant        | 2024-12-20 | https://images.unsplash.com/...      | FALSE    | # Grant...     |
```

---

## 🛠️ Troubleshooting

### Common Issues:

#### 1. "No data found" error
**Solution:** 
- Check sheet name exactly matches (sheet9 for News & Events)
- Ensure first row contains column headers
- Verify data exists in rows below headers

#### 2. LaTeX not rendering
**Solution:**
- Use proper LaTeX syntax: `$inline$` or `$$display$$`
- Avoid complex nested formulas
- Test with simple formulas first

#### 3. Images not loading
**Solution:**
- Use direct image URLs (Unsplash recommended)
- Avoid Google Drive links (they require authentication)
- Test image URLs in browser first

#### 4. Date formatting issues
**Solution:**
- Use YYYY-MM-DD format only
- Example: 2025-01-15 (not 15/01/2025)

#### 5. Apps Script permission errors
**Solution:**
- Make sure deployment is set to "Anyone" access
- Re-deploy if URL stops working
- Check Apps Script logs for errors

---

## 🔗 API Endpoints

### Current URLs:
- **News & Events**: https://script.google.com/macros/s/AKfycbwLVCtEI2Mr2J76jf72kfK6OhaMNNdfvLTcJTV8J6mtWcNNGVnHtt0Gxu__lavtnrc8/exec?sheet=sheet9
- **Achievements**: https://script.google.com/macros/s/AKfycbxScZMmNtYyVJ5Je8iRpAFTGVpCCuA-5tnS3jGVGk6aYbRjbiL7NAAquXsxcQU2T_I/exec?sheet=sheet8

### Testing Your API:
1. আপনার Apps Script URL browser এ open করুন
2. `?sheet=sheet9` parameter যোগ করুন
3. JSON response check করুন
4. `news_events` key আছে কিনা verify করুন

---

## 📚 Best Practices

### Content Writing:
1. **Short descriptions**: 1-2 sentences maximum
2. **Blog content**: Use headers, lists, and formatting
3. **Images**: High quality, relevant images
4. **Categories**: Consistent naming (News, Events, Upcoming Events)

### Data Management:
1. **Regular backups**: Export sheets regularly
2. **Version control**: Keep track of major changes
3. **Testing**: Always test content before publishing
4. **Consistent formatting**: Follow the same pattern for all entries

### Performance:
1. **Image optimization**: Use optimized images
2. **Content length**: Balance detail with loading speed
3. **Regular cleanup**: Remove outdated entries

---

## 📞 Support

যদি কোনো সমস্যা হয়:
1. প্রথমে এই guide এর troubleshooting section দেখুন
2. Apps Script logs check করুন
3. Browser console এ errors আছে কিনা দেখুন
4. API response manually test করুন

---

**Last Updated:** January 2025
**Version:** 2.0