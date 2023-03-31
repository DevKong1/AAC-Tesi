module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      "nativewind/babel",
      require.resolve("expo-router/babel"),
      "react-native-reanimated/plugin",
    ],
    presets: ["babel-preset-expo"],
  };
};
