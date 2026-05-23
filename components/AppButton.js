import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { colors, radius, spacing } from "../constants/ui";

export default function AppButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
}) {
  const isSecondary = variant === "secondary";
  const isGhost = variant === "ghost";
  const isDanger = variant === "danger";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      style={[
        styles.base,
        isSecondary && styles.secondary,
        isGhost && styles.ghost,
        isDanger && styles.danger,
        (disabled || loading) && styles.disabled,
        Platform.OS === "web" && styles.web,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={isDanger || (!isSecondary && !isGhost) ? "#fff" : colors.primary}
        />
      ) : (
        <Text
          style={[
            styles.text,
            isSecondary && styles.secondaryText,
            isGhost && styles.ghostText,
            isDanger && styles.dangerText,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: "center",
    marginTop: spacing.sm,
    minHeight: 48,
    justifyContent: "center",
  },
  web: { cursor: "pointer" },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: "transparent",
    marginTop: spacing.xs,
  },
  danger: {
    backgroundColor: colors.danger,
    borderWidth: 0,
  },
  disabled: { opacity: 0.55 },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryText: { color: colors.primary },
  ghostText: { color: colors.primary, fontSize: 15 },
  dangerText: { color: "#fff" },
});
