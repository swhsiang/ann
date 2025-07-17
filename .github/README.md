# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated CI/CD, releases, and maintenance.

## Workflows Overview

### 1. CI Workflow (`ci.yml`)
**Triggers:** Push to main/develop, Pull Requests to main

**What it does:**
- Runs on multiple Node.js versions (18.x, 20.x)
- Type checking with TypeScript
- Code linting with ESLint
- Unit tests with Jest (with coverage)
- E2E tests with Playwright
- Cross-platform build testing (Ubuntu, Windows, macOS)
- Uploads test results and build artifacts on failure

### 2. Release Workflow (`release.yml`)
**Triggers:** Git tags matching `v*.*.*`, Manual dispatch

**What it does:**
- Builds for all platforms (macOS, Windows, Linux)
- Creates GitHub releases with artifacts
- Generates release notes automatically
- Supports pre-release detection (beta, alpha, rc)
- Uploads auto-updater metadata files

### 3. Production Release Workflow (`release-production.yml`)
**Triggers:** Published releases, Manual dispatch

**What it does:**
- Full test suite execution
- Code signing for macOS and Windows (with certificates)
- macOS notarization support
- Security auditing
- Production-ready builds with signing
- Automated cleanup of sensitive files

### 4. Maintenance Workflow (`maintenance.yml`)
**Triggers:** Weekly schedule (Mondays 9 AM UTC), Manual dispatch

**What it does:**
- Security vulnerability scanning
- Dependency update checks
- Automated dependency updates via PR
- Issue creation for security alerts

## Setup Requirements

### For Basic CI/CD:
No additional setup required - workflows will run with default GitHub tokens.

### For Code Signing (Production):
Add these secrets to your repository:

#### macOS Code Signing:
- `MACOS_CERTIFICATE`: Base64 encoded .p12 certificate
- `MACOS_CERTIFICATE_PWD`: Certificate password
- `APPLE_ID`: Apple Developer ID email
- `APPLE_ID_PASS`: App-specific password
- `APPLE_TEAM_ID`: Apple Team ID

#### Windows Code Signing:
- `WINDOWS_CERTIFICATE`: Base64 encoded .p12 certificate
- `WINDOWS_CERTIFICATE_PWD`: Certificate password

### Setting up Secrets:
1. Go to your repository Settings
2. Navigate to Secrets and Variables → Actions
3. Add the required secrets listed above

## Usage

### Triggering Releases:
1. **Automatic:** Push a git tag matching `v*.*.*`
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Manual:** Use the "Actions" tab and run "Release" workflow

### Monitoring:
- Check the "Actions" tab for workflow status
- Failed builds will upload logs and test results
- Security issues will create GitHub issues automatically

## Artifacts

### CI Builds:
- Test results (on failure)
- Build artifacts for each platform
- Retention: 3-7 days

### Release Builds:
- Platform-specific installers (.dmg, .exe, .AppImage, .deb)
- Auto-updater files (.blockmap, latest*.yml)
- Retention: 30 days

## Customization

### Adding New Platforms:
Edit the `matrix` section in workflows to include additional platforms or architectures.

### Changing Test Commands:
Update the test steps in `ci.yml` to match your testing setup.

### Modifying Release Assets:
Update the `files` pattern in release workflows to include/exclude specific file types.

## Troubleshooting

### Common Issues:
1. **Build failures:** Check Node.js version compatibility
2. **Code signing failures:** Verify certificate secrets are correctly encoded
3. **Test failures:** Ensure all dependencies are properly cached
4. **Release upload failures:** Check GitHub token permissions

### Debug Mode:
Add this to workflow environment variables for verbose logging:
```yaml
env:
  DEBUG: electron-builder
```