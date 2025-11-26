# Chit Fund Mobile App

Flutter mobile application for Android and iOS.

## Setup

1. Install Flutter dependencies:
```powershell
flutter pub get
```

2. Configure API endpoint in `lib/config/api_config.dart`:

```dart
// For Android Emulator
static const String baseUrl = 'http://10.0.2.2:5000/api';

// For iOS Simulator
static const String baseUrl = 'http://localhost:5000/api';

// For Physical Device (replace with your computer's IP)
static const String baseUrl = 'http://192.168.1.100:5000/api';
```

3. Run the app:
```powershell
flutter run
```

## Building

### Android APK
```powershell
flutter build apk --release
```
APK will be at: `build/app/outputs/flutter-apk/app-release.apk`

### iOS
```powershell
flutter build ios --release
```

## Features

- **Dashboard**: View collections, dues, and recent payments
- **Customer Management**: Browse customers list
- **Chits**: View active chit groups and member details
- **Payments**: View and filter payment records
- **Authentication**: Secure JWT-based login

## Dependencies

- flutter
- http: API calls
- provider: State management
- shared_preferences: Local storage
- flutter_secure_storage: Secure token storage
- intl: Date formatting

## Project Structure

```
lib/
├── config/              # Configuration files
│   └── api_config.dart
├── models/             # Data models
│   ├── customer.dart
│   ├── payment.dart
│   └── chit_plan.dart
├── providers/          # State management
│   └── auth_provider.dart
├── screens/            # UI screens
│   ├── login_screen.dart
│   ├── home_screen.dart
│   ├── dashboard_screen.dart
│   ├── customers_screen.dart
│   ├── chits_screen.dart
│   └── payments_screen.dart
├── services/           # API services
│   └── api_service.dart
└── main.dart           # App entry point
```

## Requirements

- Flutter SDK: ^3.0.0
- Dart SDK: ^3.0.0
- Android SDK (for Android)
- Xcode (for iOS)

## Running on Device

1. Connect your device via USB (enable USB debugging for Android)
2. Check available devices:
```powershell
flutter devices
```
3. Run on specific device:
```powershell
flutter run -d <device-id>
```

## Troubleshooting

### Connection Issues
- Ensure backend is running and accessible
- For Android emulator, use `10.0.2.2` instead of `localhost`
- For physical devices, use your computer's IP address
- Check firewall settings

### Build Issues
```powershell
flutter clean
flutter pub get
flutter run
```

## Login

Use the same credentials as the web app to login.
