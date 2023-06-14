import { Image, Text, TouchableOpacity, View } from "react-native";

import { usePictogramStore } from "../store/store";
import pictograms from "../utils/pictograms";
import { shadowStyle } from "../utils/shadowStyle";
import { type Pictogram } from "../utils/types/commonTypes";

const PictogramCard: React.FC<{
  pictogram: Pictogram | undefined;
  text?: string;
  noCaption?: boolean;
  bgcolor: string;
  onPress: (...args: any) => void;
  args?: any;
}> = ({ pictogram, text, noCaption, bgcolor, onPress, args }) => {
  const pictogramStore = usePictogramStore();

  const getText = () => {
    if (text) return text;
    return pictogram ? pictogramStore.getTextFromPictogram(pictogram) : "";
  };

  const sourcePictogram = () => {
    if (!pictogram) return pictograms[3418];
    if (pictogram.customPictogram?.image)
      return {
        uri: "data:image/jpeg;base64," + pictogram.customPictogram.image,
      };
    return pictograms[2239];
  };

  return (
    <TouchableOpacity
      style={[
        shadowStyle.light,
        {
          backgroundColor: bgcolor,
        },
      ]}
      className={`mx-auto flex ${
        noCaption ? "h-full w-full" : "h-5/6 w-5/6"
      } flex-col items-center justify-center rounded-[30px]`}
      onPress={() => onPress(args)}
    >
      <View
        className={`${
          noCaption ? "h-full" : "h-[75%]"
        } w-full items-center justify-center`}
      >
        <Image
          className={`h-[75%] ${
            pictogram?.customPictogram?.image ? "w-[75%]" : "w-full"
          }`}
          style={{ resizeMode: "contain" }}
          //TODO ONLY FOR DEBUG
          source={sourcePictogram()}
          alt={`Image of the associated Pictogram`}
        />
      </View>

      {!noCaption && (
        <View className="flex h-[25%] w-[85%] items-center justify-center">
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            textBreakStrategy="simple"
            className={`text-default font-text text-center`}
          >
            {getText()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default PictogramCard;
