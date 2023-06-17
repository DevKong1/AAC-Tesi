import { FlatList, Text, View } from "react-native";
import Modal from "react-native-modal";

import { useBookStore } from "../store/store";
import { type Book } from "../utils/types/commonTypes";
import BookCard from "./BookCard";

const BookSelectionModal: React.FC<{
  isVisible: boolean;
  onSelect: (el: Book) => void;
  onClose: () => void;
  backdrop?: boolean;
}> = ({ isVisible, onSelect, onClose, backdrop = true }) => {
  const bookStore = useBookStore();

  return (
    <Modal
      backdropOpacity={backdrop ? 0.5 : 0}
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={{ margin: 0 }}
      onBackButtonPress={onClose}
    >
      <View className="absolute bottom-0 h-[75%] w-full flex-col items-center justify-center rounded-t-lg bg-[#2f3235fa]">
        <View className="h-[15%] w-full items-center justify-center pt-2">
          <Text className="font-text m-auto text-base text-white">
            Seleziona un libro da rimuovere:
          </Text>
        </View>
        <View className="h-[85%] w-full items-center justify-center">
          {bookStore.customBooks.length > 0 ? (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={bookStore.customBooks}
              renderItem={(book) => (
                <View className="h-full w-44 items-center justify-center">
                  <BookCard
                    book={book.item}
                    onPress={() => onSelect(book.item)}
                  />
                </View>
              )}
            />
          ) : (
            <Text className="font-text m-auto text-base text-white">
              Nessun libro da rimuovere!
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default BookSelectionModal;
