# How to Modify People Page Information

## Overview
The People page displays information about Advisors, Team Members, and Collaborators. All data is currently stored in a mock data file that you can easily edit.

## 1. Location of People Data

**File to Edit:** `/app/frontend/src/mock/data.js`

This file contains all the mock data for your website, including people information.

## 2. Modifying Advisors (Faculty)

### Current Structure:
```javascript
export const advisors = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    title: "Principal Investigator & Lab Director",
    department: "Electrical Engineering",
    email: "s.chen@university.edu",
    phone: "+1 (555) 123-4567",
    image: "https://images.unsplash.com/photo-....", // Professional headshot
    bio: "Dr. Chen leads research in renewable energy integration...",
    expertise: ["Smart Grid Systems", "Renewable Energy Integration"],
    education: ["PhD in Electrical Engineering, MIT", "MS in Power Systems, Stanford"]
  }
  // ... more advisors
];
```

### To Add/Edit Advisors:

1. **Open** `/app/frontend/src/mock/data.js`
2. **Find** the `advisors` array (starts around line 3)
3. **Edit existing entries** or **add new ones**:

```javascript
// Add a new advisor
{
  id: 4, // Use next available ID
  name: "Dr. Your Name",
  title: "Research Professor", 
  department: "Your Department",
  email: "your.email@university.edu",
  phone: "+1 (555) 999-0000",
  image: "URL_to_your_photo", // Use professional photo
  bio: "Brief description of your research and background",
  expertise: ["Your Expertise 1", "Your Expertise 2", "Your Expertise 3"],
  education: ["Your PhD", "Your Masters", "Your Bachelor's"]
}
```

## 3. Modifying Team Members (Research Assistants)

### Current Structure:
```javascript
export const teamMembers = [
  {
    id: 1,
    name: "Alex Thompson",
    title: "PhD Research Assistant",
    department: "Electrical Engineering", 
    email: "a.thompson@university.edu",
    image: "https://images.unsplash.com/photo-....",
    researchArea: "Grid Stability Analysis",
    year: "4th Year PhD"
  }
  // ... more team members
];
```

### To Add/Edit Team Members:

```javascript
// Add a new team member
{
  id: 9, // Use next available ID
  name: "Your Student Name",
  title: "PhD Research Assistant", // or "MS Research Assistant"
  department: "Your Department",
  email: "student.email@university.edu", 
  image: "URL_to_student_photo",
  researchArea: "Their Research Focus",
  year: "2nd Year PhD" // or "1st Year MS", etc.
}
```

## 4. Modifying Collaborators

### Current Structure:
```javascript
export const collaborators = [
  {
    id: 1,
    name: "Dr. Alan Foster",
    institution: "National Renewable Energy Laboratory (NREL)",
    department: "Grid Integration",
    email: "alan.foster@nrel.gov",
    image: "https://images.unsplash.com/photo-....",
  }
  // ... more collaborators
];
```

### To Add/Edit Collaborators:

```javascript
// Add a new collaborator
{
  id: 4, // Use next available ID
  name: "Dr. Collaborator Name", 
  institution: "Their Institution/Company",
  department: "Their Department/Division",
  email: "their.email@institution.edu",
  image: "URL_to_their_photo"
}
```

## 5. Getting Professional Photos

### Recommended Photo Sources:

1. **University Official Photos**: Use official faculty/student photos if available
2. **Professional Headshots**: Commission professional photos
3. **High-Quality Stock Photos**: Use professional-looking stock images:
   - Unsplash.com (free, high-quality)
   - Pexels.com (free)
   - Getty Images (paid, very professional)

### Photo Requirements:
- **Size**: Minimum 400x400 pixels
- **Format**: JPG or PNG
- **Style**: Professional, clean background
- **Aspect Ratio**: Square (1:1) works best

### Example URLs (Replace with actual photos):
```javascript
// Good photo examples from Unsplash:
image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
```

## 6. Complete Example: Adding New People

```javascript
// Add to advisors array
{
  id: 4,
  name: "Dr. Maria Gonzalez",
  title: "Associate Professor",
  department: "Computer Science",
  email: "m.gonzalez@university.edu", 
  phone: "+1 (555) 456-7890",
  image: "https://your-photo-url.com/maria.jpg",
  bio: "Dr. Gonzalez specializes in machine learning applications for energy systems with focus on predictive analytics.",
  expertise: ["Machine Learning", "Energy Analytics", "Data Science"],
  education: ["PhD in Computer Science, UC Berkeley", "MS in Data Science, Stanford"]
},

// Add to teamMembers array
{
  id: 9,
  name: "Sarah Kim",
  title: "MS Research Assistant",
  department: "Computer Science",
  email: "s.kim@university.edu",
  image: "https://your-photo-url.com/sarah.jpg", 
  researchArea: "Energy Data Analytics",
  year: "1st Year MS"
},

// Add to collaborators array  
{
  id: 4,
  name: "Dr. James Wilson",
  institution: "Tesla Energy Division",
  department: "Battery Research",
  email: "j.wilson@tesla.com",
  image: "https://your-photo-url.com/james.jpg"
}
```

## 7. Testing Your Changes

After making changes:

1. **Save** the file (`/app/frontend/src/mock/data.js`)
2. **Refresh** your browser (the app has hot reload enabled)
3. **Navigate** to the People page to see your changes
4. **Check** that all information displays correctly

## 8. Common Issues & Solutions

### Problem: Photo Not Displaying
- **Check URL**: Ensure the image URL is accessible
- **Use HTTPS**: Make sure image URLs use HTTPS
- **Test URL**: Open image URL directly in browser

### Problem: Layout Issues
- **Long Names**: Keep names reasonably short
- **Long Bios**: Keep bios concise (2-3 sentences)
- **Many Expertise Tags**: Limit to 3-4 expertise areas

### Problem: Email Links Not Working
- **Format**: Ensure email format is correct
- **Special Characters**: Avoid special characters in emails

## 9. Future Enhancement: Database Integration

Currently using mock data, but you can later integrate with:
- **Google Sheets** (for easy editing)
- **MongoDB Database** (for full backend integration) 
- **CMS System** (for non-technical users)

## 10. Backup Your Changes

Before making major changes:
1. **Copy** the original data.js file
2. **Save** it as `data.backup.js`
3. **Make changes** to original
4. **Test thoroughly** before deploying