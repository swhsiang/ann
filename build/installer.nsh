; Custom NSIS installer script for Ann AI
; This file is included in the main installer script

!macro customHeader
  !system "echo 'Building Ann AI installer...'"
!macroend

!macro preInit
  ; Set registry view for both 32-bit and 64-bit
  SetRegView 64
  WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "$PROGRAMFILES64\${PRODUCT_NAME}"
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$PROGRAMFILES64\${PRODUCT_NAME}"
  SetRegView 32
  WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "$PROGRAMFILES\${PRODUCT_NAME}"
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$PROGRAMFILES\${PRODUCT_NAME}"
!macroend

!macro customInit
  ; Custom initialization code
  !system "echo 'Initializing Ann AI installer...'"
!macroend

!macro customInstall
  ; Custom installation steps
  !system "echo 'Installing Ann AI...'"
!macroend

!macro customUnInit
  ; Custom uninstaller initialization
  !system "echo 'Initializing Ann AI uninstaller...'"
!macroend

!macro customUnInstall
  ; Custom uninstallation steps
  !system "echo 'Uninstalling Ann AI...'"
!macroend