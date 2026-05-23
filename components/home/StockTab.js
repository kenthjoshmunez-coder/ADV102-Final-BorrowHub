import { FlatList, StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../../constants/ui";
import EmptyState from "../EmptyState";
import MyItemCard from "../MyItemCard";

export default function StockTab({
  items,
  totalStock,
  listStyle,
  onRemoveItem,
  removingId,
}) {
  return (
    <>
      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Items you shared</Text>
        <Text style={styles.summaryValue}>{totalStock} total</Text>
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={listStyle}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            emoji="📋"
            title="No items listed yet"
            message='Tap "+ Share new item" above to list something others can borrow.'
          />
        }
        renderItem={({ item }) => (
          <MyItemCard
            item={item}
            onRemove={onRemoveItem}
            removing={removingId === item.id}
          />
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  summary: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.primaryLight,
    padding: spacing.md,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: { ...typography.label, color: colors.primaryDark },
  summaryValue: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.primaryDark,
  },
});
