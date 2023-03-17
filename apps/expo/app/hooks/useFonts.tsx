import * as Font from "expo-font";

const useFonts = async () => {
  await Font.loadAsync({
    KreonRegular: require("../../assets/fonts/Kreon-Regular.ttf"),
    KreonMedium: require("../../assets/fonts/Kreon-Medium.ttf"),
    KreonBold: require("../../assets/fonts/Kreon-Bold.ttf"),
    KreonSemiBold: require("../../assets/fonts/Kreon-SemiBold.ttf"),
    Montserrat: require("../../assets/fonts/Montserrat.ttf"),
  });
};

export default useFonts;
