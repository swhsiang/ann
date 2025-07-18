# Build Documentation for Ann AI

This document provides comprehensive instructions for building Ann AI desktop application for Mac and Windows platforms using electron-builder.

## Prerequisites

### Required Software
- **Node.js** (v20.x or later)
- **Yarn** package manager
- **Git**

### Platform-Specific Requirements

#### macOS
- **Xcode Command Line Tools**: `xcode-select --install`
- **macOS 10.15+** for building universal binaries
- **Apple Developer Account** (for code signing and notarization)

#### Windows
- **Windows 10/11** or **Windows Server 2019+**
- **Visual Studio Build Tools** or **Visual Studio Community**
- **Windows SDK**
- **Code Signing Certificate** (optional, for production builds)

#### Linux (for cross-platform builds)
- **Docker** (recommended for consistent builds)
- **Wine** (for Windows builds on Linux)

## Configuration Overview

Ann AI uses a dual configuration approach:
1. **package.json** - Main build configuration
2. **electron-builder.yml** - Extended configuration options

### Key Configuration Features

- **Universal macOS builds** (Intel + Apple Silicon)
- **Multi-architecture Windows builds** (x64 + ia32)
- **Multiple Linux formats** (AppImage, deb, rpm)
- **Auto-updater support** with GitHub releases
- **Code signing ready** for production releases

## Build Commands

### Development Builds
```bash
# Build for current platform only
yarn dist

# Build unpacked (for testing)
yarn dist:dir
yarn pack

# Platform-specific unpacked builds
yarn pack:mac
yarn pack:win
yarn pack:linux
```

### Production Builds
```bash
# Build for specific platforms
yarn dist:mac      # macOS DMG + ZIP
yarn dist:win      # Windows NSIS + Portable
yarn dist:linux    # Linux AppImage + deb + rpm

# Build for all platforms (requires proper setup)
yarn dist:all

# Build and publish to GitHub releases
yarn dist:publish
yarn dist:draft    # Create draft release
```

## Platform-Specific Build Details

### macOS Builds

**Outputs:**
- `Ann AI-{version}-universal.dmg` - Installer DMG
- `Ann AI-{version}-mac.zip` - Portable ZIP archive

**Features:**
- Universal binary (Intel + Apple Silicon)
- Hardened runtime enabled
- Entitlements configured for camera/microphone access
- Custom DMG background and layout

**Code Signing (Production):**
```bash
# Set environment variables
export CSC_LINK="path/to/certificate.p12"
export CSC_KEY_PASSWORD="certificate_password"
export APPLE_ID="your@apple.id"
export APPLE_ID_PASS="app-specific-password"
export APPLE_TEAM_ID="your_team_id"

yarn dist:mac
```

### Windows Builds

**Outputs:**
- `Ann AI Setup {version}.exe` - NSIS installer (x64 + ia32)
- `Ann AI {version}.exe` - Portable executable (x64)

**Features:**
- Multi-architecture support (x64 + ia32)
- Custom NSIS installer with user options
- Desktop and Start Menu shortcuts
- Uninstaller with app data cleanup

**Code Signing (Production):**
```bash
# Set environment variables
export CSC_LINK="path/to/certificate.p12"
export CSC_KEY_PASSWORD="certificate_password"

yarn dist:win
```

### Linux Builds

**Outputs:**
- `Ann AI-{version}.AppImage` - Portable AppImage
- `ann-ai_{version}_amd64.deb` - Debian package
- `ann-ai-{version}.x86_64.rpm` - RPM package

**Features:**
- AppImage for universal compatibility
- Native package formats for major distributions
- Desktop integration with MIME type support

## GitHub Actions CI/CD

### Workflow Files

1. **`.github/workflows/release.yml`** - Draft releases on tags
2. **`.github/workflows/release-production.yml`** - Production releases

### Triggering Builds

#### Draft Release (Automatic)
```bash
# Create and push a tag
git tag v1.0.0
git push origin v1.0.0
```

#### Production Release (Manual)
1. Go to GitHub Actions
2. Run "Production Release" workflow
3. Specify the release tag

### Required Secrets

For production builds with code signing, configure these GitHub secrets:

#### macOS Secrets
- `MACOS_CERTIFICATE` - Base64 encoded .p12 certificate
- `MACOS_CERTIFICATE_PWD` - Certificate password
- `APPLE_ID` - Apple ID for notarization
- `APPLE_ID_PASS` - App-specific password
- `APPLE_TEAM_ID` - Apple Developer Team ID

#### Windows Secrets
- `WINDOWS_CERTIFICATE` - Base64 encoded .p12 certificate
- `WINDOWS_CERTIFICATE_PWD` - Certificate password

## Local Development Setup

### Initial Setup
```bash
# Clone repository
git clone https://github.com/wshih/ann.git
cd ann

# Install dependencies
yarn install

# Build the application
yarn build

# Test build locally
yarn pack
```

### Testing Builds
```bash
# Quick development build
yarn dist:dir

# Test the built application
# macOS: open release/mac/Ann AI.app
# Windows: release/win-unpacked/Ann AI.exe
# Linux: release/linux-unpacked/ann-ai
```

## Troubleshooting

### Common Issues

#### Build Fails with "Module not found"
```bash
# Clean and reinstall dependencies
rm -rf node_modules yarn.lock
yarn install
yarn build
```

#### macOS: "Developer cannot be verified"
- The app needs to be code signed for distribution
- For local testing, users can right-click → Open to bypass

#### Windows: "Windows protected your PC"
- The app needs to be code signed for distribution
- Users can click "More info" → "Run anyway" for unsigned builds

#### Linux: AppImage won't run
```bash
# Make AppImage executable
chmod +x "Ann AI-*.AppImage"
```

### Debug Mode
```bash
# Enable electron-builder debug output
DEBUG=electron-builder yarn dist
```

### Build Cache Issues
```bash
# Clear electron-builder cache
yarn electron-builder install-app-deps --force
```

## File Structure

```
ann/
├── build/                     # Build resources
│   ├── entitlements.mac.plist # macOS entitlements
│   ├── installer.nsh          # Windows NSIS script
│   ├── icon.icns             # macOS icon (create this)
│   ├── icon.ico              # Windows icon (create this)
│   ├── icon.png              # Linux icon (create this)
│   └── dmg-background.png    # DMG background (create this)
├── dist/                     # Built application files
├── release/                  # Final distributables
├── electron-builder.yml     # Extended build config
└── package.json             # Main build config
```

## Next Steps

1. **Create Icons**: Add platform-specific icons to the `build/` directory
2. **Test Builds**: Run local builds to verify configuration
3. **Setup CI/CD**: Configure GitHub secrets for automated builds
4. **Code Signing**: Obtain certificates for production releases

## Resources

- [electron-builder Documentation](https://www.electron.build/)
- [Electron Documentation](https://www.electronjs.org/docs)
- [Apple Code Signing Guide](https://developer.apple.com/documentation/xcode/notarizing_macos_software_before_distribution)
- [Windows Code Signing Guide](https://docs.microsoft.com/en-us/windows/win32/seccrypto/cryptography-tools)