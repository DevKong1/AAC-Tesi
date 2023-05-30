import { Image, TouchableOpacity } from "react-native";

import { shadowStyle } from "../utils/shadowStyle";
import { type Book } from "../utils/types/commonTypes";

const BookCard: React.FC<{
  book: Book;
  onPress: (...args: any) => void;
  args?: any;
}> = ({ book, onPress, args }) => {
  return (
    <TouchableOpacity
      style={shadowStyle.heavy}
      className="mx-auto flex h-5/6 w-5/6 flex-col items-center justify-center rounded-3xl"
      onPress={() => onPress(args)}
    >
      <Image
        style={{ resizeMode: "cover" }}
        className="h-full w-full rounded-3xl"
        source={book.cover}
        alt={`Cover for "${book.title}"`}
      />
    </TouchableOpacity>
  );
};

export default BookCard;
