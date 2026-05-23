import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../constants/ui";

export default function EmptyState({ emoji, title, message }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
  },
  emoji: { fontSize: 48, marginBottom: spacing.md },
  title: { ...typography.title, marginBottom: spacing.xs },
  message: { ...typography.subtitle, textAlign: "center" },
});
