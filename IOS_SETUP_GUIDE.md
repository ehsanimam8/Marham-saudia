# 📱 iOS App Setup Guide for Marham Saudi

This guide explains how to build and run the iOS version of the Marham Saudi patient app. The project uses **Capacitor** to wrap the web application in a native iOS shell.

## 🚀 Approach: Hybrid Native Shell
Most Next.js applications use Server Actions and SSR (Server Side Rendering), which cannot be bundled into a purely static offline app easily.
To support all features (including file uploads, authentication, and video calls) without rewriting the backend, this iOS app acts as a **Native Shell** that loads your live production URL:
`https://marham-saudi-hdod333kt-ehsan-imams-projects.vercel.app`

This ensures that any update you push to Vercel is *immediately* available in the iOS app without releasing a new App Store update (unless you change native code).

## ✅ Prerequisites
1.  **Mac Computer** (Required for iOS development).
2.  **Xcode**: Install from the Mac App Store.
3.  **CocoaPods**: Install by running `sudo gem install cocoapods` in your terminal.

## 🛠️ Setup Instructions

### 1. Install Dependencies
If you haven't already, ensure all packages are installed:
```bash
npm install
```

### 2. Sync Native Projects
This downloads the necessary iOS plugins and updates the existing `ios` folder.
```bash
npx cap sync ios
```
*Note: If `npx cap sync` complains about `pod install`, navigate to the ios folder and run it manually:*
```bash
cd ios/App
pod install
cd ../..
```

### 3. Open in Xcode
Open the project in Xcode to build and run it.
```bash
npx cap open ios
```
Or manually open `ios/App/App.xcworkspace`.

## 📲 Building & Running

1.  **Select Team:** In Xcode, click on the **App** project in the left sidebar. Go to **Signing & Capabilities** tab. select your **Team** (you may need to log in with your Apple ID).
2.  **Select Simulator:** Choose an iPhone simulator (e.g., iPhone 15 Pro) from the top bar.
3.  **Run:** Press the **Play** button (▶️) or `Cmd + R`.
4.  **Test:** The app should launch and load your live Vercel website inside the native view.

## 🎨 Customization
*   **App Icon:** Replace the generic icons in `ios/App/App/Assets.xcassets/AppIcon.appiconset`.
*   **Splash Screen:** Customize the launch storyboard in Xcode.
*   **Permissions:** If you need to add permissions (Camera, Microphone for video calls), open `Info.plist` in Xcode and add keys for `NSCameraUsageDescription` and `NSMicrophoneUsageDescription`.

## ⚠️ Important Note
This app points to your **Production URL**.
If you want to test **Local Development** on the simulator:
1.  Open `capacitor.config.ts`.
2.  Change `url` to `http://YOUR_LOCAL_IP:3000` (e.g., `http://192.168.1.5:3000`).
3.  Run `npx cap sync`.
4.  Restart the app in Xcode.
