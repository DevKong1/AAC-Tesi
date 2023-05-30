import { Image, Text, TouchableOpacity } from "react-native";

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
      className="mx-auto flex h-5/6 w-5/6 flex-col items-center justify-center rounded-[30px]"
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
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          textBreakStrategy="simple"
          className={`text-default font-text h-[25%] w-[90%] text-center`}
        >
          {/* TODO PASS WORD */}
          {text
            ? text
            : pictogram.keywords.length > 0
            ? pictogram.keywords[0]?.keyword
            : "Undefined"}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default PictogramCard;
