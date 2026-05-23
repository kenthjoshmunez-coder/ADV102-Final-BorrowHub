import { FlatList } from "react-native";
import BrowseItemCard from "../BrowseItemCard";
import EmptyState from "../EmptyState";

export default function BrowseTab({
  items,
  onBorrow,
  borrowingId,
  listStyle,
}) {
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      contentContainerStyle={listStyle}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <EmptyState
          emoji="🔍"
          title="No items yet"
          message="Go to My items and share something to lend. Then others can find it here."
        />
      }
      renderItem={({ item }) => (
        <BrowseItemCard
          item={item}
          onBorrow={onBorrow}
          borrowing={borrowingId === item.id}
        />
      )}
    />
  );
}
