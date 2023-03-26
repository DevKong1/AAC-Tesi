import { Image, Text, TouchableOpacity } from "react-native";

import pictograms from "../utils/pictograms";
import { shadowStyle } from "../utils/shadowStyle";
import { type Pictogram } from "../utils/types/commonTypes";

const PictogramCard: React.FC<{
  pictogram: Pictogram;
  fontSize: number;
  bgcolor: string;
  onPress: (id: number) => void;
}> = ({ pictogram, fontSize, bgcolor, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        shadowStyle.light,
        {
          backgroundColor: bgcolor,
        },
      ]}
      className="m-auto flex h-full h-3/4 w-full w-3/4 flex-col items-center justify-center rounded-[30px]"
      onPress={() => onPress(pictogram._id)}
    >
      <Image className="flex h-3/5 w-3/5" source={pictograms[pictogram._id]} />
      <Text
        style={{ fontSize: fontSize }}
        className={`text-default font-text w-5/6 text-center`}
      >
        {/* TODO PASS WORD */}
        {pictogram.keywords.length > 0
          ? pictogram.keywords[0]!.keyword
          : "Undefined"}
      </Text>
    </TouchableOpacity>
  );
};

export default PictogramCard;
