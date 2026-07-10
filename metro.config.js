const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude the old node_modules folder from Metro's resolver and watcher
config.resolver.blockList = [
  /node_modules_old\/.*/,
  /.*\.react-native-.*/,
];

module.exports = config;
