# Analytics Dashboard Icons

Place your custom icons in this directory with the following filenames:

## Required Icons:
- `file.png` - Overview tab icon
- `performance.png` - Performance tab icon  
- `heatmap.png` - Heatmaps tab icon
- `time.png` - Time Analysis tab icon
- `success.png` - Success Insights tab icon

## Icon Specifications:
- **Size**: 16x16 pixels (will be scaled to 16x16 in the UI)
- **Format**: PNG with transparency
- **Style**: Should match the dark theme aesthetic
- **Colors**: Use light colors (white, cream, or light gray) for visibility on dark background

## Fallback System:
If any icon fails to load, the system will automatically fall back to emoji icons:
- Overview: 📊
- Performance: 📈
- Heatmaps: 🔥
- Time Analysis: ⏰
- Success Insights: 🏆

## Usage:
The icons will be automatically loaded from `/icon/filename.png` and displayed in the analytics dashboard tabs.
