# Replit Nix Configuration
{ pkgs }: {
  deps = [
    pkgs.nodejs_18
    pkgs.yarn
    pkgs.nodePackages.nodemon
    pkgs.expo-cli
  ];

  # Install Android tools (optional, for Android builds)
  # Uncomment if you need Android:
  # pkgs.android-sdk
  # pkgs.jdk11
  # pkgs.unzip
}
