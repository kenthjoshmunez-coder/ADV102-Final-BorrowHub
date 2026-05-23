import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "../constants/ui";

export default function Screen({
  children,
  scroll = false,
  center = false,
  padded = true,
}) {
  const content = scroll ? (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        center && styles.centered,
        padded && styles.padded,
      ]}
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.inner, center && styles.centered, padded && styles.padded]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  centered: {
    justifyContent: "center",
  },
  padded: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
});
