# SESG Research Blog Features Guide

এই গাইডে SESG Research ওয়েবসাইটের News & Events এবং Achievements পেজের advanced blogging features কিভাবে ব্যবহার করতে হয় তা বর্ণনা করা হয়েছে।

## 📋 Table of Contents

1. [LaTeX Math Support](#latex-math-support)
2. [Code Blocks](#code-blocks)
3. [Text Formatting](#text-formatting)
4. [Lists](#lists)
5. [Images and Media](#images-and-media)
6. [Tables](#tables)
7. [Special Boxes](#special-boxes)
8. [Headers](#headers)
9. [Links](#links)
10. [Quotes](#quotes)

---

## 🧮 LaTeX Math Support

### Inline Math
Use single dollar signs for inline mathematical expressions:

**Input:**
```
The equation $E = mc^2$ represents energy-mass equivalence.
```

**Output:** 
The equation *E = mc²* represents energy-mass equivalence.

### Display Math (Block)
Use double dollar signs for display math on separate lines:

**Input:**
```
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

**Output:** 
A beautifully rendered mathematical equation in a styled box.

### Complex LaTeX Examples

**Summation:**
```
$$
\sum_{i=1}^{n} x_i = x_1 + x_2 + \cdots + x_n
$$
```

**Matrix:**
```
$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
$$
```

**Fractions and Powers:**
```
$$
f(x) = \frac{1}{\sqrt{2\pi\sigma^2}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}
$$
```

---

## 💻 Code Blocks

### Syntax Highlighting
Specify language for proper syntax highlighting:

**Input:**
```
```python
def calculate_efficiency(power_input, power_output):
    """Calculate solar panel efficiency"""
    efficiency = (power_output / power_input) * 100
    return efficiency

# Example usage
efficiency = calculate_efficiency(1000, 220)
print(f"Solar panel efficiency: {efficiency}%")
```
```

**Output:** 
A styled code block with Python syntax highlighting and copy button.

### Supported Languages
- `python`, `javascript`, `java`, `cpp`, `c`, `html`, `css`, `sql`, `bash`, `json`, `xml`

---

## 📝 Text Formatting

### Basic Formatting
- **Bold text**: `**This is bold**` → **This is bold**
- *Italic text*: `*This is italic*` → *This is italic*
- `Inline code`: \`code\` → `code`

### Colored Text
Use bracket notation for colored text:

**Input:**
```
[red:This is red text]
[green:This is green text]  
[blue:This is blue text]
```

**Output:**
Colored text in the specified color.

---

## 📋 Lists

### Bullet Points
**Input:**
```
- Smart Grid Technology
- Renewable Energy Integration
- Energy Storage Systems
- Power System Automation
```

**Output:**
Styled bullet points with emerald-colored dots.

### Numbered Lists
**Input:**
```
1. Conduct feasibility study
2. Design system architecture
3. Implement prototype
4. Test and validate results
```

**Output:**
Numbered list with circular number badges.

---

## 🖼️ Images and Media

### Images with Captions
**Input:**
```
[IMG:https://example.com/solar-panel.jpg:Advanced solar panel installation at BRAC University]
```

**Output:**
Responsive image with caption below.

### YouTube Videos
**Input:**
```
https://youtube.com/watch?v=VIDEO_ID
```

**Output:**
Embedded YouTube video player.

### Regular Videos
**Input:**
```
https://example.com/video.mp4
```

**Output:**
HTML5 video player with controls.

---

## 📊 Tables

**Input:**
```
| Parameter | Value | Unit |
|-----------|-------|------|
| Voltage | 220 | V |
| Current | 10 | A |
| Power | 2200 | W |
```

**Output:**
Styled table with emerald header and hover effects.

---

## 📦 Special Boxes

### Information Box
**Input:**
```
[INFO] This is important information about the research project.
```

**Output:**
Green information box with icon.

### Warning Box
**Input:**
```
[WARNING] High voltage equipment - handle with extreme caution.
```

**Output:**
Yellow warning box with warning icon.

---

## 📖 Headers

### Main Headers
**Input:**
```
## Research Methodology
```

**Output:**
Large header with emerald accent and numbering.

### Sub Headers
**Input:**
```
### Data Collection
```

**Output:**
Medium header with gradient line accent.

### Sub-sub Headers
**Input:**
```
#### Statistical Analysis
```

**Output:**
Small header with dot accent.

---

## 🔗 Links

**Input:**
```
[Visit BRAC University](https://www.bracu.ac.bd)
```

**Output:**
Styled link with external indicator and hover effects.

---

## 💬 Quotes

**Input:**
```
> "Sustainable energy is not just an option, it's a necessity for our future generations."
```

**Output:**
Beautifully styled blockquote with quotation mark icon.

---

## 🚀 Usage Tips

### 1. Combining Features
You can combine multiple features in a single post:

```
## Smart Grid Research Results

Our latest research on **smart grid optimization** shows promising results.

### Mathematical Model
The efficiency can be calculated using:
$$
\eta = \frac{P_{out}}{P_{in}} \times 100\%
$$

### Implementation
```python
def grid_efficiency(power_out, power_in):
    return (power_out / power_in) * 100
```

### Key Findings
- Efficiency improved by **25%**
- [green:Energy savings of 30%]
- Reduced carbon footprint

[INFO] All tests were conducted under controlled laboratory conditions.
```

### 2. LaTeX Best Practices
- Use `\cdot` for multiplication: `a \cdot b`
- Use `\times` for cross products: `\vec{a} \times \vec{b}`
- Use `\frac{}{}` for fractions: `\frac{numerator}{denominator}`
- Use `{}` for grouping: `x^{2y+1}`

### 3. Code Block Tips
- Always specify language for better syntax highlighting
- Keep code examples relevant and educational
- Add comments for complex code

### 4. Image Guidelines
- Use high-quality images (minimum 800px width)
- Always include descriptive captions
- Ensure images are publicly accessible

---

## 🔧 Technical Implementation

### LaTeX Rendering
- Uses **KaTeX** library for fast LaTeX rendering
- Supports most LaTeX mathematical expressions
- Error handling for invalid LaTeX syntax
- Responsive design for mobile devices

### Code Highlighting
- Syntax highlighting for multiple programming languages
- Copy-to-clipboard functionality
- Dark theme for better readability

### Responsive Design
- All elements are mobile-responsive
- Optimized for various screen sizes
- Touch-friendly interface

---

## 📞 Support

যদি আপনার কোন প্রশ্ন থাকে বা সাহায্যের প্রয়োজন হয়, তাহলে যোগাযোগ করুন:

**Email:** sesg@bracu.ac.bd  
**Website:** [SESG Research Lab](https://sesg.bracu.ac.bd)

---

*Last Updated: জানুয়ারি 2025*