const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Ignore common large folders that cause watcher explosions
config.watchFolders = config.watchFolders || [];
config.resolver.nodeModulesPaths = [__dirname + "/node_modules"];

module.exports = config;