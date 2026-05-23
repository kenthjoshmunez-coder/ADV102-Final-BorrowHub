import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { getCategoryMeta } from "../constants/categories";
import { colors, radius, spacing, typography } from "../constants/ui";
import { getItemStock } from "../utils/items";
import AppButton from "./AppButton";
import StockBadge from "./StockBadge";

export default function BrowseItemCard({ item, onBorrow, borrowing }) {
  const [quantity, setQuantity] = useState("1");
  const meta = getCategoryMeta(item.category);
  const stock = getItemStock(item);
  const owner = item.ownerEmail?.split("@")[0] ?? "a classmate";

  const handleBorrow = () => {
    const qty = parseInt(quantity, 10);
    if (!qty || qty < 1) {
      Alert.alert("How many?", "Enter 1 or more.");
      return;
    }
    onBorrow(item, qty);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{meta.emoji}</Text>
        <View style={styles.info}>
          <Text style={styles.name}>{item.itemName}</Text>
          <Text style={styles.owner}>Shared by {owner}</Text>
        </View>
        <StockBadge item={item} large />
      </View>

      {item.description ? (
        <Text style={styles.desc}>{item.description}</Text>
      ) : null}

      <View style={styles.borrowRow}>
        <Text style={styles.qtyLabel}>How many?</Text>
        <TextInput
          style={styles.qtyInput}
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="number-pad"
          maxLength={3}
        />
        <View style={styles.btnWrap}>
          <AppButton
            title={borrowing ? "Sending..." : "Ask to borrow"}
            onPress={handleBorrow}
            disabled={borrowing || stock === 0}
            loading={borrowing}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  emoji: { fontSize: 32 },
  info: { flex: 1 },
  name: { ...typography.title, fontSize: 17 },
  owner: { ...typography.caption, marginTop: 2 },
  desc: {
    ...typography.caption,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  borrowRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  qtyLabel: { ...typography.label, fontSize: 13 },
  qtyInput: {
    width: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.sm,
    textAlign: "center",
    backgroundColor: colors.background,
    fontSize: 16,
    fontWeight: "600",
  },
  btnWrap: { flex: 1 },
});
