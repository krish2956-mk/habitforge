# 🎨 Custom Icons for Analytics Dashboard

## 📁 **Icon Directory Structure**

Your custom icons should be placed in: `public/icon/`

```
public/
└── icon/
    ├── file.png          # Overview tab
    ├── performance.png   # Performance tab
    ├── heatmap.png      # Heatmaps tab
    ├── time.png         # Time Analysis tab
    └── success.png      # Success Insights tab
```

## 🎯 **How to Use Custom Icons**

### **Method 1: Place Icons in Default Location**
Simply place your icons in `public/icon/` with the exact filenames:
- `file.png` - Overview
- `performance.png` - Performance  
- `heatmap.png` - Heatmaps
- `time.png` - Time Analysis
- `success.png` - Success Insights

### **Method 2: Use Custom Paths via Props**
Pass custom icon paths when using the AnalyticsDashboard component:

```jsx
// In your page.js or component
const customIcons = {
  overview: "/path/to/your/overview-icon.png",
  performance: "/path/to/your/performance-icon.png",
  heatmaps: "/path/to/your/heatmap-icon.png",
  time: "/path/to/your/time-icon.png",
  success: "/path/to/your/success-icon.png"
};

<AnalyticsDashboard habits={habits} customIcons={customIcons} />
```

### **Method 3: Mix Default and Custom Icons**
You can override only specific icons:

```jsx
const customIcons = {
  overview: "/custom/path/overview.png",  // Custom path
  // Other icons will use default paths
};

<AnalyticsDashboard habits={habits} customIcons={customIcons} />
```

## 🎨 **Icon Specifications**

### **Technical Requirements:**
- **Format**: PNG with transparency
- **Size**: 16x16 pixels (will be auto-scaled)
- **Background**: Transparent
- **Colors**: Light colors for dark theme visibility

### **Recommended Colors:**
- **Primary**: White (#FFFFFF) or Cream (#FAEAB1)
- **Secondary**: Light Gray (#D1D5DB)
- **Accent**: Indigo (#6366F1) or Emerald (#10B981)

### **Design Tips:**
- Keep icons simple and recognizable
- Use consistent style across all icons
- Ensure good contrast against dark background
- Consider using outline-style icons for better visibility

## 🔄 **Fallback System**

If any custom icon fails to load, the system automatically falls back to emoji icons:

| Tab | Fallback Emoji |
|-----|----------------|
| Overview | 📊 |
| Performance | 📈 |
| Heatmaps | 🔥 |
| Time Analysis | ⏰ |
| Success Insights | 🏆 |

## 📝 **Example Implementation**

```jsx
// Example with custom icon paths
const myCustomIcons = {
  overview: "/assets/icons/analytics-overview.png",
  performance: "/assets/icons/chart-performance.png",
  heatmaps: "/assets/icons/heatmap-fire.png",
  time: "/assets/icons/clock-time.png",
  success: "/assets/icons/trophy-success.png"
};

// Use in your component
<AnalyticsDashboard 
  habits={habits} 
  customIcons={myCustomIcons} 
/>
```

## 🚀 **Quick Start**

1. **Create your icons** (16x16 PNG with transparency)
2. **Place them in** `public/icon/` with the correct filenames
3. **Or provide custom paths** via the `customIcons` prop
4. **Icons will automatically load** in the analytics dashboard tabs

The system is designed to be flexible - use whatever method works best for your setup!
