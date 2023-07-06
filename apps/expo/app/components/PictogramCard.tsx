import { Image, Text, TouchableOpacity, View } from "react-native";

import { useCategoryStore, usePictogramStore } from "../store/store";
import pictograms from "../utils/pictograms";
import { shadowStyle } from "../utils/shadowStyle";
import { type Pictogram } from "../utils/types/commonTypes";

const PictogramCard: React.FC<{
  pictogram?: Pictogram;
  text?: string;
  textAtTop?: boolean;
  noCaption?: boolean;
  border?: string;
  full?: boolean;
  horizontal?: boolean;
  radius?: number;
  bgcolor?: string;
  highlight?: boolean;
  highlightIndicatorSize?: number;
  onPress: (...args: any) => void;
  args?: any;
}> = ({
  pictogram,
  text,
  textAtTop,
  noCaption,
  border,
  full,
  horizontal,
  radius,
  bgcolor,
  highlight,
  highlightIndicatorSize,
  onPress,
  args,
}) => {
  const pictogramStore = usePictogramStore();
  const categoryStore = useCategoryStore();

  const defaultColor = "#C6D7F9";
  const highlightColor = "#FFFFCA";

  const getText = () => {
    if (text) return text;
    return pictogram ? pictogramStore.getTextFromPictogram(pictogram) : "";
  };

  const getColor = () => {
    if (highlight) return highlightColor;
    else if (bgcolor) return bgcolor;
    else if (pictogram?.customPictogram?.color)
      return pictogram.customPictogram.color;
    else if (pictogram && pictogramStore.showColors) {
      const color = categoryStore.getCategoryColor(pictogram);
      return color ? color : defaultColor;
    }
    return defaultColor;
  };

  const getTextView = () => {
    return (
      <View className="flex h-[25%] w-[85%] items-center justify-start">
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          textBreakStrategy="simple"
          className={`text-default font-text text-center`}
        >
          {getText()}
        </Text>
      </View>
    );
  };

  const sourcePictogram = () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    if (!pictogram) return pictograms[3418];
    if (pictogram.customPictogram?.image)
      return {
        uri: "data:image/jpeg;base64," + pictogram.customPictogram.image,
      };
    return isNaN(+pictogram._id) || !pictograms[+pictogram._id]
      ? pictograms[3418]
      : pictograms[+pictogram._id];
  };

  return (
    <TouchableOpacity
      style={[
        shadowStyle.light,
        {
          borderRadius: radius ? radius : undefined,
          backgroundColor: getColor(),
          borderColor: border ? border : undefined,
        },
      ]}
      className={`flex ${noCaption || full ? "h-full w-full" : "h-5/6 w-5/6"} ${
        horizontal ? "flex-row" : "flex-col"
      } ${border ? "border" : null} items-center justify-center`}
      onPress={() => onPress(args)}
    >
      {
        // Show text above the image
        !noCaption && textAtTop && getTextView()
      }

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

      {
        // Show text belowe the image
        !noCaption && !textAtTop && getTextView()
      }

      {highlight && (
        <View
          style={{
            height: highlightIndicatorSize ? highlightIndicatorSize : 40,
            width: highlightIndicatorSize ? highlightIndicatorSize : 40,
          }}
          pointerEvents="none"
          className={`absolute bottom-[-10] right-0 opacity-100 transition-all duration-200`}
        >
          <Image
            style={{ resizeMode: "contain" }}
            className="pointer-events-none h-full w-full"
            alt="Indicatore del pittogramma letto"
            source={require("../../assets/images/handIndicator.png")}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default PictogramCard;
