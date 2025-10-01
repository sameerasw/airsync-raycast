# AirSync Raycast Extension

Control your AirSync macOS app directly from Raycast with this powerful extension.

## Features

This extension provides 5 commands to interact with your AirSync app:

### 1. 📱 Show Status
View detailed information about your connected Android device:
- Device name
- IP address and port
- ADB connection status
- Notification count
- Device version

### 2. 🔌 Disconnect Device
Quickly disconnect from your currently connected device with visual feedback.

### 3. 🔄 Reconnect Device
Reconnect to your last connected device on the current network.

### 4. 🔔 View Notifications
Browse all notifications from your Android device in a beautiful list view:
- View notification title, body, and source app
- Copy notification content
- See the last 20 notifications

### 5. 🎵 Media Controls
View current media playback information:
- Track title, artist, and album
- Playing/paused status
- Volume level and mute status
- Like/dislike status

## Requirements

- macOS with [AirSync](https://www.sameerasw.com/airsync) app installed and running
- Raycast installed
- Node.js 20+ (for development)

## Installation

### From Source

1. Clone this repository:
```bash
git clone https://github.com/sameerasw/airsync-raycast.git
cd airsync-raycast
```

2. Install dependencies:
```bash
npm install
```

3. Run in development mode:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Development

### Project Structure

```
airsync-raycast/
├── src/
│   ├── status.tsx          # Device status command
│   ├── disconnect.tsx      # Disconnect command
│   ├── reconnect.tsx       # Reconnect command
│   ├── notifications.tsx   # Notifications list command
│   ├── media.tsx           # Media player command
│   └── utils/
│       └── applescript.ts  # AppleScript utilities
├── assets/
│   └── extension-icon.png  # Extension icon (512x512)
├── package.json            # Extension manifest
└── tsconfig.json           # TypeScript configuration
```

### AppleScript Commands Used

The extension communicates with AirSync using these AppleScript commands:

- `tell application "AirSync" to get status` - Get device status (returns JSON)
- `tell application "AirSync" to disconnect` - Disconnect from device
- `tell application "AirSync" to reconnect` - Reconnect to device
- `tell application "AirSync" to get notifications` - Get notifications (returns JSON array)
- `tell application "AirSync" to get media` - Get media info (returns JSON)

### Scripts

- `npm run dev` - Run in development mode with Raycast
- `npm run build` - Build the extension
- `npm run lint` - Lint the code
- `npm run fix-lint` - Fix linting issues

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Author

Created by [@sameerasw](https://github.com/sameerasw)

## Links

- [AirSync Website](https://www.sameerasw.com/airsync)
- [Raycast Store](https://raycast.com)

---

Made with ❤️ for the AirSync community
