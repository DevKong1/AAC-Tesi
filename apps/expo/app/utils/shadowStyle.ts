import { StyleSheet } from "react-native";

export const shadowStyle = StyleSheet.create({
  light: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  heavy: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,

    elevation: 10,
  },
  chatBubble: {
    //iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 7,
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
