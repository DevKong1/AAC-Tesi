import { Dimensions } from "react-native";

export const isDeviceLarge = () => {
  return Dimensions.get("window").width >= 1024;
};
