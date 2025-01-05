module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"], // This is required for Expo apps.
    plugins: [
      "react-native-reanimated/plugin",
    ],
  };
};
