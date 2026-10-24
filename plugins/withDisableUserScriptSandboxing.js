const { withXcodeProject } = require('@expo/config-plugins');

// Xcode's build-time User Script Sandboxing blocks the Node-based build
// phases that Expo/React Native rely on (e.g. "[Expo] Configure project",
// "Bundle React Native code and images"), causing them to fail silently
// during `xcodebuild` while working fine when run manually.
module.exports = function withDisableUserScriptSandboxing(config) {
  return withXcodeProject(config, (config) => {
    const xcodeProject = config.modResults;
    const configurations = xcodeProject.pbxXCBuildConfigurationSection();
    for (const key in configurations) {
      const buildSettings = configurations[key]?.buildSettings;
      if (buildSettings) {
        buildSettings.ENABLE_USER_SCRIPT_SANDBOXING = 'NO';
      }
    }
    return config;
  });
};
