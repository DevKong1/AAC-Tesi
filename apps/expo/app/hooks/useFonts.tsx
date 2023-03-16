import * as Font from "expo-font";

const useFonts = async () => {
  await Font.loadAsync({
    Keon: require("../../assets/fonts/Kreon.ttf"),
    Montserrat: require("../../assets/fonts/Montserrat.ttf"),
  });
};

export default useFonts;
