import { StyleSheet } from "react-native";

export const shadowStyle = StyleSheet.create({
  light: {
    //iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    //Android
    elevation: 5,
  },
  icon: {
    //iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 2,
    shadowRadius: 5,
    //Android
    textShadowRadius: 5,
    textShadowOffset: { width: 0, height: 2 },
  },
});
