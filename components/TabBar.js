import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "../constants/ui";

const TABS = [
  { id: "browse", label: "Find" },
  { id: "stock", label: "My items" },
  { id: "activity", label: "Requests" },
];

export default function TabBar({ activeTab, onChange }) {
  return (
    <View style={styles.wrap}>
      {TABS.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onChange(tab.id)}
            style={[styles.tab, active && styles.tabActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: 4,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: "center",
    borderRadius: radius.md,
  },
  tabActive: { backgroundColor: colors.primary },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
  },
  labelActive: { color: "#fff" },
});
