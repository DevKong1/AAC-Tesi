import { Image, Text, TouchableOpacity, View } from "react-native";

import pictograms from "../utils/pictograms";
import { shadowStyle } from "../utils/shadowStyle";
import { type Pictogram } from "../utils/types/commonTypes";

const PictogramCard: React.FC<{
  pictogram: Pictogram;
  text?: string;
  noCaption?: boolean;
  fontSize?: number;
  bgcolor: string;
  onPress: (...args: any) => void;
  args?: any;
}> = ({ pictogram, text, noCaption, bgcolor, onPress, args }) => {
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
      <Image
        style={{ resizeMode: "contain" }}
        className={`${noCaption ? "h-full" : "h-[75%]"} w-full`}
        //TODO ONLY FOR DEBUG
        source={pictograms[2239]}
        alt={`Pictogram associated to "${pictogram.keywords[0]?.keyword}"`}
      />

      {!noCaption && (
        <View className="flex h-[25%] w-[90%] items-center justify-center">
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            textBreakStrategy="simple"
            className={`text-default font-text  text-center`}
          >
            {/* TODO PASS WORD */}
            {text
              ? text
              : pictogram.keywords.length > 0
              ? pictogram.keywords[0]?.keyword
              : "Undefined"}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default PictogramCard;
