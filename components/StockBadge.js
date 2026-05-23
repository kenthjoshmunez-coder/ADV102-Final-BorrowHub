import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "../constants/ui";
import { getItemStock } from "../utils/items";

export default function StockBadge({ item, large = false }) {
  const stock = getItemStock(item);
  const out = stock === 0;

  return (
    <View style={[styles.badge, out && styles.out, large && styles.large]}>
      <Text style={[styles.text, out && styles.outText, large && styles.largeText]}>
        {out ? "Out of stock" : `${stock} in stock`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.availableBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  out: {
    backgroundColor: colors.borrowedBg,
  },
  large: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.available,
  },
  outText: {
    color: colors.borrowed,
  },
  largeText: {
    fontSize: 14,
  },
});
