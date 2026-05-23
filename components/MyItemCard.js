import { StyleSheet, Text, View } from "react-native";
import { getCategoryMeta } from "../constants/categories";
import { colors, spacing, typography } from "../constants/ui";
import AppButton from "./AppButton";
import StockBadge from "./StockBadge";

export default function MyItemCard({ item, onRemove, removing = false }) {
  const meta = getCategoryMeta(item.category);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.emoji}>{meta.emoji}</Text>
        <View style={styles.info}>
          <Text style={styles.name}>{item.itemName}</Text>
          <Text style={styles.category}>{meta.label}</Text>
        </View>
      </View>

      <StockBadge item={item} large />

      {item.description ? (
        <Text style={styles.desc}>{item.description}</Text>
      ) : null}

      <AppButton
        title={removing ? "Deleting..." : "Delete listing"}
        variant="danger"
        onPress={() => onRemove(item)}
        loading={removing}
        disabled={removing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  emoji: { fontSize: 32 },
  info: { flex: 1 },
  name: { ...typography.title, fontSize: 17 },
  category: { ...typography.caption, color: colors.primary },
  desc: { ...typography.caption, lineHeight: 20 },
});
