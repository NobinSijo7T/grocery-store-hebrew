# Logo and App Name Update Guide

## What Was Changed

### App Name
- ✅ Changed from "grocery-store-hebrew" to **"Kirshner Farm"**
- ✅ Updated slug to "kirshner-farm"
- ✅ Updated scheme to "kirshnerfarm"
- ✅ Updated Android package to "com.kirshnerfarm.app"
- ✅ Updated iOS bundle ID to "com.kirshnerfarm.app"
- ✅ Splash screen background color changed to brand green (#2D8A4E)
- ✅ Android adaptive icon background changed to brand green

### APK Name
When you build the Android app, the APK will now be named based on the package name:
- Old: `com.meshakkirshner.grocery-*.apk`
- New: `com.kirshnerfarm.app-*.apk`

## Logo Files to Replace

To update the app icon/logo, replace these files in `assets/images/`:

### Required Files:

1. **`icon.png`** (1024x1024 px)
   - Main app icon
   - Used for iOS and as fallback
   - Should be square with transparent or colored background

2. **`android-icon-foreground.png`** (432x432 px)
   - Android adaptive icon foreground
   - Should be the logo/icon centered
   - Can have transparency

3. **`android-icon-background.png`** (432x432 px)
   - Android adaptive icon background
   - Solid color or pattern
   - Currently set to green (#2D8A4E) in app.json

4. **`splash-icon.png`** (Recommended 200x200 px)
   - Shown during app startup
   - Appears on green background (#2D8A4E)

5. **`logo.svg`**
   - Used in the app UI (login/register screens)
   - Vector format preferred
   - Should match your brand

6. **`favicon.png`** (48x48 px or larger)
   - For web version
   - Square icon

### Optional Enhancement Files:

7. **`logo-glow.png`**
   - Used in certain UI elements
   - Can add a glow effect to your logo

## Logo Design Recommendations

### Style:
- Clean and simple
- Works well at small sizes
- Recognizable
- Matches "Fresh Farm" theme

### Colors:
- Primary: Fresh Green (#2D8A4E)
- Secondary: Consider natural/organic colors
- Should contrast well with white and dark backgrounds

### Suggestions for Kirshner Farm:
- 🌱 Leaf or plant icon
- 🚜 Farm/tractor silhouette
- 📦 Fresh produce basket
- 🏪 Farm stand/market building
- Simple "KF" monogram with farm elements

## How to Update Logo

### Method 1: Using Figma/Photoshop
1. Create designs at the exact sizes listed above
2. Export as PNG (with transparency if needed)
3. Replace the files in `assets/images/`
4. Run `npx expo start -c` to clear cache

### Method 2: Using Icon Generator Tool
1. Create a single 1024x1024 icon
2. Use online tool: https://www.appicon.co/ or https://easyappicon.com/
3. Generate all sizes
4. Download and replace files

### Method 3: Use AI Generation
1. Use AI tools (DALL-E, Midjourney) to create logo
2. Prompt example: "Simple farm logo, green leaf, minimalist, transparent background"
3. Upscale to 1024x1024
4. Generate smaller sizes

## After Replacing Logo Files

### 1. Clear Build Cache
```bash
npx expo start -c
```

### 2. Rebuild Android APK
```bash
npx eas build --platform android --profile production
```

Or for local build:
```bash
npx expo run:android
```

### 3. Rebuild iOS (if applicable)
```bash
npx eas build --platform ios --profile production
```

## Build Commands

### Development Build
```bash
# Android
npx expo run:android

# iOS (Mac only)
npx expo run:ios
```

### Production Build (EAS)
```bash
# Android APK
npx eas build --platform android --profile production

# iOS
npx eas build --platform ios --profile production

# Both platforms
npx eas build --platform all
```

### Output APK Location
After EAS build completes:
1. Go to https://expo.dev/accounts/nobin23t/projects/kirshner-farm/builds
2. Download the APK
3. File name will be: `com.kirshnerfarm.app-{version}-{buildnumber}.apk`

## Current Brand Colors

Based on your app theme:
- **Primary Green**: `#2D8A4E` (Fresh, natural, farm-like)
- **Light Green**: `#E8F5E9`
- **Dark Green**: `#1B5E20`
- **Text**: `#1A1A1A`
- **Background**: `#FFFEF7` (Cream)

## Testing the Changes

After updating:
1. ✅ Check app name on device home screen shows "Kirshner Farm"
2. ✅ Check app icon looks good on home screen
3. ✅ Check splash screen shows logo on green background
4. ✅ Check login/register screens show new logo
5. ✅ Test on both light and dark mode

## Reverting Changes

If you need to revert to the old name:
```json
{
  "name": "grocery-store-hebrew",
  "slug": "grocery-store-hebrew",
  "scheme": "grocerystorehebrew",
  "android": {
    "package": "com.meshakkirshner.grocery"
  },
  "ios": {
    "bundleIdentifier": "com.meshakkirshner.grocery"
  }
}
```

## Summary

- ✅ **App Name**: Now "Kirshner Farm"
- ✅ **Package Name**: com.kirshnerfarm.app
- ✅ **Brand Color**: Fresh Green (#2D8A4E)
- ✅ **APK Name**: Will include "kirshnerfarm" in filename
- 📝 **Next Step**: Replace logo files in `assets/images/`
- 🚀 **Then**: Rebuild app to see changes

## Quick Logo Replacement Checklist

- [ ] Replace `icon.png` (1024x1024)
- [ ] Replace `android-icon-foreground.png` (432x432)
- [ ] Replace `splash-icon.png` (200x200)
- [ ] Replace `logo.svg` (vector)
- [ ] Replace `favicon.png` (48x48+)
- [ ] Clear cache: `npx expo start -c`
- [ ] Test on device
- [ ] Build new APK if needed
