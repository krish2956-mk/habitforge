# 🎨 Analytics Dashboard - Custom Icon Usage Examples

## 📁 **Default Icon Paths**

The analytics dashboard expects icons in these default locations:

```
public/icon/
├── file.png          # Overview tab
├── performance.png   # Performance tab  
├── heatmap.png      # Heatmaps tab
├── time.png         # Time Analysis tab
└── success.png      # Success Insights tab
```

## 🔧 **How to Provide Custom Icon Paths**

### **Example 1: Using Default Paths**
Simply place your icons in `public/icon/` with the correct filenames:

```jsx
// No customIcons prop needed - uses default paths
<AnalyticsDashboard habits={habits} />
```

### **Example 2: Custom Icon Paths via Props**
Pass custom paths when using the component:

```jsx
// In your page.js or component
const customIcons = {
  overview: "/my-icons/analytics-overview.png",
  performance: "/my-icons/chart-performance.png", 
  heatmaps: "/my-icons/heatmap-fire.png",
  time: "/my-icons/clock-time.png",
  success: "/my-icons/trophy-success.png"
};

<AnalyticsDashboard habits={habits} customIcons={customIcons} />
```

### **Example 3: Mix Default and Custom Icons**
Override only specific icons:

```jsx
const customIcons = {
  overview: "/custom/overview-icon.png",  // Custom path
  // Other icons will use default paths from public/icon/
};

<AnalyticsDashboard habits={habits} customIcons={customIcons} />
```

### **Example 4: Using Different Icon Formats**
You can use different image formats:

```jsx
const customIcons = {
  overview: "/icons/overview.svg",        // SVG
  performance: "/icons/performance.webp", // WebP
  heatmaps: "/icons/heatmap.png",        // PNG
  time: "/icons/time.jpg",               // JPG
  success: "/icons/success.png"          // PNG
};

<AnalyticsDashboard habits={habits} customIcons={customIcons} />
```

### **Example 5: Using External Icon URLs**
You can even use external icon URLs:

```jsx
const customIcons = {
  overview: "https://example.com/icons/overview.png",
  performance: "https://example.com/icons/performance.png",
  heatmaps: "https://example.com/icons/heatmap.png",
  time: "https://example.com/icons/time.png",
  success: "https://example.com/icons/success.png"
};

<AnalyticsDashboard habits={habits} customIcons={customIcons} />
```

## 🎯 **Icon Path Resolution**

The system resolves icon paths in this order:

1. **Custom Icons Prop** - If you provide `customIcons` prop
2. **Default Paths** - Falls back to `public/icon/filename.png`
3. **Emoji Fallback** - If image fails to load, shows emoji

## 📝 **Complete Implementation Example**

```jsx
// app/page.js
import AnalyticsDashboard from './components/AnalyticsDashboard';

export default function Home() {
  const habits = []; // Your habits data

  // Option 1: Use default paths (place icons in public/icon/)
  return <AnalyticsDashboard habits={habits} />;

  // Option 2: Use custom paths
  const customIcons = {
    overview: "/assets/icons/overview.png",
    performance: "/assets/icons/performance.png",
    heatmaps: "/assets/icons/heatmap.png", 
    time: "/assets/icons/time.png",
    success: "/assets/icons/success.png"
  };
  
  return <AnalyticsDashboard habits={habits} customIcons={customIcons} />;
}
```

## 🎨 **Icon Design Guidelines**

### **Technical Specs:**
- **Size**: 16x16 pixels (auto-scaled)
- **Format**: PNG, SVG, WebP, or JPG
- **Background**: Transparent preferred
- **Colors**: Light colors for dark theme

### **Recommended Colors:**
- **Primary**: White (#FFFFFF) or Cream (#FAEAB1)
- **Secondary**: Light Gray (#D1D5DB) 
- **Accent**: Indigo (#6366F1) or Emerald (#10B981)

### **Design Tips:**
- Keep icons simple and recognizable
- Use consistent style across all icons
- Ensure good contrast against dark background
- Consider using outline-style icons

## 🔄 **Fallback System**

If any icon fails to load, the system shows emoji fallbacks:

| Tab | Emoji Fallback |
|-----|----------------|
| Overview | 📊 |
| Performance | 📈 |
| Heatmaps | 🔥 |
| Time Analysis | ⏰ |
| Success Insights | 🏆 |

## 🚀 **Quick Start**

1. **Choose your method** (default paths or custom paths)
2. **Create your icons** (16x16 with transparency)
3. **Place icons** in the appropriate location
4. **Pass customIcons prop** if using custom paths
5. **Icons will automatically load** in the analytics dashboard

The system is designed to be flexible and work with any icon setup you prefer!
