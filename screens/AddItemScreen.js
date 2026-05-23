import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import Screen from "../components/Screen";
import { ITEM_CATEGORIES } from "../constants/categories";
import { colors, radius, spacing, typography } from "../constants/ui";
import { createItem } from "../services/itemsService";
import { getFriendlyError } from "../utils/errors";

export default function AddItemScreen() {
  const router = useRouter();
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("1");
  const [category, setCategory] = useState("other");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!itemName.trim()) {
      Alert.alert("Name needed", "What item are you sharing?");
      return;
    }

    const stockNum = parseInt(stock, 10);
    if (!stockNum || stockNum < 1) {
      Alert.alert("How many?", "Enter at least 1.");
      return;
    }

    setLoading(true);
    try {
      await createItem({
        itemName,
        description,
        category,
        stock: stockNum,
      });
      Alert.alert("Done!", "Others can now request to borrow it.");
      router.back();
    } catch (error) {
      Alert.alert("Error", getFriendlyError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll>
      <Text style={styles.title}>Share an item</Text>
      <Text style={styles.subtitle}>
        List something classmates can borrow — phone, book, tool, etc.
      </Text>

      <AppInput
        label="Item name"
        placeholder="e.g. Calculator, iPhone charger"
        value={itemName}
        onChangeText={setItemName}
      />

      <AppInput
        label="Notes (optional)"
        placeholder="Condition, when you can hand it over..."
        value={description}
        onChangeText={setDescription}
        autoCapitalize="sentences"
      />

      <AppInput
        label="How many available?"
        placeholder="1"
        value={stock}
        onChangeText={setStock}
        keyboardType="number-pad"
      />

      <Text style={styles.label}>Type</Text>
      <View style={styles.categories}>
        {ITEM_CATEGORIES.map((cat) => {
          const selected = category === cat.id;
          return (
            <Pressable
              key={cat.id}
              onPress={() => setCategory(cat.id)}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text style={styles.chipEmoji}>{cat.emoji}</Text>
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <AppButton
        title={loading ? "Saving..." : "Share item"}
        onPress={submit}
        loading={loading}
        disabled={loading}
      />

      <AppButton
        title="Go back"
        variant="ghost"
        onPress={() => router.back()}
        disabled={loading}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.hero, fontSize: 26, marginBottom: spacing.xs },
  subtitle: { ...typography.subtitle, marginBottom: spacing.lg },
  label: { ...typography.label, marginBottom: spacing.sm },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipEmoji: { fontSize: 16 },
  chipText: { fontSize: 13, fontWeight: "600", color: colors.text },
  chipTextSelected: { color: "#fff" },
});
